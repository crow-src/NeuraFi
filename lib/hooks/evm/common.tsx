import {useEffect, useState, useMemo, useCallback} from 'react';
import {addToast, closeAll, Button} from '@heroui/react';
import {useAppKitAccount} from '@reown/appkit/react';
import {Contract, Signer, TransactionReceipt, keccak256, solidityPacked, getCreate2Address, JsonRpcProvider, getAddress} from 'ethers';
import {parseUnits, formatUnits, ZeroAddress, parseEther} from 'ethers';
import {ethers} from 'ethers';

import {useLocalStorage, useMount} from 'react-use';
import {useModalStore} from '@/app/store';
import {useTransactionStore, Transaction, TransactionType, TransactionStatus} from '@/app/store/useTransactionStore';
import {button} from '@/components';
// import {TransactionStateView} from '@/components/client';
import {PROJECT_CONFIG} from '@/config/main';
import {IMulticall} from '@/lib/contract/abi';
import {useBrowserWallet} from '@/lib/hooks';
import {withError} from '@/lib/utils';

// 检测交易状态钩子
export function useTransactionStatus(txHash: string, fun?: () => void) {
	const {provider} = useBrowserWallet(); // 获取当前的 provider
	const [status, setStatus] = useState<string>('pending');
	const [receipt, setReceipt] = useState<TransactionReceipt | null>(null); // 指定 receipt 的类型为 TransactionReceipt 或 null

	useEffect(() => {
		if (!txHash || !provider) return;
		const checkTransaction = async () => {
			try {
				const txReceipt = await provider.getTransactionReceipt(txHash);
				if (txReceipt) {
					setReceipt(txReceipt);
					setStatus(txReceipt.status === 1 ? 'confirmed' : 'failed'); // 确认的:失败的
					if (txReceipt.status === 1 && fun) {
						fun(); // 如果交易成功则执行fun
					}
					// 当交易状态已确定时，停止进一步轮询
					if (txReceipt.status === 1 || txReceipt.status === 0) {
						clearInterval(interval);
					}
				} else {
					setStatus('pending');
				}
			} catch (error) {
				setStatus('error');
				clearInterval(interval); // 发生错误时停止轮询
			}
		};

		const interval = setInterval(checkTransaction, 3000); // 每3秒检查一次交易状态
		return () => clearInterval(interval);
	}, [txHash, provider, fun]); // 加入 fun 作为依赖，确保更新时能够重新绑定

	return {status, receipt};
}

// 创建合约钩子
export function useContract(contractAddress: string, ABI: any, signer?: Signer | null) {
	const {signer: signer2} = useBrowserWallet();
	return useMemo(() => {
		if (contractAddress && ABI && signer2) {
			return new Contract(contractAddress, ABI, signer ?? signer2);
		}
		return null;
	}, [contractAddress, ABI, signer, signer2]);
}

//multicall hook
export function useMulticall(signer?: Signer | null) {
	const {signer: signer2, provider} = useBrowserWallet();
	const multicall = useContract(PROJECT_CONFIG.multicallAddr, IMulticall, signer ?? signer2);

	const call = async (calls: string[][]) => {
		if (!multicall) {
			throw new Error(`Multicall contract not available. Address: ${PROJECT_CONFIG.multicallAddr}`);
		}

		if (!provider) {
			throw new Error('Provider not available');
		}

		try {
			const encodedCallData = multicall.interface.encodeFunctionData('aggregate', [calls]);
			const resultData = await provider.call({to: PROJECT_CONFIG.multicallAddr, data: encodedCallData});
			return multicall.interface.decodeFunctionResult('aggregate', resultData);
		} catch (error) {
			console.error('Error in multicall call:', error);
			throw error;
		}
	};

	return {multicall, multicallAddr: PROJECT_CONFIG.multicallAddr, call};
}

interface TransactionHistoryOptions {
	walletAddress?: string; // 指定钱包地址
	type?: TransactionType;
	status?: TransactionStatus;
	limit?: number;
	autoRefresh?: boolean;
	refreshInterval?: number;
}

// 增强版交易管理 Hook - 包含 UI 逻辑
export function useTransactionManager(options: {onComplete?: () => void} = {}) {
	const {address} = useAppKitAccount(); // 更新：使用 AppKit account
	const {addTransaction, updateTransactionStatus} = useTransactionStore();
	const {showModal, closeModal, isOpen} = useModalStore();
	const {onComplete} = options; // 获取回调函数

	// 添加交易并处理UI逻辑
	const addTransactionWithUI = async (tx: Omit<Transaction, 'timestamp' | 'status'>, options: {showModal?: boolean; autoSimulate?: boolean} = {}) => {
		const shouldShowModal = options.showModal ?? true;
		const autoSimulate = options.autoSimulate ?? true;
		//console.log('tx', tx);
		// 验证必填字段
		if (!tx.hash || !tx.type) {
			throw new Error('Hash, type, and walletAddress are required fields');
		}

		// 添加交易到store
		const newTx = await addTransaction(tx);

		// 显示模态框
		// if (shouldShowModal) {
		// 	showModal({
		// 		label: 'Transaction State',
		// 		body: <TransactionStateView />,
		// 		footer: (
		// 			<Button key='close' className={button()} onPress={() => closeModal()}>
		// 				Close
		// 			</Button>
		// 		)
		// 	});
		// }

		// 自动模拟交易成功（实际项目中应该通过轮询或WebSocket来更新真实状态）
		if (autoSimulate) {
			setTimeout(() => {
				updateTransactionStatus(newTx.hash, 'success');
				// 执行回调函数
				if (onComplete) onComplete();
				// 检查模态框是否打开，如果没有打开则显示提示
				if (!isOpen) {
					const toastKey = addToast({
						title: 'SUCCESS',
						description: 'Transaction completed successfully',
						timeout: 5000,
						shouldShowTimeoutProgress: true,
						color: 'success'
					});

					// 在超时时间结束后关闭所有提示
					setTimeout(() => {
						closeAll();
					}, 6000);
				}
			}, 5000);
		} else {
			// 如果回调
			if (onComplete) {
				onComplete();
			}
		}

		return newTx;
	};

	return {addTransaction: addTransactionWithUI};
}

