// 类型定义
type ToSignInput = {
	index: number;
	address: string;
	publicKey: string;
	sighashTypes: number[];
	disableTweakSigner: boolean;
	useTweakedSigner: boolean;
};

type SignOptions = {
	autoFinalized: boolean;
	toSignInputs: ToSignInput[];
};

// 钱包接口定义
export interface IWallet {
	requestAccounts: () => Promise<string[]>;
	getNetwork: () => Promise<'livenet' | 'testnet' | undefined>;
	getAccounts: () => Promise<string[]>;
	getBalance: () => Promise<{confirmed: number; unconfirmed: number; total: number}>;
	getPublicKey: () => Promise<string>;
	on: (event: 'accountsChanged' | 'chainChanged' | 'networkChanged', callback: (...args: any[]) => void) => void;
	switchChain?: (chainEnum: string) => Promise<void>;
	switchNetwork?: (network: 'livenet' | 'testnet' | undefined) => Promise<void>;
	signMessage?: (msg: string, type?: 'ecdsa' | 'bip322-simple') => Promise<string>;
	signPsbt: (psbtHex: string, options?: SignOptions) => Promise<string>;
	signPsbts: (psbtHexs: string[], options?: SignOptions) => Promise<string[]>;
	pushPsbt: (psbtHex: string) => Promise<string>;
	pushTx: (options: {rawtx: string}) => Promise<string>;
	connect: () => Promise<string[]>;
}

// 钱包配置接口
export interface WalletConfig {
	// 是否安装
	name: string;
	key: string;
	logo: string;
	url: string;
	supportOrdinals: boolean; // 是否支持ordinals
	supportFractalBitcoin: boolean; // 是否支持fractal比特币
	supportChain: string[]; // 支持的链

	installed?: boolean; // 是否安装
}

// 浏览器钱包类
export class BrowserWallet {
	private wallet: IWallet | undefined;
	public walletKey: string;
	public accounts: string[];
	public balance: {confirmed: number; unconfirmed: number; total: number};
	public publicKey: string;
	public chain: Chain;
	public network: 'livenet' | 'testnet' | undefined;
	public loading: boolean;
	private listeners: Set<() => void>;
	public walletConfigs: WalletConfig[];
	private walletConfig: WalletConfig | undefined;
	public chainConfigs: Chain[];

	constructor(walletConfigs: WalletConfig[], chainConfigs: Chain[], defaultWalletKey: string = 'unisat') {
		this.wallet = undefined;
		this.walletKey = defaultWalletKey;
		this.accounts = [];
		this.balance = {confirmed: 0, unconfirmed: 0, total: 0};
		this.publicKey = '';
		this.chainConfigs = chainConfigs;

		// 始终使用第一个chain作为初始值，避免水合错误
		this.chain = chainConfigs[0];
		this.network = this.chain.network;

		// 在客户端初始化时，延迟从localStorage读取配置以避免水合不匹配
		if (typeof window !== 'undefined') {
			// 使用 setTimeout 确保在水合完成后再更新状态
			setTimeout(() => {
				try {
					const storedChain = localStorage.getItem('chainConfig');
					if (storedChain) {
						const parsedChain = JSON.parse(storedChain);
						// 确保存储的chain在配置列表中
						const validChain = chainConfigs.find(c => c.enum === parsedChain.enum);
						if (validChain && validChain.enum !== this.chain.enum) {
							this.chain = validChain;
							this.network = validChain.network;
							// 通知状态更新
							this.notifyListeners();
						}
					}
				} catch (error) {
					console.error('Error reading chain config from localStorage:', error);
				}
			}, 0);
		}

		this.loading = false;
		this.listeners = new Set();
		this.walletConfigs = walletConfigs; // 初始化钱包配置

		// 检测浏览器中已安装的钱包
		this.detectInstalledWallets();

		this.walletConfig = this.walletConfigs.find(config => config.key === defaultWalletKey);
	}

	// 检测浏览器中已安装的钱包
	private detectInstalledWallets() {
		if (typeof window === 'undefined') return;

		// 检测每个钱包是否安装
		this.walletConfigs.forEach(config => {
			try {
				// 检测钱包是否存在于 window 对象中
				const isInstalled = this.checkWalletInstalled(config.key);
				config.installed = isInstalled;
			} catch (error) {
				console.warn(`检测钱包 ${config.name} 时出错:`, error);
				config.installed = false;
			}
		});
	}

	// 检查特定钱包是否安装
	private checkWalletInstalled(walletKey: string): boolean {
		if (typeof window === 'undefined') return false;

		switch (walletKey) {
			case 'unisat':
				return typeof window.unisat !== 'undefined';
			case 'okxwallet':
				return typeof window.okxwallet !== 'undefined';
			case 'wizz':
				return typeof window.wizz !== 'undefined';
			case 'xverse':
				return typeof window.XverseProviders !== 'undefined';
			case 'leather':
				return typeof window.LeatherProvider !== 'undefined';
			case 'phantom':
				return typeof window.phantom?.bitcoin !== 'undefined';
			default:
				// 通用检测：检查 window[walletKey] 是否存在
				return typeof window[walletKey] !== 'undefined';
		}
	}

	// 获取当前钱包配置
	public getWalletConfig(): WalletConfig | undefined {
		return this.walletConfig;
	}

	// 获取支持特定链的钱包配置
	public getSupportedWallets(chainEnum: string): WalletConfig[] {
		return this.walletConfigs.filter(config => config.supportChain.includes(chainEnum));
	}

	// 获取已安装的钱包配置
	public getInstalledWallets(): WalletConfig[] {
		return this.walletConfigs.filter(config => config.installed === true);
	}

