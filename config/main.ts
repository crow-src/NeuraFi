import {TelegramIcon, TwitterIcon, GithubIcon, DiscordIcon} from '@/components/icons';

export const MAIN_CONFIG = {
	name: 'NeuraFi',
	title: 'NeuraFi. focuses on the field of new digital assets, guiding you to discover the value.',
	description: 'NeuraFi focuses on the field of new digital assets, guiding you to discover the value... ',

	//导航栏
	navItems: [
		// 主要功能
		{label: 'Home', key: 'home', icon: 'fluent:home-32-filled', href: '?tab=home', new: false, category: 'main', order: 1},
		{label: 'IDO', key: 'ido', icon: 'material-symbols:storefront', href: '?tab=ido', new: true, category: 'main', order: 1}, //募资
		{label: 'Box', key: 'box', icon: 'fluent:box-32-regular', href: '?tab=box', new: false, category: 'main', order: 1},
		{label: 'Predict', key: 'predict', icon: 'game-icons:perspective-dice-six-faces-random', href: '?tab=predict', new: true, category: 'main', order: 1}, //预测市场
		{label: 'Launch', key: 'launch', icon: 'material-symbols:rocket-launch', href: '?tab=launch', new: false, category: 'main', order: 1}, //发布发射

		// 市场相关
		{label: 'Market', key: 'market', icon: 'material-symbols:storefront', href: '?tab=market', new: true, category: 'market', order: 2},
		{label: 'Swap', key: 'trading', icon: 'icon-park-outline:transaction', href: '?tab=trading', new: false, category: 'market', order: 2},
		{label: 'Quotes', key: 'quotes', icon: 'material-symbols:trending-up', href: '?tab=quotes', new: false, category: 'market', order: 2}, //盲盒游戏
		{label: 'Rank', key: 'rank', icon: 'material-symbols:leaderboard', href: '?tab=rank', new: false, category: 'market', order: 2},
		// {label: 'Bank', key: 'bank', icon: 'mdi:bank', href: '?tab=bank', new: false, category: 'market', order: 2},

		// 用户相关
		{label: 'Me', key: 'me', icon: 'carbon:user-avatar-filled', href: '?tab=me', new: false, category: 'user', order: 3},
		{label: 'Collection', key: 'collection', icon: 'lucide:box', href: '?tab=collection', new: false, category: 'user', order: 3},
		{label: 'Promotion', key: 'promotion', icon: 'hugeicons:promotion', href: '?tab=promotion', new: false, category: 'user', order: 3},
		{label: 'Help', key: 'help', icon: 'material-symbols:help', href: '?tab=help', new: false, category: 'user', order: 3},
		{label: 'Notifications', key: 'notifications', icon: 'material-symbols:notifications', href: '?tab=notifications', new: true, category: 'user', order: 3}
	],

	// 分类配置
	navCategories: {
		main: {title: 'main', order: 1},
		market: {title: 'market', order: 2},
		user: {title: 'user', order: 3}
	},

	//导航菜单
	navMenuItems: [
		{label: 'Profile', href: '/profile'},
		{label: 'Dashboard', href: '/dashboard'},
		{label: 'Projects', href: '/projects'},
		{label: 'Team', href: '/team'},
		{label: 'Calendar', href: '/calendar'},
		{label: 'Settings', href: '/settings'},
		{label: 'Help & Feedback', href: '/help-feedback'},
		{label: 'Logout', href: '/logout'}
	],

	//语言配置
	languages: [
		{label: 'English', icon: 'cif:gb', key: 'en'},
		{label: 'Русский', icon: 'cif:ru', key: 'ru'},
		{label: 'Français', icon: 'cif:fr', key: 'fr'},
		{label: '简体中文', icon: 'cif:cn', key: 'zh'},
		{label: '日本語', icon: 'cif:jp', key: 'ja'}
	],

	mainImages: [
		{url: '/images/banners/1.png', description: ''},
		{url: '/images/banners/2.png', description: ''},
		{url: '/images/banners/3.png', description: ''},
		{url: '/images/banners/4.png', description: ''},
		{url: '/images/banners/5.png', description: ''}
	],

	imageList: [
		{url: '/images/backgrounds/b (10).png', description: '/'},
		{url: '/images/backgrounds/b (5).png', description: '/'}
	],

	//社交媒体配置
	links: {
		github: '/',
		twitter: '',
		docs: '/',
		discord: '/',
		sponsor: '/'
	},

	//合作伙伴配置
	partners: [
		{key: 'partner-1', src: '/images/partners/okx_logo.png'},
		{key: 'partner-2', src: '/images/partners/gate_logo .png'},
		{key: 'partner-3', src: '/images/partners/binance_logo.png'},
		{key: 'partner-4', src: '/images/partners/BitCheck_logo.png'},
		{key: 'partner-5', src: '/images/partners/Oxalus_logo.png'},
		{key: 'partner-6', src: '/images/partners/Xverse_logo.png'},
		{key: 'partner-7', src: '/images/partners/BitcSwap_logo.png'},
		{key: 'partner-8', src: '/images/partners/BitMart_logo.png'},

		{key: 'partner-9', src: '/images/partners/Blesstiger_logo.png'},
		{key: 'partner-10', src: '/images/partners/Crypto_logo.png'},
		{key: 'partner-11', src: '/images/partners/okx_logo.png'},
		{key: 'partner-12', src: '/images/partners/mexc_logo.png'},
		{key: 'partner-13', src: '/images/partners/Ordinalscan_logo.png'},
		{key: 'partner-14', src: '/images/partners/moonpay_logo.png'},
		{key: 'partner-15', src: '/images/partners/ordx_logo.png'},
		{key: 'partner-16', src: '/images/partners/KuCoin_logo.png'}
	]
};

