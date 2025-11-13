import {Psbt, networks, payments} from 'bitcoinjs-lib';
import {LEAF_VERSION_TAPSCRIPT} from 'bitcoinjs-lib/src/payments/bip341';
import {ECPairInterface} from 'ecpair';

import {Inscription} from './ord/inscription';
import {toXOnly} from './ord/utils';
import {calculateFee, calculateFeeWithChange, getUnsignedTxid} from './utils';
import {createKeyPair} from './utils';

import {OperationType} from './index';

/**
 * 将见证栈转换为脚本见证格式
 * 这是比特币交易中 witness 数据的标准格式
 * @param witness - 见证栈数组
 * @returns 格式化的见证数据 Buffer
 */
function witnessStackToScriptWitness(witness: Buffer[]): Buffer {
	const res: Buffer[] = [Buffer.from([witness.length])]; // 第一个字节是见证栈长度
	for (const item of witness) {
		res.push(Buffer.from([item.length])); // 每个项目的长度
		res.push(item); // 项目数据
	}
	return Buffer.concat(res);
}

/**
 * 自定义 finalizer 函数
 * 用于完成 Taproot 脚本路径花费的见证数据构造
 * @param inputIndex - 输入索引
 * @param input - 输入数据
 * @returns 包含 finalScriptWitness 的对象
 */
function customFinalizer(inputIndex: number, input: any) {
	let signature = input.tapScriptSig[0].signature; // 获取签名并处理格式
	if (signature.length === 65) signature = signature.slice(0, 64); // 如果签名包含 sighash 字节，则移除它
	const witness = [signature, input.tapLeafScript[0].script, input.tapLeafScript[0].controlBlock]; // 构造 Taproot 脚本路径花费的见证栈 格式: [签名, 脚本, 控制块]
	const finalScriptWitness = witnessStackToScriptWitness(witness); // 将见证栈转换为脚本见证格式
	return {finalScriptWitness};
}

/**
 * 计算提交交易数据
 * 创建 Taproot 铭文所需的脚本和地址信息
 * @param publicKey - 压缩公钥
 * @param inscription - 铭文对象
 * @param network - 网络配置
 * @returns 包含 tapLeafScript、scriptOutput、revealAddress 和 tapInternalKey 的对象
 */

// 定义返回类型
interface ICommitTxData {
	tapLeafScript: {
		leafVersion: number;
		script: Buffer;
		controlBlock: Buffer;
	};
	scriptOutput: Buffer; // 提交交易输出脚本
	tapInternalKey?: Buffer; // tweaked 内部公钥
	revealAddress: string; // 使用简单的 key path 地址（钱包地址）
}

// 创建提交交易数据
export function createCommitTxData(publicKey: Buffer, inscription: Inscription, network: any): ICommitTxData {
	const xOnlyPublicKey = toXOnly(publicKey); // 将压缩公钥转换为 x-only 公钥（32字节）
	const outputScript = inscription.getFullScript(xOnlyPublicKey); // 使用铭文类的 getFullScript 方法

	const scriptTree = {output: outputScript}; // 添加 scriptTree 参数
	const redeem = {output: outputScript, redeemVersion: LEAF_VERSION_TAPSCRIPT}; // 添加 redeem 参数
	const simpleTaproot = payments.p2tr({internalPubkey: xOnlyPublicKey, network}); // 先生成简单的 key path 地址来验证

	const scriptTaproot = payments.p2tr({
		internalPubkey: xOnlyPublicKey, // ✅ 使用原始 x-only 公钥
		scriptTree, // 添加 scriptTree 参数
		redeem, // 添加 redeem 参数来获取 witness
		network
	});

	// 现在可以直接从 witness 数组获取控制块
	const controlBlock = scriptTaproot.witness![scriptTaproot.witness!.length - 1];

	return {
		tapLeafScript: {leafVersion: LEAF_VERSION_TAPSCRIPT, script: outputScript, controlBlock}, // 添加 tapLeafScript 参数
		scriptOutput: scriptTaproot.output!, // 提交交易的输出脚本
		revealAddress: simpleTaproot.address!, // 使用简单的 key path 地址（钱包地址）
		tapInternalKey: xOnlyPublicKey // 原始的 x-only 公钥
	};
}

