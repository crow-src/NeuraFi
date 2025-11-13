import ecc from '@bitcoinerlab/secp256k1';
import * as bitcoin from 'bitcoinjs-lib';
import {Psbt, networks, address as Address} from 'bitcoinjs-lib';
import {ECPairFactory} from 'ecpair';

import type {Network, AddressType} from './index';

bitcoin.initEccLib(ecc);
export {bitcoin};

/**
 * 创建密钥对
 * 生成用于 Taproot 地址的密钥对
 * @param networkType - 网络类型 (livenet/testnet)
 * @returns 包含压缩公钥、私钥和密钥对的对象
 */
export function createKeyPair(networkType: 'livenet' | 'testnet') {
	const network = networkType === 'livenet' ? networks.bitcoin : networks.testnet;
	return ECPairFactory(ecc).makeRandom({network});
}

// 计算varint大小
function getVarIntSize(value: number): number {
	if (value < 0xfd) return 1;
	if (value <= 0xffff) return 3;
	if (value <= 0xffffffff) return 5;
	return 9;
}

/**
 * 从 PSBT 中获取预估的 txid（包含 witness 数据）
 */
export function getUnsignedTxid({psbt, sign = false}: {psbt: Psbt; sign?: boolean}): string {
	const psbtCopy = Psbt.fromHex(psbt.toHex()); // 创建一个新的 PSBT 副本
	// 要区分有了签名和没有签名的计算方式 检查是否已经签名（通过检查是否有 witness 数据）
	if (sign) {
		const hasWitness = psbt.data.inputs.some(input => input.finalScriptWitness);
		if (hasWitness) return psbt.extractTransaction().getId(); // 如果已经签名，则直接返回 txid
	} else {
		// 为所有输入添加空的 witness 数据（模拟签名后的状态）
		for (let i = 0; i < psbtCopy.txInputs.length; i++) {
			const input = psbtCopy.data.inputs[i]; // 检查输入是否已经有 witness 数据
			if (!input.finalScriptWitness) {
				// 为 Taproot 输入添加空的 witness
				psbtCopy.updateInput(i, {
					finalScriptWitness: Buffer.from([0x00]) // 空的 witness
				});
			}
		}
	}
	const tx = psbtCopy.extractTransaction(); // 构建完整的交易
	return tx.getId(); // 包含 witness 数据的 txid
}

/**
 * 计算交易费用
 * @param psbt PSBT 对象
 * @param feePerByte 每字节手续费（默认 1 sat/vbyte）
 * @returns 预估交易手续费（单位：satoshi）
 */
