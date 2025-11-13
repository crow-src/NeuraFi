// import {useState, useCallback, useMemo} from 'react';
// import {addToast, closeAll} from '@heroui/react';
// import useSWR from 'swr';
// import {useWalletStore} from '@/app/store';
// import {withError} from '@/lib';
// import {proxyUnisatApiCache, splitUtxo, createPsbt, createCommitTx, createBrc20Content, createKeyPair, createRevealTx, createRunesPsbt, createEtching, createRuneId} from '@/lib';
// import {getAirdropList} from '@/lib';
// import type {OperationType, AgreementType} from '@/lib';
// import {addAirdropItem, addAirdropReceive} from '@/lib/api/db';

// // UTXO管理
// export function useUtxoManage(utxos: IUTXO[]) {
// 	const {wallet} = useWalletStore();
// 	const [isLoading, setIsLoading] = useState<boolean>(false); // 是否加载中

// 	const _splitUtxo = useCallback(
// 		async ({inputs, outputs, feeRate}: {inputs: IUTXO[]; outputs: Output[]; feeRate: number}) => {
// 			if (!inputs) return null;
// 			const psbt = await splitUtxo({inputs, outputs: outputs ?? [], changeAddress: wallet.accounts[0], network: wallet.chain.addressType, feeRate}); // 注意这里
// 			const signedPsbt = await wallet.signPsbt(psbt);
// 			const result = await wallet.pushPsbt(signedPsbt);
// 			return result;
// 		},
// 		[wallet]
// 	);
// 	// prettier-ignore
// 	const split = withError({title: 'splitUtxo', onStart: () => setIsLoading(true), onComplete: () => setIsLoading(false)})(_splitUtxo);
// 	return {utxos, isLoading, split};
// }

// // 铭刻hook 最好拆分成两个，一个查询数据 一个铭刻
// export function useOrdinals({agreement}: {agreement: AgreementType}) {
// 	const {wallet} = useWalletStore();
// 	// const {utxos} = useUserDataStore();
// 	const utxos: IUTXO[] = [];
// 	const [isRunning, setIsRunning] = useState<boolean>(false);

// 	// 铭刻2 用自己做的库铭刻 - 使用新的铭文方法 isSelfSign 代表揭示交易使用自己钱包签名还是创建的私钥签名
// 	const _inscribe = useCallback(
// 		async ({operation, contents, outputs = [], isSelfSign = false, isSplit = false, feeRate}: {operation: OperationType; contents: Array<{contentType: string; body: string}>; outputs?: Output[]; isSelfSign?: boolean; feeRate: number; isSplit?: boolean}) => {
// 			console.log('铭刻时的输出outputs:', outputs);
// 			console.log('生成的铭文内容:', contents);

// 			const keypair = createKeyPair(wallet.chain?.addressType ?? 'livenet'); // 1. 创建铭文密钥对
// 			const publicKey = isSelfSign ? wallet.publicKey : keypair.publicKey.toString('hex'); // 2. 检查是否自己签名
// 			const networkType = wallet.chain?.addressType ?? 'livenet'; // 3. 检查网络配置

// 			// 4. 创建提交交易
// 			const commitResult = await createCommitTx({
// 				networkType,
// 				inputs: utxos,
// 				changeAddress: wallet.accounts[0], // 找零
// 				feeRate, // feeRate
// 				contents, // 直接传入内容数组
// 				publicKey // 不同的公钥
// 			});

// 			const _outputs = outputs.length > 0 ? outputs : [{address: wallet.accounts[0], value: 546}]; // 铭文输出 默认是用户钱包地址

// 			if (isSelfSign) {
// 				// 如果自己签名揭示
// 				const unsignedRevealPsbt = await createRevealTx({
// 					networkType, // 使用相同的网络类型
// 					commitData: commitResult.commitTxData,
// 					commitTxResult: {
// 						txId: commitResult.txid, // 使用预估的txid
// 						vout: 0,
// 						sendAmount: commitResult.commitValue
// 					},
// 					outputs: _outputs,
// 					revealFee: commitResult.revealFee
// 					// keypair: isSelfSign ? undefined : keypair // 选择是否传递 keypair 对象
// 				});