/**
 * 创建提交交易
 * 创建将资金发送到 Taproot 地址的交易
 * @param networkType - 网络类型
 * @param utxos - 可用的 UTXO 列表
 * @param changeAddress - 找零地址
 * @param feeRate - 手续费率（sat/byte）
 * @param contents - 铭文内容数组
 * @param compressedPubHex - 压缩公钥（十六进制）
 * @returns 包含 PSBT 和相关数据的对象
 */

interface ICommitTx {
	networkType: 'livenet' | 'testnet';
	inputs: IUTXO[];
	changeAddress: string; // 找零地址
	contents: Array<{contentType: string; body: string}>; // 铭文内容数组
	publicKey: string; // 压缩公钥
	feeRate: number; // 手续费率
}

export async function createCommitTx({networkType, inputs, changeAddress, feeRate, contents, publicKey}: ICommitTx) {
	const network = networkType === 'livenet' ? networks.bitcoin : networks.testnet;
	const publicKeyHex = Buffer.from(publicKey, 'hex');

	// 创建多个铭文实例，每个间隔546个sat，从0开始
	const inscriptionInstances = contents.map((content, index) => {
		return new Inscription({
			contentType: content.contentType,
			body: content.body
			// pointer: index * 546 // 0, 546, 1092, 1638...//不再添加指针
		});
	});

	// 改为为每一个铭文创建数据
	const commitTxData: ICommitTxData[] = inscriptionInstances.map(inscription => {
		return createCommitTxData(publicKeyHex, inscription, network);
	});

	// 创建psbt
	const psbt = new Psbt({network});

	const totalInputAmount = inputs.reduce((sum, u) => sum + u.satoshi, 0); // 总输入金额
	// 添加所有输入 UTXO
	inputs.forEach(utxo => {
		psbt.addInput({
			hash: Buffer.from(utxo.txid, 'hex').reverse(), // 注意：txid 需要反转字节顺序
			index: utxo.vout,
			witnessUtxo: {script: Buffer.from(utxo.scriptPk, 'hex'), value: utxo.satoshi}
		});
	});

	// 这里只计算第一笔揭示手续费
	// 计算揭示交易的手续费 通过模拟揭示 PSBT 来计算准确的费用 使用一个commitTxData 来计算 然后单个的手续费*总数量
	const revealPsbt = new Psbt({network});
	revealPsbt.addInput({
		hash: Buffer.from(inputs[0].txid, 'hex').reverse(), // 模拟的输入 txid
		index: inputs[0].vout, // 模拟的输入索引
		witnessUtxo: {
			script: commitTxData[0].scriptOutput, // 真实的脚本输出
			value: inputs[0].satoshi // 模拟的输入金额
		},
		tapLeafScript: [commitTxData[0].tapLeafScript] // 真实的脚本
	});

	// 这里应该根据outputs的长度来添加输出 如果outputs的长度大于1 则添加outputs.length * 546 的输出 否则添加546的输出
	revealPsbt.addOutput({address: commitTxData[0].revealAddress, value: 546}); // 先添加1个 然后计算 手续费 等于每个揭示交易花费的手续费

	const revealFee = calculateFee(revealPsbt, feeRate); // 计算揭示交易的手续费数量 ？？？？？？

	// 再添加之后的铭文 每个铭文花费的手续费是revealFee i =1   第一个之前已经添加过了
	for (let i = 1; i < contents.length; i++) {
		revealPsbt.addOutput({address: commitTxData[0].revealAddress, value: 546 + revealFee}); // 都使用同一个脚本地址
	}

	const fee = calculateFee(revealPsbt, feeRate); // 计算揭示交易的总手续费
	const commitValue = fee + 546 + (contents.length - 1) * (546 + revealFee); // 转给揭示交易总金额

	psbt.addOutput({script: commitTxData[0].scriptOutput, value: commitValue}); // 添加输出到 Taproot 地址 第一个

	const [_, estimatedFee] = calculateFeeWithChange(psbt, feeRate, changeAddress); // 计算手续费 包含找零和手续费
	const changeAmount = totalInputAmount - commitValue - estimatedFee; // 计算找零

	if (changeAmount > 546) psbt.addOutput({address: changeAddress, value: changeAmount}); // 如果找零金额大于 dust limit，则添加找零输出

	return {
		psbtHex: psbt.toHex(),
		txid: getUnsignedTxid({psbt, sign: false}), // 预估交易txid 主揭示的交易txid
		commitValue, // 返回提交交易的金额
		commitTxData, // 返回所有的提交交易数据
		// inscriptionInstances, // 返回所有铭文实例
		revealFee // 返回揭示交易的手续费
	};
}

