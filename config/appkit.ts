import {mainnet, arbitrum, polygon, bsc, avalanche} from '@reown/appkit/networks';
import {solana, solanaTestnet, solanaDevnet} from '@reown/appkit/networks';
import {bitcoin, bitcoinTestnet} from '@reown/appkit/networks';
import {BitcoinAdapter} from '@reown/appkit-adapter-bitcoin';
import {EthersAdapter} from '@reown/appkit-adapter-ethers';
import {SolanaAdapter} from '@reown/appkit-adapter-solana';

// 项目 ID - 从 Reown Dashboard 获取
export const projectId = '576de531882ee3a4be3575662c37c769';

if (!projectId) {
	throw new Error('Project ID is not defined');
}

// 定义 EVM 网络
export const evmNetworks = [
	bsc,
	mainnet, // Ethereum 主网
	avalanche, // Avalanche
	arbitrum, // Arbitrum
	polygon // Polygon
];

// 定义 Solana 网络
export const solanaNetworks = [
	solana, // Solana 主网
	solanaTestnet, // Solana 测试网
	solanaDevnet // Solana 开发网
];

// 定义 Bitcoin 网络
export const bitcoinNetworks = [
	bitcoin, // Bitcoin 主网
	bitcoinTestnet // Bitcoin 测试网
];

// 合并所有网络 - 支持 EVM、Solana 和 Bitcoin
export const networks = [...evmNetworks] as [any, ...any[]];

// 设置 Ethers 适配器
export const ethersAdapter = new EthersAdapter();

// 设置 Solana 适配器
export const solanaAdapter = new SolanaAdapter();

// 设置 Bitcoin 适配器
export const bitcoinAdapter = new BitcoinAdapter();

// 应用元数据
export const metadata = {
	name: 'MdaoTool',
	description: 'MdaoTool - Multi-chain support (EVM + Solana + Bitcoin)',
	url: 'https://NeuraFi.to',
	icons: ['https://NeuraFi.to/favicon.png']
};