// 				const psbtList = unsignedRevealPsbt.map(item => item.psbtHex);

// 				// 一次性签名两个 PSBT
// 				const signedTxList = await wallet.signPsbts([commitResult.psbtHex, ...psbtList], {
// 					autoFinalized: true, // 不自动完成PSBT，需要手动finalize
// 					toSignInputs: [
// 						// 指定要签名的输入数组
// 						{
// 							index: 0, // 第一个PSBT（提交交易）的输入索引
// 							address: wallet.accounts[0], // 钱包地址，用于识别私钥
// 							publicKey: wallet.publicKey, // 钱包公钥，确保使用正确的私钥
// 							sighashTypes: [], // 签名哈希类型，空数组表示使用默认SIGHASH_ALL
// 							disableTweakSigner: false, // 使用tweaked私钥（普通Taproot地址）
// 							useTweakedSigner: false // 不使用tweaked签名器
// 						},
// 						{
// 							index: 0, // 第二个PSBT（揭示交易）的输入索引
// 							address: wallet.accounts[0], // 钱包地址，用于识别私钥
// 							publicKey: wallet.publicKey, // 钱包公钥，确保使用正确的私钥
// 							sighashTypes: [], // 签名哈希类型，空数组表示使用默认SIGHASH_ALL
// 							disableTweakSigner: true, // 使用原始私钥签名 Taproot 输入（铭文地址需要）
// 							useTweakedSigner: false // 不使用tweaked签名器
// 						}
// 					]
// 				});
// 				const commitTxid = await wallet.pushPsbt(signedTxList[0]);
// 				console.log('提交交易广播成功 交易ID:', commitTxid);
// 				await new Promise(resolve => setTimeout(resolve, 3000)); // 等待5秒
// 				console.log('揭示交易预估txid', unsignedRevealPsbt[1].txid);
// 				// 推送第二笔主揭示交易
// 				const revealTxid = await wallet.pushPsbt(signedTxList[1]);
// 				console.log('揭示交易真实txid', revealTxid);

// 				// 推送所有之后交易
// 				for (let i = 2; i < signedTxList.length; i++) {
// 					const txid = await wallet.pushPsbt(signedTxList[i]);
// 					console.log('子揭示交易真实txid', txid);
// 				}

// 				return revealTxid; // 返回主揭示的txid
// 			} else {
// 				// 创建私钥签名揭示交易
// 				// 4. 用钱包签名并广播提交交易
// 				console.log('输出预估的提交txid', commitResult.txid);
// 				// console.log('提交交易广播成功 txid:', commitTxid);
// 				// 等待提交交易确认（可选，但建议等待）
// 				console.log('等待揭示交易提交确认...');
// 				await new Promise(resolve => setTimeout(resolve, 3000)); // 等待3秒

// 				// 4. 创建并广播揭示交易
// 				const signedRevealPsbt = await createRevealTx({
// 					networkType, // 使用相同的网络类型
// 					commitData: commitResult.commitTxData,
// 					// commitTxResult: {txId: commitTxid, vout: 0, sendAmount: commitResult.commitValue},
// 					commitTxResult: {txId: commitResult.txid, vout: 0, sendAmount: commitResult.commitValue}, // 使用预估的txid 创建揭示交易
// 					outputs: _outputs,
// 					revealFee: commitResult.revealFee,
// 					keypair: keypair // 传递 keypair 对象
// 				});

// 				let signedPsbt: string[] = [];

// 				if (!isSplit && operation === 'transfer') {
// 					// 单步转移
// 					console.log('单步直接转移');
// 					// 如果单步直接转移 ，要将所有揭示交易的txid作为输入 输出是所有输出 再创建一个分发交易 一次性将转移铭文的utxo 发送给指定地址
// 					const outputs = _outputs.map(item => ({address: item.address, value: 546})); // 每个546
// 					const psbt = createPsbt({inputs: signedRevealPsbt.map(item => ({txid: item.txid, index: 0, value: 546})), outputs, network: wallet.chain.addressType, signerAddress: wallet.accounts[0]});