//底部页面
export const footerNavigation = {
	services: [
		{name: 'Branding', href: '#'},
		{name: 'Data Analysis', href: '#'},
		{name: 'E-commerce Solutions', href: '#'},
		{name: 'Market Research', href: '#'}
	],
	supportOptions: [
		{name: 'Pricing Plans', href: '#'},
		{name: 'User Guides', href: '#'},
		{name: 'Tutorials', href: '#'},
		{name: 'Service Status', href: '#'}
	],
	aboutUs: [
		{name: 'Our Story', href: '#'},
		{name: 'Latest News', href: '#'},
		{name: 'Career Opportunities', href: '#'},
		{name: 'Media Enquiries', href: '#'},
		{name: 'Collaborations', href: '#'}
	],
	legal: [
		{name: 'Claim', href: '#'},
		{name: 'Privacy', href: '#'},
		{name: 'Terms', href: '#'},
		{name: 'User Agreement', href: '#'}
	],
	social: [
		{
			name: 'Telegram',
			href: '/',
			icon: TelegramIcon
		},
		{
			name: 'Instagram',
			href: '/',
			icon: TwitterIcon
		},
		{
			name: 'Twitter',
			href: '/',
			icon: DiscordIcon
		},
		{
			name: 'GitHub',
			href: '/',
			icon: GithubIcon
		}
	]
};

