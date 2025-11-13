import {useEffect, useState} from 'react';
import {useAppKitAccount, useAppKitProvider, useAppKitNetwork} from '@reown/appkit/react';
import {Connection} from '@solana/web3.js';

// Solana 连接钩子
export function useSolana() {
	const {address, isConnected} = useAppKitAccount();
	const {walletProvider} = useAppKitProvider('solana');
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

	return {
		address,
		isConnected,
		connection,
		walletProvider,
		chainId
	};
}