// 					console.log('所有揭示交易txid!！!!!!', signedRevealPsbt);
// 					// 多签名
// 					signedPsbt = await wallet.signPsbts([commitResult.psbtHex, psbt]); // 多签名 -签名提交交易和最后的转移铭文
// 					// 先推提交交易
// 					await wallet.pushPsbt(signedPsbt[0]);
// 				} else {
// 					// mint 部署 和非单步转移（拆分铭刻转移铭文）
// 					const signedCommitPsbt = await wallet.signPsbt(commitResult.psbtHex); // 先签名提交交易
// 					await wallet.pushPsbt(signedCommitPsbt); // 推送提交交易
// 				}

// 				console.log('揭示交易预估txid', signedRevealPsbt[0].txid);
// 				console.log('揭示交易创建成功，准备广播...');
// 				const revealTxid = await wallet.pushPsbt(signedRevealPsbt[0].psbtHex); // 推送主揭示交易
// 				console.log('揭示交易预估txid', signedRevealPsbt[0].txid);
// 				console.log('揭示交易真实txid', revealTxid);
// 				// 推送所有之后交易 注意i=1
// 				for (let i = 1; i < signedRevealPsbt.length; i++) {
// 					const txid = await wallet.pushPsbt(signedRevealPsbt[i].psbtHex); // 推送子揭示交易
// 					console.log('子揭示交易真实txid', txid);
// 				}
// 				if (!isSplit && operation === 'transfer') {
// 					// 最后推送最后的分发交易
// 					const txid = await wallet.pushPsbt(signedPsbt[1]);
// 					console.log('分发交易真实txid', txid);
// 				}

// 				return revealTxid; // 最后返回主揭示交易的txid
// 			}
// 		},
// 		[utxos, wallet]
// 	);

// 	// 获取符文UTXO 余额
// 	const _getRunesUTXO = useCallback(
// 		async (runeid: string) => {
// 			const res = await proxyUnisatApiCache(wallet.chain, {method: 'GET', url: `/v1/indexer/address/${wallet.accounts[0]}/runes/${runeid}/utxo`});
// 			return res.success ? res?.data?.data?.utxo : [];
// 		},
// 		[wallet.chain, wallet.accounts]
// 	);

// 	// mint方法
// 	const _mint = async ({token, amount, outputs, feeRate = 1}: {agreement: AgreementType; token: string; amount: string; outputs: Output[]; feeRate: number}) => {
// 		const network = wallet.chain?.addressType ?? 'livenet';

// 		if (agreement === 'BRC-20') {
// 			// 创建铭文内容
// 			const contents = createBrc20Content({method: 'mint', tick: token, amt: [amount]});
// 			return await _inscribe({operation: 'mint', contents, outputs, feeRate});
// 		} else {
// 			console.log('符文铸造', token, amount, outputs, feeRate);
// 			const runeId = createRuneId({runeId: token});
// 			const hash = await createRunesPsbt({operation: 'mint', network, inputs: utxos, outputs, receiveAddress: wallet.accounts[0], changeAddress: wallet.accounts[0], feeRate, runestone: runeId});
// 			const tx = await wallet.signPsbt(hash); // 签名提交交易
// 			const txid = await wallet.pushPsbt(tx); // 推送交易
// 			return txid;
// 		}
// 	};
// 	// 转移方法
// 	const _transfer = async ({token, amounts, outputs, isSplit = false, feeRate = 1}: {agreement: AgreementType; token: string; amounts: string[]; outputs: Output[]; isSplit?: boolean; feeRate: number}) => {
// 		const network = wallet.chain?.addressType ?? 'livenet';
// 		if (agreement === 'BRC-20') {
// 			// 创建铭文内容
// 			const contents = createBrc20Content({method: 'transfer', tick: token, amt: amounts});
// 			return await _inscribe({operation: 'transfer', contents, outputs, feeRate, isSplit});
// 		} else {
// 			const inputs = await _getRunesUTXO(token);
// 			const runeId = createRuneId({runeId: token});

