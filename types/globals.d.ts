//全局接口定义
interface Window {
	[key: string]: any; // 允许动态索引访问
}

//网络类型
interface Network {
	name: string; // 根据实际情况调整类型
	type: number; //比特币 evm sol 0 \ 1 \ 2
	key: string; //特殊标识
}
//chain接口 是不是可以区分比特币链和以太坊链的不同
interface Chain extends Network {
	enum: string; //链枚举
	network: 'livenet' | 'testnet' | undefined; //主网/测试网
	chainId: number;
	currency: string; // 主币简称
	icon: string; //图标
	blackIcon?: string; //黑色图标
	explorerUrl: string; //浏览器地址
	market?: string; //市场地址
	api?: string; //api地址
	multicall?: string; //多调用地址
	helper?: string; //帮助合约地址
	token_list?: string; //token列表
	addressType?: 'livenet' | 'testnet'; //地址类型
}

interface RPC extends Chain {
	rpcUrl: string; //rpc地址
	wssUrl?: string; //wss地址
}

// 定义 utxo 对象的类型
interface IUTXO {
	address: string; //地址
	codeType: number; //代码类型
	height: number; //高度
	idx: number; //索引
	inscriptions: any[]; // 根据实际数据类型调整
	isOpInRBF: boolean; //是否在rbf中
	isSpent: boolean; //是否花费
	satoshi: number; //数量
	scriptPk: string; //脚本公钥
	scriptType: string; //脚本类型
	txid: string; //交易id
	vout: number; //vout
	controlBlock?: string; // 控制块
	runes?: RunesUTXO[]; //符文
}

interface Output {
	address: string;
	value: number; // 单位是 Satoshis
}

//brc20余额
interface BRC20Balance {
	availableBalance: string; //这是可用的余额
	availableBalanceSafe: string; //这是安全的余额
	availableBalanceUnSafe: string; //这是不安全的余额
	decimal: number; //小数位
	overallBalance: string; //总余额
	ticker: string; //名称
	transferableBalance: string; //可转账余额
}
//符文余额
interface RunesBalance {
	amount: string; //数量
	runeid: string; //符文id
	rune: string; //符文
	spacedRune: string; //符文
	symbol: string; //符文
	divisibility: number; //精度
}

interface IToken {
	agreement?: string; //协议类型
	[key: string]: any;
}

interface AirdropItem extends IToken {
	title: string;
	name: string;
	decimals: number;
	total: number;
	amount: number;
	count: number;
	fee: number;
	start?: number; // bigint
	end?: number;
	web?: string;
	gitbook?: string;
	github?: string;
	twitter?: string;
	telegram?: string;
	discord?: string;
	description?: string;
	psbt?: string;
	private?: string;
	progress: number;
	agreement: 'Sat' | 'BRC-20' | 'Runes';
	network: string; // 可进一步限定成 'BITCOIN_MAINNET' | ...
	symbol: string;
	received?: number; //已领取数量
	slug?: string; //slug
	[key: string]: any;
}