export function useTransactionHistory(options: TransactionHistoryOptions = {}) {
	const {transactions, getTransactionHistory, clearAllTransactions, deleteTransaction, getStorageSize, subscribeToTransactions, getWalletAddresses} = useTransactionStore();
	const [refreshCount, setRefreshCount] = useState(0);
	const [isLoading, setIsLoading] = useState(true);

	// 使用 react-use 的 useLocalStorage 来读取原始数据（用于调试或备份）
	const [localStorageData] = useLocalStorage<{transactions: Record<string, Transaction[]>}>('claimx-transactions');
	// 获取过滤后的交易历史
	const filteredTransactions = getTransactionHistory(options.walletAddress, {
		type: options.type,
		status: options.status,
		limit: options.limit
	});

	// 获取所有交易（扁平化）
	const allTransactions = Object.values(transactions).flat();

	// 统计信息
	const stats = {
		total: allTransactions.length,
		pending: allTransactions.filter(tx => tx.status === 'pending').length,
		success: allTransactions.filter(tx => tx.status === 'success').length,
		failed: allTransactions.filter(tx => tx.status === 'failed').length,
		storageSize: getStorageSize(),
		walletCount: getWalletAddresses().length
	};

	// 按钱包地址统计
	const walletStats = getWalletAddresses().map(address => ({
		address,
		count: transactions[address]?.length || 0,
		pending: transactions[address]?.filter(tx => tx.status === 'pending').length || 0,
		success: transactions[address]?.filter(tx => tx.status === 'success').length || 0,
		failed: transactions[address]?.filter(tx => tx.status === 'failed').length || 0
	}));

	// 自动刷新功能
	useEffect(() => {
		if (options.autoRefresh && options.refreshInterval) {
			const interval = setInterval(() => {
				setRefreshCount(prev => prev + 1);
			}, options.refreshInterval * 1000);

			return () => clearInterval(interval);
		}
	}, [options.autoRefresh, options.refreshInterval]);

	// 订阅交易更新
	useEffect(() => {
		const unsubscribe = subscribeToTransactions((tx: Transaction) => {
			console.log('Transaction updated:', tx);
			setRefreshCount(prev => prev + 1);
		});

		return unsubscribe;
	}, [subscribeToTransactions]);

	// 初始化加载
	useMount(() => setIsLoading(false));

	// 清空所有记录的方法（带UI提示）
	const clearAll = (walletAddress?: string) => {
		clearAllTransactions(walletAddress);
		addToast({
			title: 'CLEARED',
			description: walletAddress ? `Cleared transactions for wallet ${walletAddress}` : 'All transaction records have been cleared',
			timeout: 3000,
			color: 'success'
		});
	};

	// 删除单条记录的方法（带UI提示）
	const deleteSingle = (hash: string, walletAddress?: string) => {
		deleteTransaction(hash, walletAddress);
		addToast({
			title: 'DELETED',
			description: 'Transaction record has been deleted',
			timeout: 3000,
			color: 'warning'
		});
	};

	// 导出数据（用于备份）
	const exportData = (walletAddress?: string) => {
		const dataToExport = walletAddress ? {[walletAddress]: transactions[walletAddress]} : transactions;
		const dataStr = JSON.stringify(dataToExport, null, 2);
		const dataBlob = new Blob([dataStr], {type: 'application/json'});
		const url = URL.createObjectURL(dataBlob);
		const link = document.createElement('a');
		link.href = url;
		const filename = walletAddress ? `claimx-transactions-${walletAddress}-${Date.now()}.json` : `claimx-transactions-all-${Date.now()}.json`;
		link.download = filename;
		link.click();
		URL.revokeObjectURL(url);
	};

	// 按类型分组的交易
	const groupedByType = allTransactions.reduce(
		(acc, tx) => {
			if (!acc[tx.type]) {
				acc[tx.type] = [];
			}
			acc[tx.type].push(tx);
			return acc;
		},
		{} as Record<TransactionType, Transaction[]>
	);

	// 最近的交易（最新5条）
	const recentTransactions = allTransactions.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);

	return {
		// 数据
		transactions: filteredTransactions,
		allTransactions,
		recentTransactions,
		groupedByType,
		stats,
		walletStats,
		walletAddresses: getWalletAddresses(),
		localStorageData,
		// 状态
		isLoading,
		refreshCount,

		// 操作方法
		clearAll,
		deleteSingle,
		exportData,

		// 工具方法
		getStorageSize,
		getByType: (type: TransactionType) => allTransactions.filter(tx => tx.type === type),
		getByStatus: (status: TransactionStatus) => allTransactions.filter(tx => tx.status === status),
		getByWallet: (walletAddress: string) => transactions[walletAddress] ?? [],
		searchByHash: (hash: string) => allTransactions.find(tx => tx.hash.includes(hash))
	};
}
