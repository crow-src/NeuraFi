import {Psbt, networks, address as Address} from 'bitcoinjs-lib';

import {none, some} from './ord/fts';
import {Rune, RuneId, Runestone, Terms, Range, Etching, Edict} from './ord/runestones';
import {calculateFeeWithChange} from './utils';

import {OperationType, Network} from './index';

// 符石接口
export interface IRunestone {
	edicts: IEdict[]; // 转移指令
	etching: IEtching; // 蚀刻
	mint: IRuneId; // 铸造
	pointer: number; // 指针
}
// 转移参数接口
export interface IEdict {
	runeId: {block: number; tx: number};
	amount: bigint; // 注意这里要转换成bigint
	output?: number; // 输出
}

// 铸造参数接口
export interface IRuneId {
	block: number;
	tx: number;
}

// 部署参数接口
export interface IEtching {
	rune: string; // 符文
	divisibility?: number; // 小数位数
	symbol?: string; // 符号
	spacers?: number; // 空格
	premine?: number; // 预挖
	terms: {
		amount: number; // 每次mint数量
		cap: number; // 上限总量
		heightStart?: number; // 高度开始
		heightEnd?: number; // 高度结束
		offsetStart?: number; // 偏移开始
		offsetEnd?: number; // 偏移结束
	};
}

/**
 * 创建 Runes PSBT - 支持 deploy、mint、transfer 三种操作
 */
export async function createRunesPsbt({operation, network, inputs, outputs = [], receiveAddress, changeAddress, feeRate = 1, runestone, divisibility = 0}: {operation: OperationType; network: Network; inputs: IUTXO[]; outputs?: Output[]; receiveAddress: string; changeAddress: string; feeRate: number; runestone: IRuneId | IEtching | IEdict[]; divisibility?: number}): Promise<string> {
	// 创建 PSBT
	const _network = network === 'livenet' ? networks.bitcoin : networks.testnet;
	const psbt = new Psbt({network: _network});

	// 添加输入
	for (const utxo of inputs) {
		psbt.addInput({
			hash: utxo.txid,
			index: utxo.vout,
			witnessUtxo: {value: utxo.satoshi, script: Address.toOutputScript(receiveAddress, _network)}
		});
	}

	let _runestone;
	let totalOutputValue = 546; // 基础输出值

	switch (operation) {
		case 'deploy':
			{
				const {rune, divisibility: deployDivisibility = 0, symbol = '$', terms} = runestone as IEtching;
				const runeName = Rune.fromName(rune); // 符文名称
				// 创建铸造条款
				const heightRange = new Range(terms.heightStart ? some(terms.heightStart) : none(), terms.heightEnd ? some(terms.heightEnd) : none());
				const offsetRange = new Range(terms.offsetStart ? some(terms.offsetStart) : none(), terms.offsetEnd ? some(terms.offsetEnd) : none());
				const termsObj = new Terms(terms.amount, terms.cap, heightRange, offsetRange);
				const etching = new Etching(some(deployDivisibility), some(0), some(runeName), none(), some(symbol), some(termsObj), true); // 创建蚀刻
				_runestone = new Runestone([], some(etching), none(), none());
			}
			break;

		case 'mint':
			{
				const {block, tx} = runestone as IRuneId;
				_runestone = new Runestone([], none(), some(new RuneId(block, tx)), some(1));
			}
			break;

		case 'transfer':
			{
				const {block, tx} = runestone as IRuneId;
				// 批量创建 Edicts 转移
				const edicts: Array<Edict> = [];
				for (let i = 0; i < outputs.length; i++) {
					const multiplier = Math.pow(10, divisibility);
					const valueInSmallestUnit = Math.round(outputs[i].value * multiplier);
					const edict: Edict = new Edict(new RuneId(block, tx), BigInt(valueInSmallestUnit), i + 1);
					edicts.push(edict);
				}

				console.log('黑犀牛edicts内容输出:', edicts);
				_runestone = new Runestone(edicts, none(), none(), some(edicts.length + 1));
				totalOutputValue = 546 * (edicts.length + 1); // 为转移操作添加额外的输出

				// 添加每个符文输出
				for (let i = 0; i < edicts.length; i++) {
					psbt.addOutput({address: outputs[i].address, value: 546});
				}
			}
			break;

		default:
			throw new Error(`Invalid operation: ${operation}`);
	}

	psbt.addOutput({script: _runestone.encipher(), value: 0}); // 添加 Runestone 输出 op_return
	psbt.addOutput({address: receiveAddress, value: 546}); // 添加接收输出 546satoshi

	// 计算费用和找零
	const [_, feeWithChange] = calculateFeeWithChange(psbt, feeRate, changeAddress);
	const totalInput = inputs.reduce((acc, utxo) => acc + utxo.satoshi, 0);
	const changeAmount = totalInput - feeWithChange - totalOutputValue;
	if (changeAmount > 330) psbt.addOutput({address: changeAddress, value: changeAmount}); // 添加找零输出（如果金额足够）
	return psbt.toHex();
}

// 创建符文id 返回类型为IRuneId 是不是如果出错返回默认runeid？
export const createRuneId = ({runeId}: {runeId: string}): IRuneId => {
	console.log('runeId是', runeId);
	return {
		block: Number(runeId.split(':')[0]),
		tx: Number(runeId.split(':')[1])
	};
};

// 创建符文转移数据 返回类型为IEdict 数组
export const createEdict = ({runeId, outputs, pointer}: {runeId: string; outputs: Output[]; pointer: number}): IEdict[] => {
	return outputs.map((item, index) => ({
		runeId: createRuneId({runeId: runeId}),
		amount: BigInt(item.value), // 转换成大数
		output: index + 1
	}));
};

// 创建符文部署数据 返回类型为IEtching
export const createEtching = ({name, divisibility = 0, symbol = '$', spacers, premine, amount, cap, heightStart, heightEnd, offsetStart, offsetEnd}: {name: string; divisibility: number; symbol?: string; spacers?: number; premine?: number; amount: number; cap: number; heightStart?: number; heightEnd?: number; offsetStart?: number; offsetEnd?: number}): IEtching => {
	return {
		rune: name,
		divisibility: divisibility,
		symbol: symbol,
		spacers: spacers, //
		premine: premine,
		terms: {
			amount: amount,
			cap: cap,
			heightStart: heightStart,
			heightEnd: heightEnd,
			offsetStart: offsetStart,
			offsetEnd: offsetEnd
		}
	};
};

// 增加一个方法 创建runestone 格式数据 返回类型为IRunestone
export const createRunestoneData = ({runeId, outputs, etching, pointer = 1}: {operation: OperationType; runeId: string; outputs: Output[]; etching: IEtching; pointer: number}): IRunestone => {
	return {
		edicts: createEdict({runeId, outputs, pointer}),
		etching: etching,
		mint: createRuneId({runeId: runeId}),
		pointer: pointer
	};
};