export function calculateFee(psbt: bitcoin.Psbt, feeRate: number = 1): number {
	// 基础大小
	let baseSize = 4; // 版本号 +
	let witnessSize = 0;
	let hasWitness = false;

	// 输入数量varint
	const inputCountVarIntSize = getVarIntSize(psbt.txInputs.length);
	baseSize += inputCountVarIntSize;

	psbt.txInputs.forEach((input, index) => {
		const witnessUtxo = psbt.data.inputs[index]?.witnessUtxo;
		const scriptHex = witnessUtxo?.script?.toString('hex') ?? '';
		const prefix = scriptHex.slice(0, 4);

		// 获取实际的见证数据
		const witnessData = psbt.data.inputs[index]?.witnessScript;
		const partialSig = psbt.data.inputs[index]?.partialSig?.[0];

		// 基础输入大小：
		const inputBaseSize = 41; // 32 + 4 + 4 + 1

		switch (prefix) {
			case '76a9': // P2PKH 不使用见证数据，所有数据都在scriptSig中
				const p2pkhScriptSize = 107; // 通常的大小
				baseSize += inputBaseSize + p2pkhScriptSize;

				break;
			case 'a914': // P2SH
				baseSize += inputBaseSize + 23; // 基础大小 + P2SH赎回脚本大小
				if (witnessData) {
					const witnessStackSize = witnessData.length + 2; // 加2是为了计入长度前缀
					witnessSize += witnessStackSize;
					hasWitness = true;
				}
				break;
			case '0014': // P2WPKH // P2WPKH 见证栈包含签名和公钥
				baseSize += inputBaseSize;
				if (partialSig) {
					const sigSize = partialSig.signature.length;
					const pubKeySize = partialSig.pubkey.length;
					const witnessStackSize = sigSize + pubKeySize + 2; // 加2是为了计入长度前缀
					witnessSize += witnessStackSize;
					hasWitness = true;
				}
				break;
			case '0020': // P2WSH
				baseSize += inputBaseSize;
				if (witnessData) {
					witnessSize += witnessData.length + 2; // 加2是为了计入长度前缀
					hasWitness = true;
				}
				break;
			case '5120': // P2TR
				baseSize += inputBaseSize;
				// Taproot 脚本路径花费的见证栈：签名 + 脚本 + 控制块
				const tapLeafScripts = psbt.data.inputs[index]?.tapLeafScript;
				if (tapLeafScripts && tapLeafScripts.length > 0) {
					// 脚本路径花费
					const tapLeafScript = tapLeafScripts[0];
					const signature = psbt.data.inputs[index]?.tapScriptSig?.[0]?.signature;
					const sigSize = signature ? (signature.length >= 64 ? 64 : signature.length) : 64; // 签名大小 (通常是64字节，但可能包含sighash字节)
					const scriptSize = tapLeafScript.script.length; // 脚本大小
					const controlBlockSize = tapLeafScript.controlBlock.length; // 控制块大小 (叶子版本1字节 + 内部公钥32字节 + 默克尔路径)
					witnessSize += 3 + sigSize + scriptSize + controlBlockSize; // 见证栈总大小：3个项目的长度前缀 + 签名 + 脚本 + 控制块
					hasWitness = true;
				} else {
					// 密钥路径花费 (只有签名)
					witnessSize += 1 + 64; // 1个项目的长度前缀 + 64字节签名
					hasWitness = true;
				}
				break;
			default:
				baseSize += inputBaseSize;
				witnessSize += witnessUtxo?.script?.length ?? 0;
				hasWitness = witnessUtxo?.script?.length ? true : false; // 注意这
				break;
		}

		// 计算script长度varint大小
		const scriptLengthVarIntSize = getVarIntSize(baseSize);
		baseSize += scriptLengthVarIntSize;
	});

	// 输出数量varint
	const outputCountVarIntSize = getVarIntSize(psbt.txOutputs.length); // 输出数量
	baseSize += outputCountVarIntSize;

	psbt.txOutputs.forEach((output, index) => {
		const scriptHex = output.script.toString('hex');
		const prefix = scriptHex.slice(0, 4);
		const scriptLength = output.script.length;
		const scriptLengthVarIntSize = getVarIntSize(scriptLength); // 计算script长度varint大小
		// 不同地址类型计算大小
		switch (prefix) {
			case '76a9': // P2PKH
				baseSize += 34;
				break;
			case 'a914': // P2SH
				baseSize += 32;
				break;
			case '0014': // P2WPKH
				baseSize += 43;
				break;
			case '0020': // P2WSH
				baseSize += 31;
				break;
			case '5120': // P2TR
				baseSize += scriptLength + scriptLengthVarIntSize + 8; // P2TR输出大小就是脚本长度 原先是43
				break;
			default: // OP_RETURN
				baseSize += scriptLength + scriptLengthVarIntSize + 8; //  +2 加2是序列化开销
				break;
		}
	});

	if (hasWitness) baseSize += 2; // ？？？2 + 1
	baseSize += 1; // 锁定时间？

	// 计算实际大小
	const totalWeight = baseSize * 4 + witnessSize;
	const virtualSize = totalWeight / 4; // 使用更精确的虚拟大小计算
	const baseFee = virtualSize * feeRate; // 计算手续费（保持精确计算直到最后）
	const fee = Math.ceil(baseFee); // 取整
	return fee + 1; // 加1是为了防止手续费不足
}

// 计算基本手续费和找零手续费
export function calculateFeeWithChange(psbt: bitcoin.Psbt, feeRate: number = 1, changeAddress?: string): [number, number] {
	const baseFee = calculateFee(psbt, feeRate);
	if (!changeAddress) return [baseFee, baseFee]; // 如果没有找零地址 则直接返回无找零的手续费
	const cloned = psbt.clone(); // ✅ clone 防止污染原始 psbt
	cloned.addOutput({address: changeAddress, value: 0});
	const feeWithChange = calculateFee(cloned, feeRate); // 再调用一次 calculateFee 得到 feeWithChange
	return [baseFee, feeWithChange];
}