// 			// const edicts = createEdict({runeId: token, outputs, pointer: 1}); //创建不同转移符石参数
// 			const hash = await createRunesPsbt({operation: 'transfer', network, inputs, outputs, receiveAddress: wallet.accounts[0], changeAddress: wallet.accounts[0], feeRate, runestone: runeId});
// 			const tx = await wallet.signPsbt(hash); // 签名提交交易
// 			const txid = await wallet.pushPsbt(tx); // 推送交易
// 			return txid;
// 		}
// 	};

// 	const _deploy = async ({token, max, limit, symbol, spacers, premine, amount, cap, heightStart, heightEnd, offsetStart, offsetEnd, outputs, feeRate = 1}: {agreement: AgreementType; token: string; max: string; limit: string; symbol: string; spacers: number; premine: number; amount: number; cap: number; heightStart: number; heightEnd: number; offsetStart: number; offsetEnd: number; outputs: Output[]; feeRate: number}) => {
// 		const network = wallet.chain?.addressType ?? 'livenet';
// 		if (agreement === 'BRC-20') {
// 			const contents = createBrc20Content({method: 'deploy', tick: token, max: max, limit: limit, amt: []}); // 创建铭文内容 设置amt为空
// 			return await _inscribe({operation: 'deploy', contents, outputs, feeRate});
// 		} else {
// 			// export const createEtching = ({name, divisibility = 0, symbol = '$', spacers, premine, amount, cap, heightStart, heightEnd, offsetStart, offsetEnd}: {name: string; divisibility: number; symbol?: string; spacers?: number; premine?: number; amount: number; cap: number; heightStart?: number; heightEnd?: number; offsetStart?: number; offsetEnd?: number}): IEtching => {
// 			const etching = createEtching({name: token, divisibility: 0, symbol: symbol || '$', spacers, premine, amount, cap, heightStart, heightEnd, offsetStart, offsetEnd});
// 			const hash = await createRunesPsbt({operation: 'mint', network, inputs: utxos, outputs, receiveAddress: wallet.accounts[0], changeAddress: wallet.accounts[0], feeRate, runestone: etching});
// 			const tx = await wallet.signPsbt(hash); // 签名提交交易
// 			const txid = await wallet.pushPsbt(tx); // 推送交易
// 			return txid;
// 		}
// 	};

// 	const mint = withError({title: 'Mint', onStart: () => setIsRunning(true), onComplete: () => setIsRunning(false)})(_mint);
// 	const transfer = withError({title: 'Transfer', onStart: () => setIsRunning(true), onComplete: () => setIsRunning(false)})(_transfer);
// 	const deploy = withError({title: 'Deploy', onStart: () => setIsRunning(true), onComplete: () => setIsRunning(false)})(_deploy);
// 	return {isRunning, mint, transfer, deploy};
// }

// /**
//  * 选择符文UTXO
//  * @param utxos 所有够用的符文UTXO
//  * @param requiredAmount 需要的符文数量
//  * @returns 选择的UTXO数组
//  */
// export function selectRuneUtxos(utxos: IUTXO[], requiredAmount: string): IUTXO[] {
// 	// 按符文数量从大到小排序
// 	const sortedUtxos = [...utxos].sort((a, b) => {
// 		const aAmount = a.runes?.[0]?.amount ?? '0';
// 		const bAmount = b.runes?.[0]?.amount ?? '0';
// 		return Number(BigInt(bAmount) - BigInt(aAmount)); // 将 bigint 比较结果转换为 number
// 	});

// 	const selectedUtxos: IUTXO[] = [];
// 	let totalAmount = BigInt(0);
// 	const requiredAmountBigInt = BigInt(requiredAmount);

// 	// 从大到小选择UTXO，直到满足所需金额
// 	for (const utxo of sortedUtxos) {
// 		if (totalAmount >= requiredAmountBigInt) break;
// 		const runeAmount = utxo.runes?.[0]?.amount ?? '0';
// 		selectedUtxos.push(utxo);
// 		totalAmount += BigInt(runeAmount);
// 	}