	// 获取支持特定链且已安装的钱包配置
	public getInstalledSupportedWallets(chainEnum: string): WalletConfig[] {
		return this.walletConfigs.filter(config => config.supportChain.includes(chainEnum) && config.installed === true);
	}

	// 刷新钱包安装状态检测
	public refreshWalletDetection() {
		this.detectInstalledWallets();
		this.notifyListeners();
	}

	// 切换钱包
	public async switchWallet(walletKey: string) {
		const config = this.walletConfigs.find(config => config.key === walletKey);
		if (!config) {
			throw new Error(`Wallet ${walletKey} not found`);
		}
		this.walletKey = walletKey;
		this.walletConfig = config;
		await this.connect(walletKey, this.chain.enum);
	}

	// 添加状态更新监听器
	public subscribe(listener: () => void) {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	}

	// 通知所有监听器
	private notifyListeners() {
		this.listeners.forEach(listener => listener());
	}

	// 设置本地存储 chain 配置
	private setStoredChain(chain: Chain) {
		if (typeof window === 'undefined') return;
		try {
			localStorage.setItem('chainConfig', JSON.stringify(chain));
		} catch (error) {
			console.error('Error saving chain config to localStorage:', error);
		}
	}

	// 初始化钱包信息
	private async initWallet() {
		if (typeof window === 'undefined' || !this.wallet) return;

		// console.log('初始化钱包信息', this.wallet);
		try {
			const [network, accounts, balance, publicKey] = await Promise.all([this.wallet.getNetwork(), this.wallet.getAccounts(), this.wallet.getBalance(), this.wallet.getPublicKey()]);
			this.network = network;
			this.accounts = accounts;
			this.balance = balance || {confirmed: 0, unconfirmed: 0, total: 0};
			this.publicKey = publicKey || '';
			this.loading = false;
			// 通知状态更新
			this.notifyListeners();
		} catch (error) {
			console.error('wallet init error:', error);
			this.loading = false;
		}
	}

	// 处理钱包变化
	private async handleChanged() {
		if (!this.wallet) return;
		try {
			await this.wallet.requestAccounts?.();
			await this.initWallet();
		} catch (error) {
			console.error('wallet handleChanged error:', error);
		}
	}

	// 监听钱包变化
	private watchWalletChange() {
		if (!this.wallet) return;

		this.wallet.on('accountsChanged', async (accounts: string[]) => {
			this.accounts = accounts;
			await this.handleChanged();
			this.notifyListeners();
		});

		this.wallet.on('chainChanged', async (chain: {enum: string; name: string; network: string}) => {
			const newChain = this.chainConfigs.find(item => item.enum == chain.enum);
			if (newChain) {
				this.chain = newChain;
				this.network = chain.network as 'livenet' | 'testnet' | undefined;
				this.setStoredChain(newChain);
			}
			await this.handleChanged();
			this.notifyListeners();
		});

		this.wallet.on('networkChanged', async (network: 'livenet' | 'testnet' | undefined) => {
			this.network = network;
			await this.handleChanged();
			this.notifyListeners();
		});
	}

	// 连接钱包
	async connect(walletKey: string, chainEnum: string = 'BITCOIN_MAINNET') {
		if (typeof window === 'undefined') return;
		if (!window[walletKey]) {
			console.log('wallet not found:', walletKey);
			return;
		}
		try {
			const chain = this.chainConfigs.find(item => item.enum == chainEnum) ?? this.chainConfigs[0];
			console.log('connect wallet:', walletKey, chainEnum, chain);
			const newWallet: IWallet = walletKey == 'okxwallet' ? window[walletKey][chain.key || 'bitcoin'] : window[walletKey];
			this.wallet = newWallet;
			this.walletKey = walletKey;
			this.chain = chain;
			this.setStoredChain(chain);
			const accounts = await newWallet.requestAccounts();
			this.accounts = accounts;
			await this.initWallet();
			this.watchWalletChange();
		} catch (error) {
			this.loading = false;
		}
	}

	// 断开钱包
	async disconnect() {
		this.accounts = [];
		this.wallet = undefined;
		this.balance = {confirmed: 0, unconfirmed: 0, total: 0};
		this.publicKey = '';
		this.notifyListeners();
	}

	// 切换网络
	async switchChain(chain: Chain) {
		if (!this.wallet) return;

		try {
			switch (this.walletKey) {
				case 'unisat':
					await this.wallet?.switchChain?.(chain.enum);
					break;
				case 'wizz':
					await this.wallet?.switchNetwork?.(chain.network);
					break;
				case 'okxwallet':
					const network = chain?.key || 'bitcoin';
					const newWallet = window[this.walletKey][network];
					this.wallet = newWallet;
					await newWallet.connect();
					break;
			}

			this.chain = chain;
			this.setStoredChain(chain);
			await this.initWallet();
		} catch (error) {
			console.error('切换网络失败:', error);
		}
	}

	// 签名消息
	async signMessage(msg: string, type?: 'ecdsa' | 'bip322-simple'): Promise<string> {
		return this.wallet?.signMessage?.(msg, type) ?? '';
	}

	// 签名 PSBT
	async signPsbt(psbtHex: string, options?: SignOptions): Promise<string> {
		return this.wallet?.signPsbt?.(psbtHex, options) ?? '';
	}

	// 批量签名 PSBT
	async signPsbts(psbtHexs: string[], options?: SignOptions): Promise<string[]> {
		return this.wallet?.signPsbts?.(psbtHexs, options) ?? [];
	}

	// 推送 PSBT
	async pushPsbt(psbtHex: string): Promise<string> {
		return this.wallet?.pushPsbt?.(psbtHex) ?? '';
	}

	// 推送交易
	async pushTx(options: {rawtx: string}): Promise<string> {
		return this.wallet?.pushTx?.(options) ?? '';
	}
}