/**
 * 创建揭示交易
 * 创建从 Taproot 地址花费铭文 UTXO 的交易
 * @param networkType - 网络类型
 * @param commitData - 提交交易的数据
 * @param commitTxResult - 提交交易的结果
 * @param toAddress - 目标地址
 * @param keypair - 密钥对对象（可选）
 * @returns 已签名的交易（PSBT 或原始交易）或未签名的交易哈希
 */

interface IRevealTx {
	networkType: 'livenet' | 'testnet';
	commitData: ICommitTxData[];
	commitTxResult: {
		txId: string; // 交易txid
		vout: number; // 输入索引
		sendAmount: number; // 数量 是支付给本揭示交易的金额
	};
	outputs: Output[];
	revealFee: number;
	keypair?: ECPairInterface;
}

export async function createRevealTx({networkType, commitData, commitTxResult, outputs, revealFee, keypair}: IRevealTx): Promise<{psbtHex: string; txid: string}[]> {
	const network = networkType === 'livenet' ? networks.bitcoin : networks.testnet;
	const psbtList: Psbt[] = [];
	const psbt = new Psbt({network}); // 先创建  本揭示的PSBT
	psbt.addInput({
		hash: Buffer.from(commitTxResult.txId, 'hex').reverse(), // txid 需要反转字节顺序
		index: commitTxResult.vout,
		tapInternalKey: commitData[0].tapInternalKey,
		witnessUtxo: {
			script: commitData[0].scriptOutput, // 提交交易的输出脚本
			value: commitTxResult.sendAmount
		},
		tapLeafScript: [commitData[0].tapLeafScript], // Taproot 叶子脚本
		sequence: 0xfffffffd // 启用 RBF (Replace-By-Fee)
	});

	psbt.addOutput({value: 546, address: outputs[0].address}); // 注意这里的输出地址

	// 循环添加输出 输出是子揭示交易的地址（地址也是主揭示脚本地址）和数据
	for (let i = 1; i < commitData.length; i++) {
		psbt.addOutput({
			script: commitData[0].scriptOutput, // 使用脚本地址，而不是钱包地址
			value: 546 + revealFee // 应该加上子揭示的手续费
		});
	}

	// 预估第一个交易的txid
	const txid = getUnsignedTxid({psbt, sign: false});
	console.log('预估第一个揭示交易的txid', txid);
	psbtList.push(psbt); // 添加本主揭示交易的psbt 到列表
	// 继续添加其它交易的psbt 从1 开始 因为0 已经添加过了
	for (let i = 1; i < commitData.length; i++) {
		const psbt = new Psbt({network});
		psbt.addInput({
			hash: Buffer.from(txid, 'hex').reverse(), // txid 需要反转字节顺序 这里应该是主揭示交易的txid
			index: i, // 这里应该是主揭示交易的vout 从1开始 因为0
			witnessUtxo: {
				script: commitData[0].scriptOutput, // 主揭示交易的输出脚本（使用相同的脚本地址）
				value: 546 + revealFee // 主揭示交易的输出金额
			},
			tapInternalKey: commitData[0].tapInternalKey, // 使用相同的内部密钥
			tapLeafScript: [commitData[i].tapLeafScript], // 使用对应铭文的叶子脚本
			sequence: 0xfffffffd // 启用 RBF (Replace-By-Fee)
		});

		psbt.addOutput({
			address: outputs[i]?.address || outputs[0]?.address, // 输出铭文到目标地址
			value: 546 // 这里直接给546
		});
		psbtList.push(psbt); // 添加到数组
	}

	// 如果没有keypair
	if (!keypair) {
		return psbtList.map(psbt => {
			return {psbtHex: psbt.toHex(), txid: getUnsignedTxid({psbt, sign: false})};
		});
	}
	console.log('有密钥对!');
	const signedTxList: {psbtHex: string; txid: string}[] = []; // 还要返回
	// 如果有keypair 则签名 返回签名后的psbtHex 和txid 先获取预测txid 然后签名 然后返回签名后的psbtHex 和txid
	for (let i = 0; i < psbtList.length; i++) {
		psbtList[i].signInput(0, keypair);
		psbtList[i].finalizeInput(0, customFinalizer);
		signedTxList.push({psbtHex: psbtList[i].toHex(), txid: getUnsignedTxid({psbt: psbtList[i], sign: true})});
	}

	return signedTxList;
}