// 	// 如果所有UTXO加起来都不够，返回所有UTXO
// 	if (totalAmount < requiredAmountBigInt) return sortedUtxos;
// 	return selectedUtxos;
// }

// //--------------------------------------------------------------------------------------------

// // 发布空投HOOK - 简化版本
// export function useReleaseAirdrop() {
// 	const [isRunning, setIsRunning] = useState<boolean>(false);

// 	// 发布空投
// 	const _executeAirdrop = async (airdropData: AirdropItem) => {
// 		console.log('发布的空投数据', airdropData);
// 		// 执行空投转账逻辑 再加入数据库
// 		// Todo
// 		const result = await addAirdropItem(airdropData);
// 		addToast({
// 			title: result.success ? 'SUCCESS' : 'ERROR',
// 			description: result.success ? 'Airdrop Success' : 'Airdrop Failed',
// 			timeout: 5000,
// 			shouldShowTimeoutProgress: true,
// 			color: result.success ? 'success' : 'danger'
// 		});
// 		// 5秒后关闭所有toast
// 		setTimeout(() => {
// 			closeAll();
// 		}, 6000);
// 	};
// 	// 获取空投
// 	// prettier-ignore
// 	const executeAirdrop = withError({title: 'ExecuteAirdrop', onStart: () => setIsRunning(true), onComplete: () => setIsRunning(false)})(_executeAirdrop);

// 	return {
// 		isRunning,
// 		executeAirdrop
// 	};
// }

// // 领取空投hook

// export const useAirdrop = () => {
// 	// 使用 useSWR 获取空投列表数据
// 	const {data, error, isLoading, mutate} = useSWR(
// 		'all-airdrop', // 缓存键
// 		async () => {
// 			const res = await getAirdropList();
// 			console.log('全部空投列表', res);
// 			return res.success ? res.data : [];
// 		},
// 		{
// 			revalidateOnFocus: false, // 窗口聚焦时不重新验证
// 			revalidateOnReconnect: true, // 网络重连时重新验证
// 			refreshInterval: 0 // 不自动刷新
// 		}
// 	);

// 	const airdropList: {runes: AirdropItem[]; brc20: AirdropItem[]} = useMemo(() => {
// 		return {
// 			runes: data?.filter((item: AirdropItem) => item.agreement === 'Runes') ?? [],
// 			brc20: data?.filter((item: AirdropItem) => item.agreement === 'BRC-20') ?? []
// 		};
// 	}, [data]);

// 	// 手动刷新数据方法
// 	const refreshAirdropList = useCallback(() => {
// 		mutate();
// 	}, [mutate]);

// 	return {
// 		data,
// 		airdropList, // 使用 SWR 的数据，如果为空则返回空数组
// 		error, // SWR 的错误状态
// 		isLoading, // SWR 的加载状态
// 		refreshAirdropList // 暴露刷新函数以便手动刷新
// 	};
// };

// export const useReceiveAirdrop = () => {
// 	const [isRunning, setIsRunning] = useState<boolean>(false);

// 	// 领取airdrop
// 	const _receiveAirdrop = async (id: string) => {
// 		console.log('领取空投', id);
// 		const result = await addAirdropReceive(id);
// 		addToast({
// 			title: result.success ? 'SUCCESS' : 'ERROR',
// 			description: result.success ? 'Airdrop Received' : 'Airdrop Failed',
// 			timeout: 5000,
// 			shouldShowTimeoutProgress: true,
// 			color: result.success ? 'success' : 'danger'
// 		});
// 		setTimeout(() => {
// 			closeAll();
// 		}, 6000);
// 		return result;
// 	};
// 	// prettier-ignore
// 	const receiveAirdrop = withError({title: 'ReceiveAirdrop', onStart: () => setIsRunning(true), onComplete: () => setIsRunning(false)})(_receiveAirdrop);

// 	return {
// 		isRunning, // 合并加载状态
// 		receiveAirdrop
// 	};
// };
