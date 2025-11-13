// ODIN.FUN API 相关类型定义

export interface OdinToken {
	id: string;
	name: string;
	description: string;
	image: string;
	creator: string;
	created_time: string;
	volume: number;
	bonded: boolean;
	bonded_time: string;
	icrc_ledger: string;
	price: number;
	marketcap: number;
	rune: string;
	featured: boolean;
	holder_count: number;
	holder_top: number;
	holder_dev: number;
	comment_count: number;
	sold: number;
	twitter?: string;
	website?: string;
	telegram?: string;
	last_comment_time?: string;
	sell_count: number;
	buy_count: number;
	ticker: string;
	btc_liquidity: number;
	token_liquidity: number;
	user_btc_liquidity: number;
	user_token_liquidity: number;
	user_lp_tokens: number;
	total_supply: number;
	swap_fees: number;
	swap_fees_24: number;
	swap_volume: number;
	swap_volume_24: number;
	volume_24: number;
	threshold: number;
	txn_count: number;
	divisibility: number;
	decimals: number;
	withdrawals: boolean;
	deposits: boolean;
	trading: boolean;
	external: boolean;
	price_5m: number;
	price_1h: number;
	price_6h: number;
	price_1d: number;
	rune_id: string;
	last_action_time: string;
	twitter_verified: boolean;
	verified: boolean;
	liquidity_threshold: number;
	power_holder_count: number;
	progress: number;
	tags: string[];
}

export interface OdinApiResponse {
	data: OdinToken[];
	page: number;
	limit: number;
	count: number;
}

// API请求参数类型
export interface OdinTokensParams {
	sort?: 'volume:desc' | 'volume:asc' | 'marketcap:desc' | 'marketcap:asc' | 'created_time:desc' | 'created_time:asc';
	modified_by?: 'table' | 'grid';
	page?: number;
	limit?: number;
	env?: 'production' | 'development';
	search?: string;
	featured?: boolean;
	verified?: boolean;
	bonded?: boolean;
}

// 数字格式化工具函数类型
export type NumberFormatter = (num: number) => string;
export type PriceFormatter = (price: number) => string;

// ODIN.FUN 相关常量
export const ODIN_API_BASE_URL = 'https://api.odin.fun';
export const ODIN_UPLOADS_BASE_URL = 'https://api.odin.fun/uploads';
export const ODIN_IMAGES_BASE_URL = 'https://images.odin.fun/token';

export const ODIN_API_ENDPOINTS = {
	TOKENS: '/v1/tokens',
	TOKEN_DETAIL: (id: string) => `/v1/tokens/${id}`,
	TOKEN_HOLDERS: (id: string) => `/v1/tokens/${id}/holders`,
	TOKEN_TRANSACTIONS: (id: string) => `/v1/tokens/${id}/transactions`
} as const;

// 排序选项
export const SORT_OPTIONS = {
	VOLUME_DESC: 'volume:desc',
	VOLUME_ASC: 'volume:asc',
	MARKETCAP_DESC: 'marketcap:desc',
	MARKETCAP_ASC: 'marketcap:asc',
	CREATED_DESC: 'created_time:desc',
	CREATED_ASC: 'created_time:asc'
} as const;

// 默认API参数
export const DEFAULT_ODIN_PARAMS: Required<OdinTokensParams> = {
	sort: 'volume:desc',
	modified_by: 'table',
	page: 1,
	limit: 30,
	env: 'production',
	search: '',
	featured: false,
	verified: false,
	bonded: false
};