// 拆分转移utxo
export async function splitUtxo({inputs, outputs, changeAddress, network, feeRate}: {inputs: IUTXO[]; outputs: Output[]; changeAddress: string; network: Network; feeRate: number}): Promise<string> {
	const _network = network === 'livenet' ? bitcoin.networks.bitcoin : bitcoin.networks.testnet;
	const psbt = new bitcoin.Psbt({network: _network});
	let totalInput = 0;
	let totalOutput = 0;

	// 添加输入
	for (const utxo of inputs) {
		const scriptBuffer = Buffer.from(utxo.scriptPk, 'hex');
		psbt.addInput({
			hash: utxo.txid,
			index: utxo.vout,
			witnessUtxo: {script: scriptBuffer, value: utxo.satoshi}, // 这里啰嗦了
			tapInternalKey: Buffer.from(utxo.scriptPk.slice(4, 68), 'hex')
		});
		totalInput += utxo.satoshi;
	}

	// 添加主输出
	for (const output of outputs) {
		const value = output.value;
		psbt.addOutput({address: output.address, value});
		totalOutput += value;
	}

	// 获取预估手续费
	const [baseFee, feeWithChange] = calculateFeeWithChange(psbt, feeRate, changeAddress); // 同时计算出出无找零和有找零的手续费

	// 🧠 校验余额是否足够
	if (totalInput < totalOutput + baseFee) throw new Error(`输入金额不足：总输入=${totalInput} < 总输出=${totalOutput} + 手续费=${baseFee}`);

	// 计算找零金额
	const changeAmount = totalInput - totalOutput - feeWithChange;
	const dustThreshold = 546;

	if (changeAmount >= dustThreshold) psbt.addOutput({address: changeAddress, value: changeAmount});

	return psbt.toHex();
}

/**
 * 选择UTXO
 * @param utxos 所有可用的UTXO
 * @param requiredAmount 需要的金额
 * @returns 选择的UTXO数组
 */
export function selectUtxos(utxos: IUTXO[], requiredAmount: number): IUTXO[] {
	const sortedUtxos = [...utxos].sort((a, b) => b.satoshi - a.satoshi); // 按金额从大到小排序
	const selectedUtxos: IUTXO[] = [];
	let totalAmount = 0;
	// 从大到小选择UTXO，直到满足所需金额
	for (const utxo of sortedUtxos) {
		if (totalAmount >= requiredAmount) break;
		selectedUtxos.push(utxo);
		totalAmount += utxo.satoshi;
	}
	// 如果所有UTXO加起来都不够，返回所有UTXO
	if (totalAmount < requiredAmount) return sortedUtxos;
	return selectedUtxos;
}

/**
 * 简单的地址类型检测（支持主网和测试网）
 * @param address - 比特币地址
 * @param networkType - 网络类型 ('mainnet' | 'testnet')
 * @returns 地址类型字符串
 */
export function getAddressType(address: string, networkType: 'livenet' | 'testnet' = 'livenet'): AddressType {
	try {
		// 根据网络类型选择对应的网络参数
		const network = networkType === 'livenet' ? networks.bitcoin : networks.testnet;

		// 使用对应网络的参数解析地址
		const outputScript = Address.toOutputScript(address, network);
		const scriptHex = outputScript.toString('hex');

		// 根据脚本前缀判断类型
		switch (scriptHex.substring(0, 4)) {
			case '76a9':
				return 'P2PKH';
			case 'a914':
				return 'P2SH';
			case '0014':
				return 'P2WPKH';
			case '0020':
				return 'P2WSH';
			case '5120':
				return 'P2TR';
			default:
				return 'UNKNOWN';
		}
	} catch (error) {
		// 如果解析失败，尝试通过地址前缀进行基本判断
		return getAddressTypeByPrefix(address);
	}
}

/**
 * 通过地址前缀进行基本的地址类型判断（备用方法）
 * @param address - 比特币地址
 * @returns 地址类型字符串
 */
export function getAddressTypeByPrefix(address: string): AddressType {
	// P2PKH 地址
	if (address.startsWith('1') || address.startsWith('m') || address.startsWith('n')) {
		return 'P2PKH';
	}
	// P2SH 地址
	if (address.startsWith('3') || address.startsWith('2')) {
		return 'P2SH';
	}
	// Taproot 地址 (P2TR)
	if (address.startsWith('bc1p') || address.startsWith('tb1p')) {
		return 'P2TR';
	}
	// 其他 Bech32 地址 (P2WPKH/P2WSH)
	if (address.startsWith('bc1') || address.startsWith('tb1')) {
		// 根据长度粗略判断 P2WPKH vs P2WSH
		// P2WPKH: 42字符, P2WSH: 62字符 (大致)
		return address.length <= 45 ? 'P2WPKH' : 'P2WSH';
	}

	return 'UNKNOWN';
}

