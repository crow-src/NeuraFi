'use client';
import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';

// 交易状态类型
export type TransactionStatus = 'pending' | 'success' | 'failed';
export type TransactionType = 'Transfer' | 'Mint' | 'Deploy' | 'Swap' | 'Mint Runes' | 'Transfer Runes' | 'Deploy Runes' | 'Other' | 'Deposit' | 'Withdraw' | 'Renew' | 'Redeposit' | 'CreateAccount' | 'CreateTeam' | 'SetRate';

// 交易记录接口
export interface Transaction {
	hash: string; // 交易哈希（必填）
	type: TransactionType; // 交易类型（必填）
	status: TransactionStatus; // 交易状态
	timestamp: number; // 时间戳（必填，自动生成）
	walletAddress: string; // 调用钱包地址（必填）
	description?: string; // 交易描述（可选）
	amount?: number; // 交易金额（可选）
	fee?: number; // 手续费（可选）
	toAddress?: string; // 接收地址（可选）
	fromAddress?: string; // 发送地址（可选）
	network?: string; // 网络类型（可选）
	metadata?: Record<string, any>; // 额外元数据（可选）
}

interface TransactionStore {
	transactions: Record<string, Transaction[]>; // 按钱包地址分组的交易列表
	transactionListeners: Set<(tx: Transaction) => void>; // 交易监听器
	addTransaction: (tx: Omit<Transaction, 'timestamp' | 'status'>) => Promise<Transaction>;
	updateTransactionStatus: (hash: string, status: TransactionStatus) => void;
	subscribeToTransactions: (listener: (tx: Transaction) => void) => () => void;
	getTransactionHistory: (walletAddress?: string, options?: {type?: TransactionType; status?: TransactionStatus; limit?: number; offset?: number}) => Transaction[];
	clearAllTransactions: (walletAddress?: string) => void; // 清空所有交易记录或指定钱包的记录
	deleteTransaction: (hash: string, walletAddress?: string) => void; // 删除指定交易记录
	getStorageSize: () => number; // 获取存储大小（KB）
	getWalletAddresses: () => string[]; // 获取所有钱包地址
}

export const useTransactionStore = create<TransactionStore>()(
	persist(
		(set, get) => ({
			transactions: {}, // 初始化为空对象
			transactionListeners: new Set(),
			// 添加新交易（纯数据操作，不包含UI逻辑）
			addTransaction: async (tx: Omit<Transaction, 'timestamp' | 'status'>) => {
				const newTx: Transaction = {
					...tx,
					timestamp: Date.now(),
					status: 'pending'
				};

				set(state => {
					const currentTransactions = state.transactions[tx?.walletAddress] || [];
					return {
						transactions: {...state.transactions, [tx.walletAddress]: [newTx, ...currentTransactions]},
						transactionListeners: state.transactionListeners
					};
				});

				// 通知所有监听器
				const {transactionListeners} = get();
				transactionListeners.forEach(listener => listener(newTx));
				return newTx; // 返回新交易供外部使用
			},

			// 更新交易状态
			updateTransactionStatus: (hash: string, status: TransactionStatus) => {
				set(state => {
					const updatedTransactions = {...state.transactions};
					let updatedTx: Transaction | undefined;

					// 遍历所有钱包地址查找交易
					Object.keys(updatedTransactions).forEach(walletAddress => {
						updatedTransactions[walletAddress] = updatedTransactions[walletAddress].map(tx => {
							if (tx.hash === hash) {
								updatedTx = {...tx, status};
								return updatedTx;
							}
							return tx;
						});
					});

					return {transactions: updatedTransactions};
				});

				// 通知所有监听器
				const {transactionListeners, transactions} = get();
				if (transactionListeners.size > 0) {
					// 查找更新的交易
					Object.values(transactions)
						.flat()
						.forEach(tx => {
							if (tx.hash === hash) {
								transactionListeners.forEach(listener => listener(tx));
							}
						});
				}
			},

			// 订阅交易更新
			subscribeToTransactions: (listener: (tx: Transaction) => void) => {
				set(state => ({transactionListeners: new Set([...state.transactionListeners, listener])}));
				// 返回取消订阅的函数
				return () => {
					set(state => {
						const newListeners = new Set(state.transactionListeners);
						newListeners.delete(listener);
						return {transactionListeners: newListeners};
					});
				};
			},

			// 获取交易历史
			getTransactionHistory: (walletAddress?: string, options?: {type?: TransactionType; status?: TransactionStatus; limit?: number; offset?: number}) => {
				const {transactions} = get();

				// 获取指定钱包或所有钱包的交易
				let allTransactions: Transaction[] = [];
				if (walletAddress) {
					allTransactions = transactions[walletAddress] || [];
				} else {
					allTransactions = Object.values(transactions).flat();
				}

				// 应用过滤条件
				let filtered = [...allTransactions];
				if (options?.type) filtered = filtered.filter(tx => tx.type === options.type);
				if (options?.status) filtered = filtered.filter(tx => tx.status === options.status);

				// 按时间戳降序排序
				filtered.sort((a, b) => b.timestamp - a.timestamp);

				const offset = options?.offset ?? 0;
				const limit = options?.limit ?? filtered.length;
				return filtered.slice(offset, offset + limit);
			},

			// 清空所有交易记录
			clearAllTransactions: (walletAddress?: string) => {
				set(state => {
					if (walletAddress) {
						// 清空指定钱包的交易记录
						const updatedTransactions = {...state.transactions};
						delete updatedTransactions[walletAddress];
						return {transactions: updatedTransactions};
					} else {
						// 清空所有交易记录
						return {transactions: {}};
					}
				});
			},

			// 删除指定交易记录
			deleteTransaction: (hash: string, walletAddress?: string) => {
				set(state => {
					const updatedTransactions = {...state.transactions};

					if (walletAddress) {
						// 从指定钱包中删除
						if (updatedTransactions[walletAddress]) {
							updatedTransactions[walletAddress] = updatedTransactions[walletAddress].filter(tx => tx.hash !== hash);
							if (updatedTransactions[walletAddress].length === 0) {
								delete updatedTransactions[walletAddress];
							}
						}
					} else {
						// 从所有钱包中删除
						Object.keys(updatedTransactions).forEach(addr => {
							updatedTransactions[addr] = updatedTransactions[addr].filter(tx => tx.hash !== hash);
							if (updatedTransactions[addr].length === 0) {
								delete updatedTransactions[addr];
							}
						});
					}

					return {transactions: updatedTransactions};
				});
			},

			// 获取存储大小（KB）
			getStorageSize: () => {
				const {transactions} = get();
				const dataSize = JSON.stringify(transactions).length;
				return Math.round((dataSize / 1024) * 100) / 100; // 保留两位小数
			},

			// 获取所有钱包地址
			getWalletAddresses: () => {
				const {transactions} = get();
				return Object.keys(transactions);
			}
		}),
		{
			name: 'NeuraFi-transactions', // localStorage key
			storage: createJSONStorage(() => localStorage),
			// 只持久化 transactions，不持久化 listeners
			partialize: state => ({transactions: state.transactions}),
			// 合并策略：从 localStorage 恢复时重新初始化 listeners
			merge: (persistedState, currentState) => ({
				...currentState,
				...(persistedState as Partial<TransactionStore>),
				transactionListeners: new Set() // 重新初始化 listeners
			})
		}
	)
);