//项目特殊配置
export const PROJECT_CONFIG = {
	chainId: 56,
	multicallAddr: '0xcA11bde05977b3631167028862bE2a173976CA11',
	bankAddr: '0x3C5BFc3A081552474c94A9EA739Df0dA9d515Db0', //0xaed685BbF6aDaDe934dC33798aEC1052F4bd4C82//0x300e50A72E33730Bc578517Cf03d8C538D1e3Ccf
	accountClone: '0x397b38C50c61d7d25e4A065C811A55287B938587',
	teamClone: '0xadf6F1Ab239d7688Ad2239fDE9E89CdA5EA6dBF5',
	tokenList: [
		{
			symbol: 'BTC',
			name: 'BTC',
			key: 'btc',
			address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', //0xb7fdAcBD6B06AdFC913Cf0e73E8D0aA7c2f77DBf 0xC469e7aE4aD962c30c7111dc580B4adbc7E914DD
			decimals: 18,
			chainId: 56,
			icon: '/images/chain/btc.svg'
		},
		{
			symbol: 'FB',
			name: 'FB',
			key: 'fb',
			address: '0xa9B6465AABB1A607B8A2169692Ca62b680FeF3d8', //0xE5aE62bA01c044bC07A9d20603FC262d904D4811 0x391342f5acAcaaC9DE1dC4eC3E03f2678f7c78F1
			decimals: 18,
			chainId: 56,
			icon: '/images/chain/fractal-mainnet.svg'
		}
	],

	dexList: [
		{
			name: 'Bitcoin',
			chain_id: 0,
			version: 2,
			router: '0x7e35E5457cB0D712fb91f274a17d056e15d766a1', //   0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D  0x10ED43C718714eb63d5aA57B78B54704E256024E
			factory: '0xF90e45bFA0cB4C2Eea63F8DF9891f3Ca08151ABb', //0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f   0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73
			token_list: 'https://raw.githubusercontent.com/pancakeswap/pancake-swap-interface/master/src/constants/token/bsc.json',
			logoURI: '/images/chain/btc.svg'
		}
	],
	stablecoin: [
		{
			symbol: 'USDT',
			name: 'USDT',
			key: 'usdt',
			address: '0x55d398326f99059fF775485246999027B3197955',
			decimals: 18,
			chainId: 56,
			icon: '/images/token/erc-20/usdt.png'
		},
		{
			symbol: 'USDC',
			name: 'USDC',
			key: 'usdc',
			address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
			decimals: 18,
			chainId: 56,
			icon: '/images/token/erc-20/usdc.png'
		},
		{
			symbol: 'USDT', //测试usdt
			name: 'USDT',
			key: 'usdt',
			address: '0xc1f92e6A5878E25B1547B52461771eF40b4CF0FE',
			decimals: 18,
			chainId: 56,
			icon: '/images/token/erc-20/lik.png'
		}
	],

	cycleType: [
		{key: '0', title: 'current_deposit', description: 'apy', apy: '0.6-0.7', rate: 0.6},
		{key: '30', title: 'one_month', description: 'apy', apy: '0.8-0.9', rate: 0.8},
		{key: '90', title: 'three_months', description: 'apy', apy: '1.0-1.2', rate: 1.0},
		{key: '180', title: 'six_months', description: 'apy', apy: '1.3-1.4', rate: 1.3},
		{key: '365', title: 'one_year', description: 'apy', apy: '1.5-1.8', rate: 1.5}
	]
};

export const ADDRESS_TYPE = [
	{key: 'P2TR', title: 'P2TR (bc1p)'},
	{key: 'P2WPKH', title: 'P2WPKH (bc1q)'},
	{key: 'P2WSH', title: 'P2WSH (bc1q)'},
	{key: 'P2PKH', title: 'P2PKH (1...)'},
	{key: 'P2SH', title: 'P2SH (3...)'}
];

//钱包配置
export const WALLET_CONFIGS = [
	{
		name: 'Unisat Wallet',
		key: 'unisat',
		logo: '/images/wallet/unisat.png',
		url: 'https://trustwallet.com/',
		supportOrdinals: true, //是否支持 ordinals
		supportFractalBitcoin: true, //是否支持分型比特币
		supportChain: ['BITCOIN_MAINNET', 'FRACTAL_BITCOIN_MAINNET', 'BITCOIN_TESTNET', 'FRACTAL_BITCOIN_TESTNET'] //支持的chain枚举
	},
	{
		name: 'OKX Wallet',
		key: 'okxwallet',
		logo: '/images/wallet/okx.svg',
		url: 'https://metamask.io/',
		supportOrdinals: true,
		supportFractalBitcoin: true,
		supportChain: ['BITCOIN_MAINNET', 'FRACTAL_BITCOIN_MAINNET']
	},
	{
		name: 'Wizz Wallet',
		key: 'wizz',
		logo: '/images/wallet/wizz.svg',
		url: 'https://metamask.io/',
		supportOrdinals: true,
		supportFractalBitcoin: false,
		supportChain: ['BITCOIN_MAINNET', 'BITCOIN_TESTNET']
	},

	{
		name: 'Hiro Wallet',
		key: 'hiro',
		logo: '/images/wallet/hiro.svg',
		url: 'https://metamask.io/',
		supportOrdinals: false,
		supportFractalBitcoin: false,
		supportChain: ['BITCOIN_MAINNET', 'BITCOIN_TESTNET']
	}
];

