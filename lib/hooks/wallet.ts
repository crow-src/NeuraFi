import {useEffect, useState, useMemo} from 'react';
import {useAppKit, useAppKitAccount, useAppKitProvider, useAppKitNetwork, useWalletInfo, useAppKitState, useAppKitEvents, useAppKitTheme} from '@reown/appkit/react'; // 更新：使用 Reown AppKit hooks
import type {Provider} from '@reown/appkit/react';
import {Connection} from '@solana/web3.js';
import {BrowserProvider, Signer} from 'ethers';

// 常用web3 钩子 - 更新为使用 Reown AppKit
export function useBrowserWallet() {
	const {walletProvider} = useAppKitProvider<Provider>('eip155'); // 更新：使用 AppKit provider，指定 EIP155 namespace
	const {address, isConnected, caipAddress, status, embeddedWalletInfo} = useAppKitAccount(); // 更新：使用 AppKit account
	const {loading, open: isOpen, selectedNetworkId, activeChain} = useAppKitState();
	const {chainId} = useAppKitNetwork(); // 更新：使用 AppKit network 获取 chainId
	const [provider, setProvider] = useState<BrowserProvider | null>(null);
	const [signer, setSigner] = useState<Signer | null>(null);
	useEffect(() => {
		if (walletProvider && typeof walletProvider === 'object' && 'request' in walletProvider) {
			const provider = new BrowserProvider(walletProvider as any);
			setProvider(provider);
			provider.getSigner().then(signer => setSigner(signer));
		}
	}, [walletProvider, address]);
	return {provider, signer, address, chainId, isConnected, loading, isOpen, selectedNetworkId, activeChain, caipAddress, embeddedWalletInfo, status};
}

// Solana 连接钩子
export function useSolana() {
	const {walletProvider} = useAppKitProvider('solana');
	const {address, isConnected} = useAppKitAccount();
	const {chainId} = useAppKitNetwork();
	const [connection, setConnection] = useState<Connection | null>(null);

	useEffect(() => {
		if (chainId && typeof chainId === 'string') {
			// 根据链 ID 设置 RPC 端点
			let rpcEndpoint = 'https://api.mainnet-beta.solana.com';

			if (chainId.includes('testnet')) {
				rpcEndpoint = 'https://api.testnet.solana.com';
			} else if (chainId.includes('devnet')) {
				rpcEndpoint = 'https://api.devnet.solana.com';
			}

			setConnection(new Connection(rpcEndpoint));
		}
	}, [chainId]);

	return {address, isConnected, connection, walletProvider, chainId};
}

// Bitcoin 连接钩子
export function useBitcoin() {
	const {walletProvider} = useAppKitProvider('bip122'); // Bitcoin 使用 bip122 namespace
	const {address, isConnected} = useAppKitAccount();
	const {chainId} = useAppKitNetwork();
	const [balance, setBalance] = useState<number>(0);
	const [loading, setLoading] = useState(false);

	return {
		// 基础信息
		address,
		isConnected,
		chainId,
		walletProvider,
		// 余额相关
		balance,
		loading
	};
}
