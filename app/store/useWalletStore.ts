'use client';

// import {create} from 'zustand';
// import {WALLET_CONFIGS, RPC_CONFIG} from '@/config';
// import {BrowserWallet} from '@/lib/module/wallet/wallet';

// //这是btc钱包
// export const useWalletStore = create<{wallet: BrowserWallet}>(set => {
// 	const wallet = new BrowserWallet(WALLET_CONFIGS, RPC_CONFIG);
// 	wallet.subscribe(() => set({wallet})); // 订阅钱包状态变化

// 	// 在客户端环境下，延迟检测钱包安装状态
// 	if (typeof window !== 'undefined') {
// 		setTimeout(() => {
// 			wallet.refreshWalletDetection();
// 		}, 100);
// 	}
// 	return {wallet};
// });