// ===== Mock data =====
export const MOCK_ITEMS = [
	// Mainstream币种
	{id: 'LIK', name: 'LIK', symbol: 'lik', exchange: 'Uniswap V3', last: 1, changePct: 1, category: 'Mainstream', icon: '/images/favicon-128x128.png'},
	{id: 'ETH', name: 'Ethereum', symbol: 'ETH', exchange: 'Uniswap V3', last: 3245.67, changePct: 0.0032, category: 'Mainstream', icon: '/images/chain/eth.svg'},
	{id: 'WBTC', name: 'Wrapped Bitcoin', symbol: 'WBTC', exchange: 'Uniswap V3', last: 97456.23, changePct: 0.0036, category: 'Mainstream', icon: '/images/chain/btc.svg'},
	{id: 'BNB', name: 'BNB', symbol: 'BNB', exchange: 'PancakeSwap V3', last: 635.45, changePct: 0.0125, category: 'Mainstream', icon: '/images/chain/bnb.svg'},
	{id: 'SOL', name: 'Solana', symbol: 'SOL', exchange: 'Raydium', last: 198.32, changePct: -0.0089, category: 'Mainstream', icon: '/images/chain/sol.svg'},
	{id: 'ADA', name: 'Cardano', symbol: 'ADA', exchange: 'Uniswap V3', last: 1.23, changePct: 0.0045, category: 'Mainstream', icon: '/images/chain/ada.svg'},
	{id: 'AVAX', name: 'Avalanche', symbol: 'AVAX', exchange: 'Trader Joe', last: 42.67, changePct: 0.0167, category: 'Mainstream', icon: '/images/chain/avax.svg'},
	{id: 'DOT', name: 'Polkadot', symbol: 'DOT', exchange: 'Uniswap V3', last: 7.89, changePct: 0.0234, category: 'Mainstream', icon: '/images/chain/dot.svg'},
	{id: 'ATOM', name: 'Cosmos', symbol: 'ATOM', exchange: 'Osmosis', last: 12.45, changePct: -0.0156, category: 'Mainstream', icon: '/images/chain/atom.svg'},
	{id: 'NEAR', name: 'NEAR Protocol', symbol: 'NEAR', exchange: 'Ref Finance', last: 3.67, changePct: 0.0345, category: 'Mainstream', icon: '/images/chain/near.svg'},
	{id: 'FTM', name: 'Fantom', symbol: 'FTM', exchange: 'SpookySwap', last: 0.89, changePct: -0.0234, category: 'Mainstream', icon: '/images/chain/ftm.svg'},
	{id: 'XRP', name: 'XRP', symbol: 'XRP', exchange: 'Uniswap V3', last: 0.89, changePct: 0.0234, category: 'Mainstream', icon: '/images/chain/xrp.svg'},
	{id: 'LTC', name: 'Litecoin', symbol: 'LTC', exchange: 'Uniswap V3', last: 12.45, changePct: -0.0156, category: 'Mainstream', icon: '/images/chain/ltc.svg'},
	{id: 'BCH', name: 'Bitcoin Cash', symbol: 'BCH', exchange: 'Uniswap V3', last: 3.67, changePct: 0.0345, category: 'Mainstream', icon: '/images/chain/bch.svg'},
	{id: 'XLM', name: 'Stellar', symbol: 'XLM', exchange: 'Uniswap V3', last: 0.89, changePct: -0.0234, category: 'Mainstream', icon: '/images/chain/xlm.svg'},
	{id: 'LINK', name: 'Chainlink', symbol: 'LINK', exchange: 'Uniswap V3', last: 12.45, changePct: -0.0156, category: 'Mainstream', icon: '/images/chain/link.svg'},
	{id: 'XMR', name: 'Monero', symbol: 'XMR', exchange: 'Uniswap V3', last: 3.67, changePct: 0.0345, category: 'Mainstream', icon: '/images/chain/xmr.svg'},
	{id: 'ZEC', name: 'Zcash', symbol: 'ZEC', exchange: 'Uniswap V3', last: 0.89, changePct: -0.0234, category: 'Mainstream', icon: '/images/chain/zec.svg'},

	// Stablecoin
	{id: 'USDC', name: 'USD Coin', symbol: 'USDC', exchange: 'Uniswap V3', last: 1.0001, changePct: 0.0018, category: 'Stablecoin', icon: '/images/token/erc-20/usdc.png'},
	{id: 'USDT', name: 'Tether USD', symbol: 'USDT', exchange: 'Uniswap V3', last: 0.9998, changePct: 0.0024, category: 'Stablecoin', icon: '/images/token/erc-20/usdt.png'},
	{id: 'DAI', name: 'Dai Stablecoin', symbol: 'DAI', exchange: 'Uniswap V3', last: 1.0003, changePct: -0.0012, category: 'Stablecoin', icon: '/images/token/erc-20/dai.png'},
	{id: 'BUSD', name: 'Binance USD', symbol: 'BUSD', exchange: 'PancakeSwap V3', last: 0.9999, changePct: 0.0008, category: 'Stablecoin', icon: '/images/token/erc-20/busd.png'},
	{id: 'FRAX', name: 'Frax', symbol: 'FRAX', exchange: 'Uniswap V3', last: 1.0005, changePct: 0.0015, category: 'Stablecoin', icon: '/images/token/erc-20/frax.png'},
	{id: 'LUSD', name: 'Liquity USD', symbol: 'LUSD', exchange: 'Uniswap V3', last: 1.0012, changePct: 0.0023, category: 'Stablecoin', icon: '/images/token/erc-20/lusd.png'},
	{id: 'TUSD', name: 'TrueUSD', symbol: 'TUSD', exchange: 'Uniswap V3', last: 0.9997, changePct: -0.0008, category: 'Stablecoin', icon: '/images/token/erc-20/tusd.png'},

	// DeFi代币

	{id: 'UNI', name: 'Uniswap', symbol: 'UNI', exchange: 'Uniswap V3', last: 8.42, changePct: 0.0033, category: 'DeFi', icon: '/images/token/erc-20/uni.png'},
	{id: 'AAVE', name: 'Aave', symbol: 'AAVE', exchange: 'Uniswap V3', last: 142.67, changePct: -0.0021, category: 'DeFi', icon: '/images/token/erc-20/aave.png'},
	{id: 'CRV', name: 'Curve DAO Token', symbol: 'CRV', exchange: 'Uniswap V3', last: 0.34, changePct: 0.0003, category: 'DeFi', icon: '/images/token/erc-20/crv.png'},
	{id: 'COMP', name: 'Compound', symbol: 'COMP', exchange: 'Uniswap V3', last: 58.91, changePct: 0.0018, category: 'DeFi', icon: '/images/token/erc-20/comp.png'},
	{id: 'SUSHI', name: 'SushiSwap', symbol: 'SUSHI', exchange: 'SushiSwap', last: 1.67, changePct: -0.0156, category: 'DeFi', icon: '/images/token/erc-20/sushi.png'},
	{id: 'MKR', name: 'Maker', symbol: 'MKR', exchange: 'Uniswap V3', last: 1834.56, changePct: 0.0087, category: 'DeFi', icon: '/images/token/erc-20/mkr.png'},
	{id: 'SNX', name: 'Synthetix', symbol: 'SNX', exchange: 'Uniswap V3', last: 3.45, changePct: 0.0234, category: 'DeFi', icon: '/images/token/erc-20/snx.png'},
	{id: 'YFI', name: 'yearn.finance', symbol: 'YFI', exchange: 'Uniswap V3', last: 8567.23, changePct: -0.0045, category: 'DeFi', icon: '/images/token/erc-20/yfi.png'},
	{id: 'BAL', name: 'Balancer', symbol: 'BAL', exchange: 'Balancer V2', last: 4.67, changePct: 0.0178, category: 'DeFi', icon: '/images/token/erc-20/bal.png'},
	{id: '1INCH', name: '1inch Network', symbol: '1INCH', exchange: '1inch', last: 0.56, changePct: -0.0089, category: 'DeFi', icon: '/images/token/erc-20/1inch.png'},
	{id: 'DYDX', name: 'dYdX', symbol: 'DYDX', exchange: 'Uniswap V3', last: 2.34, changePct: 0.0145, category: 'DeFi', icon: '/images/token/erc-20/dydx.png'},
	{id: 'GMX', name: 'GMX', symbol: 'GMX', exchange: 'Uniswap V3', last: 67.89, changePct: 0.0289, category: 'DeFi', icon: '/images/token/erc-20/gmx.png'},
	{id: 'LIDO', name: 'Lido DAO', symbol: 'LDO', exchange: 'Uniswap V3', last: 2.78, changePct: -0.0123, category: 'DeFi', icon: '/images/token/erc-20/lido.png'},
	{id: 'CAKE', name: 'PancakeSwap', symbol: 'CAKE', exchange: 'PancakeSwap V3', last: 3.45, changePct: 0.0067, category: 'DeFi', icon: '/images/token/erc-20/cake.png'},

	// Layer2代币
	{id: 'MATIC', name: 'Polygon', symbol: 'MATIC', exchange: 'Uniswap V3', last: 0.42, changePct: 0.0001, category: 'Layer2', icon: '/images/chain/matic.svg'},
	{id: 'ARB', name: 'Arbitrum', symbol: 'ARB', exchange: 'Uniswap V3', last: 1.89, changePct: 0.0234, category: 'Layer2', icon: '/images/chain/arbitrum.svg'},
	{id: 'OP', name: 'Optimism', symbol: 'OP', exchange: 'Uniswap V3', last: 2.67, changePct: -0.0123, category: 'Layer2', icon: '/images/chain/optimism.svg'},
	{id: 'IMX', name: 'Immutable X', symbol: 'IMX', exchange: 'Uniswap V3', last: 1.45, changePct: 0.0456, category: 'Layer2', icon: '/images/chain/imx.svg'},
	{id: 'LRC', name: 'Loopring', symbol: 'LRC', exchange: 'Uniswap V3', last: 0.23, changePct: -0.0078, category: 'Layer2', icon: '/images/chain/lrc.svg'},
	{id: 'STRK', name: 'Starknet', symbol: 'STRK', exchange: 'Uniswap V3', last: 0.78, changePct: 0.0234, category: 'Layer2', icon: '/images/chain/strk.svg'},
	{id: 'MANTA', name: 'Manta Network', symbol: 'MANTA', exchange: 'Uniswap V3', last: 2.34, changePct: 0.0345, category: 'Layer2', icon: '/images/chain/manta.svg'},

	// Scaling代币
	{id: 'LINK', name: 'Chainlink', symbol: 'LINK', exchange: 'Uniswap V3', last: 14.83, changePct: -0.0078, category: 'Scaling', icon: '/images/chain/link.svg'},
	{id: 'BAND', name: 'Band Protocol', symbol: 'BAND', exchange: 'Uniswap V3', last: 1.78, changePct: 0.0167, category: 'Scaling', icon: '/images/chain/band.svg'},
	{id: 'API3', name: 'API3', symbol: 'API3', exchange: 'Uniswap V3', last: 2.34, changePct: -0.0234, category: 'Scaling', icon: '/images/chain/api3.svg'},
	{id: 'TRB', name: 'Tellor', symbol: 'TRB', exchange: 'Uniswap V3', last: 67.89, changePct: 0.0345, category: 'Scaling', icon: '/images/chain/trb.svg'},
	{id: 'UMA', name: 'UMA', symbol: 'UMA', exchange: 'Uniswap V3', last: 3.45, changePct: 0.0123, category: 'Scaling', icon: '/images/chain/uma.svg'},
	{id: 'DIA', name: 'DIA', symbol: 'DIA', exchange: 'Uniswap V3', last: 0.67, changePct: -0.0089, category: 'Scaling', icon: '/images/chain/dia.svg'},

	// Oracle解决方案
	{id: 'SKALE', name: 'SKALE Network', symbol: 'SKL', exchange: 'Uniswap V3', last: 0.056, changePct: 0.0189, category: 'Oracle', icon: '/images/chain/skale.svg'},
	{id: 'CELR', name: 'Celer Network', symbol: 'CELR', exchange: 'Uniswap V3', last: 0.023, changePct: -0.0067, category: 'Oracle', icon: '/images/chain/celr.svg'},
	{id: 'METIS', name: 'Metis Token', symbol: 'METIS', exchange: 'Uniswap V3', last: 45.67, changePct: 0.0278, category: 'Oracle', icon: '/images/chain/metis.svg'},
	{id: 'BOBA', name: 'Boba Network', symbol: 'BOBA', exchange: 'Uniswap V3', last: 0.234, changePct: -0.0145, category: 'Oracle', icon: '/images/chain/boba.svg'},
	{id: 'CARTESI', name: 'Cartesi', symbol: 'CTSI', exchange: 'Uniswap V3', last: 0.145, changePct: 0.0234, category: 'Oracle', icon: '/images/chain/cartesi.svg'},
	{id: 'XDAI', name: 'Gnosis', symbol: 'GNO', exchange: 'Uniswap V3', last: 234.56, changePct: 0.0156, category: 'Oracle', icon: '/images/chain/gnosis.svg'},
	{id: 'RNDR', name: 'Render Token', symbol: 'RNDR', exchange: 'Uniswap V3', last: 7.89, changePct: 0.0345, category: 'Oracle', icon: '/images/chain/rndr.svg'},

	// 新增其他热门代币
	{id: 'PEPE', name: 'Pepe', symbol: 'PEPE', exchange: 'Uniswap V3', last: 0.00000234, changePct: 0.1234, category: 'Meme', icon: '/images/chain/pepe.svg'},
	{id: 'SHIB', name: 'Shiba Inu', symbol: 'SHIB', exchange: 'Uniswap V3', last: 0.00001456, changePct: -0.0234, category: 'Meme', icon: '/images/chain/shib.svg'},
	{id: 'DOGE', name: 'Dogecoin', symbol: 'DOGE', exchange: 'Uniswap V3', last: 0.089, changePct: 0.0345, category: 'Meme', icon: '/images/chain/doge.svg'},
	{id: 'FLOKI', name: 'Floki Inu', symbol: 'FLOKI', exchange: 'Uniswap V3', last: 0.00023, changePct: 0.0567, category: 'Meme', icon: '/images/chain/floki.svg'},
	{id: 'WIF', name: 'dogwifhat', symbol: 'WIF', exchange: 'Raydium', last: 2.34, changePct: 0.0234, category: 'Meme', icon: '/images/chain/wif.svg'},

	// AI相关代币
	{id: 'FET', name: 'Fetch.ai', symbol: 'FET', exchange: 'Uniswap V3', last: 1.45, changePct: 0.0234, category: 'AI', icon: '/images/chain/fet.svg'},
	{id: 'AGIX', name: 'SingularityNET', symbol: 'AGIX', exchange: 'Uniswap V3', last: 0.67, changePct: -0.0123, category: 'AI', icon: '/images/chain/agix.svg'},
	{id: 'OCEAN', name: 'Ocean Protocol', symbol: 'OCEAN', exchange: 'Uniswap V3', last: 0.89, changePct: 0.0345, category: 'AI', icon: '/images/chain/ocean.svg'},
	{id: 'RNDR', name: 'Render Token', symbol: 'RNDR', exchange: 'Uniswap V3', last: 7.89, changePct: 0.0234, category: 'AI', icon: '/images/chain/rndr.svg'},
	{id: 'TAO', name: 'Bittensor', symbol: 'TAO', exchange: 'Uniswap V3', last: 456.78, changePct: 0.0456, category: 'AI', icon: '/images/chain/tao.svg'},

	// GameFi代币
	{id: 'AXS', name: 'Axie Infinity', symbol: 'AXS', exchange: 'Uniswap V3', last: 8.45, changePct: -0.0234, category: 'GameFi', icon: '/images/chain/axs.svg'},
	{id: 'SAND', name: 'The Sandbox', symbol: 'SAND', exchange: 'Uniswap V3', last: 0.45, changePct: 0.0123, category: 'GameFi', icon: '/images/chain/sand.svg'},
	{id: 'MANA', name: 'Decentraland', symbol: 'MANA', exchange: 'Uniswap V3', last: 0.67, changePct: 0.0234, category: 'GameFi', icon: '/images/chain/mana.svg'},
	{id: 'ENJ', name: 'Enjin Coin', symbol: 'ENJ', exchange: 'Uniswap V3', last: 0.34, changePct: -0.0145, category: 'GameFi', icon: '/images/chain/enj.svg'},
	{id: 'GALA', name: 'Gala', symbol: 'GALA', exchange: 'Uniswap V3', last: 0.045, changePct: 0.0345, category: 'GameFi', icon: '/images/chain/gala.svg'},
	{id: 'ILV', name: 'Illuvium', symbol: 'ILV', exchange: 'Uniswap V3', last: 67.89, changePct: 0.0234, category: 'GameFi', icon: '/images/chain/ilv.svg'}
];
