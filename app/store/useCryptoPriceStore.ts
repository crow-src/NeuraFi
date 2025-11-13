import {create} from 'zustand';

// 价格store
export const useCryptoPriceStore = create<{cryptoPrice: {[key: string]: {[currency: string]: number}}; updateCryptoPrice: (newCryptoPrice: {[key: string]: {[currency: string]: number}}) => void}>(set => ({
	cryptoPrice: {}, // 初始价格为空对象
	updateCryptoPrice: newCryptoPrice => set({cryptoPrice: newCryptoPrice}) // 更新价格的函数
}));