interface IInscribe {
	contents: Array<{contentType: string; body: string}>;
	inputs: IUTXO[];
	outputs?: Output[];
	isSelfSign?: boolean;
	network: 'livenet' | 'testnet';
	publicKey?: string;
	changeAddress: string;
	feeRate: number;
}

// 铭刻2 用自己做的库铭刻 - 使用新的铭文方法 isSelfSign 代表揭示交易使用自己钱包签名还是创建的私钥签名
export const inscribe = async ({contents, inputs, outputs = [], isSelfSign = false, network, publicKey, changeAddress, feeRate}: IInscribe) => {
	const keypair = createKeyPair(network); // 1. 创建铭文密钥对
	const _publicKey = isSelfSign && publicKey ? publicKey : keypair.publicKey.toString('hex'); // 2. 检查是否自己签名

	// 4. 创建提交交易
	const commitResult = await createCommitTx({
		networkType: network,
		inputs,
		changeAddress, // ？
		feeRate, // feeRate
		contents, // 直接传入内容数组
		publicKey: _publicKey // 压缩公钥
	});
	const _outputs = outputs.length > 0 ? outputs : [{address: changeAddress, value: 546}];

	const unsignedRevealPsbt = await createRevealTx({
		networkType: network, // 使用相同的网络类型
		commitData: commitResult.commitTxData,
		commitTxResult: {
			txId: commitResult.txid, // 使用预估的txid
			vout: 0,
			sendAmount: commitResult.commitValue
		},
		outputs: _outputs,
		revealFee: commitResult.revealFee,
		keypair: isSelfSign ? undefined : keypair // 不传递 keypair 对象
	});
	// 直接返回所有待签名的psbt 和预估的txid 提交交易是第一个
	const psbtList = [{psbtHex: commitResult.psbtHex, txid: commitResult.txid}, ...unsignedRevealPsbt];
	return psbtList;
};

// 创建一个构建brc20铭文内容的方法 不使用useCallback
export const createBrc20Content = ({method, tick, amt, max, limit, count = 1}: {method: OperationType; tick: string; amt: string[]; max?: string; limit?: string; count?: number}) => {
	const contentType = 'application/json';
	switch (method) {
		case 'mint':
			return Array.from({length: count}, () => ({contentType: 'application/json', body: `{"p":"brc-20","op":"mint","tick":"${tick}","amt":"${amt[0] || ''}"}`})); // 根据count创建对应数量的铭文内容，都使用amt[0]
		case 'transfer':
			return amt.map(amount => ({contentType, body: `{"p":"brc-20","op":"${method}","tick":"${tick}","amt":"${amount}"}`})); // 根据amt数组的长度创建对应数量的铭文内容 这样可以不同数量
		case 'deploy':
			return [{contentType, body: `{"p":"brc-20","op":"deploy","tick":"${tick}","max":"${max}","limit":"${limit}"}`}]; // deploy 只返回一个内容
		default:
			return [{contentType, body: `{"p":"brc-20","op":"mint","tick":"${tick}","amt":"${amt[0] || ''}"}`}]; // 默认是mint一次
	}
};

// 序列号说明：
// 禁用 RBF: sequence: 0xffffffff
// 启用 RBF: sequence: 0x00000000 或 0xfffffffd
// 相对时间锁定（1个区块后）: sequence: 0x00000001
// 相对时间锁定（1000个区块后）: sequence: 0x000003e8
// 铭文交易通常使用 0xfffffffd 以启用 RBF 功能