// 检测是否是某种地址
export function isAddressType(address: string, type: AddressType): boolean {
	return getAddressType(address) === type;
}

// 输入地址数组 和数量 创建output 方法
export function createOutput(addresses: string[], amount: number): Output[] {
	const output = addresses.map(item => ({
		address: item,
		value: amount
	}));
	return output;
}

// 创建psbt  根据输入的txid 和 输出 创建psbt
export function createPsbt({
	inputs,
	outputs,
	network,
	signerAddress
}: {
	inputs: {txid: string; index: number; value: number}[];
	outputs: Output[];
	network: Network;
	signerAddress: string; // 签名地址，用于生成脚本
}): string {
	const psbtNetwork = network === 'livenet' ? networks.bitcoin : networks.testnet;
	const psbt = new bitcoin.Psbt({network: psbtNetwork});

	// 根据签名地址生成输出脚本
	const script = Address.toOutputScript(signerAddress, psbtNetwork);
	const addressType = getAddressType(signerAddress, network === 'livenet' ? 'livenet' : 'testnet');

	console.log('Creating PSBT with:', {
		addressType,
		signerAddress,
		network,
		inputsCount: inputs.length,
		outputsCount: outputs.length
	});

	// 添加输入
	for (let i = 0; i < inputs.length; i++) {
		const input = inputs[i];
		console.log(`Adding input ${i}:`, input);

		try {
			const inputData: any = {
				hash: input.txid,
				index: input.index,
				witnessUtxo: {
					script: script,
					value: input.value
				}
			};

			// 对于 Taproot 地址，需要添加额外信息
			if (addressType === 'P2TR') {
				const tapInternalKey = extractTapInternalKey(signerAddress, network);
				if (tapInternalKey) {
					inputData.tapInternalKey = tapInternalKey;
					console.log('Added tapInternalKey for Taproot address:', tapInternalKey.toString('hex'));
				} else {
					console.warn('Could not extract tapInternalKey from Taproot address');
				}
			}

			// 对于 Legacy 地址，某些钱包可能需要 nonWitnessUtxo
			if (addressType === 'P2PKH' || addressType === 'P2SH') {
				console.log('Legacy address detected, using witnessUtxo (modern wallets support this)');
			}

			psbt.addInput(inputData);
			console.log(`Successfully added input ${i}`);
		} catch (error) {
			console.error(`Error adding input ${i}:`, error);
			throw new Error(`Failed to add input ${i}: ${error}`);
		}
	}

	// 添加输出
	for (let i = 0; i < outputs.length; i++) {
		const output = outputs[i];
		console.log(`Adding output ${i}:`, output);

		try {
			psbt.addOutput({
				address: output.address,
				value: output.value
			});
			console.log(`Successfully added output ${i}`);
		} catch (error) {
			console.error(`Error adding output ${i}:`, error);
			throw new Error(`Failed to add output ${i}: ${error}`);
		}
	}

	// 验证 PSBT
	try {
		const psbtHex = psbt.toHex();
		console.log('PSBT created successfully, length:', psbtHex.length);
		return psbtHex;
	} catch (error) {
		console.error('Error converting PSBT to hex:', error);
		throw new Error(`Failed to serialize PSBT: ${error}`);
	}
}

/**
 * 从 Taproot 地址解码内部公钥
 * @param taprootAddress - Taproot 地址
 * @param network - 网络类型
 * @returns 内部公钥 Buffer 或 null
 */
export function extractTapInternalKey(taprootAddress: string, network: Network): Buffer | null {
	try {
		const psbtNetwork = network === 'livenet' ? networks.bitcoin : networks.testnet;

		// 解码 Taproot 地址
		const decoded = Address.fromBech32(taprootAddress);

		// 检查是否是 Taproot 地址 (witness version 1, 32 字节)
		if (decoded.version === 1 && decoded.data.length === 32) {
			// 对于简单的 key-path Taproot 地址，输出脚本就是内部公钥
			return Buffer.from(decoded.data);
		}

		return null;
	} catch (error) {
		console.error('Error extracting tapInternalKey:', error);
		return null;
	}
}
