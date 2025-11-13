// 错误类型
export enum ErrorType {
	// 钱包错误
	WALLET_NOT_FOUND = 'WALLET_NOT_FOUND',
	WALLET_CONNECTION_FAILED = 'WALLET_CONNECTION_FAILED',
	WALLET_CHAIN_NOT_SUPPORTED = 'WALLET_CHAIN_NOT_SUPPORTED',
	WALLET_BALANCE_INSUFFICIENT = 'WALLET_BALANCE_INSUFFICIENT',

	// 交易错误
	TRANSACTION_FAILED = 'TRANSACTION_FAILED',
	TRANSACTION_REJECTED = 'TRANSACTION_REJECTED',
	TRANSACTION_TIMEOUT = 'TRANSACTION_TIMEOUT',

	// 输入错误
	INVALID_INPUT = 'INVALID_INPUT',
	INVALID_ADDRESS = 'INVALID_ADDRESS',
	INVALID_AMOUNT = 'INVALID_AMOUNT'
}

// 应用错误类
export class AppError extends Error {
	public type: ErrorType;
	public params?: Record<string, any>;
	public timestamp: number;

	constructor(type: ErrorType, message: string, params?: Record<string, any>) {
		super(message);
		this.type = type;
		this.params = params;
		this.timestamp = Date.now();
		this.name = 'AppError';
	}

	// 获取国际化消息key
	public getMessageKey(): string {
		return `errors.${this.type}`;
	}

	// 获取错误日志信息
	public toLog(): string {
		return JSON.stringify({
			type: this.type,
			message: this.message,
			params: this.params,
			timestamp: this.timestamp
		});
	}
}

// // 前端使用例子
// import { useTranslations } from 'next-intl';
// import { ErrorType, AppError } from '@/lib/errors';

// const YourComponent = () => {
//     const t = useTranslations('errors');

//     const handleConnect = async () => {
//         try {
//             await wallet.connect('unisat');
//         } catch (error) {
//             // 创建错误
//             const appError = new AppError(
//                 ErrorType.WALLET_CONNECTION_FAILED,
//                 'Failed to connect wallet',
//                 { wallet: 'unisat' }
//             );

//             // 使用国际化消息
//             const message = t(appError.getMessageKey(), appError.params);
//             console.error(message);
//         }
//     };

//     return (
//         <div>
//             <button onClick={handleConnect}>Connect Wallet</button>
//         </div>
//     );
// };
