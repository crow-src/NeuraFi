// 转换规则接口
export type TransformRule<T> = {
	[P: string]: ((item: any, index: number) => any) | undefined;
};

/** 通用转换数据到指定格式
 * Transforms the given API data to the specified type using the provided transform rules.
 * @param apiData The API data to transform.
 * @param transformRules The rules to map the API data keys to the target type properties.
 * @returns The transformed data of type T.
 */
export function transformDataToProps<T>(data: any, transformRules: {[K in keyof T]?: string | ((item: any, index: number) => any)}): T[] {
	if (!data) return [];

	return data.map((item: any, index: number): T => {
		const result = {} as T;
		for (const key in transformRules) {
			const rule = transformRules[key];
			result[key] = typeof rule === 'function' ? rule(item, index) : item[rule];
		}
		return result;
	});
}

// BRC20Balance 到 IToken 的转换规则
export const BRC20BalanceToTokenRules: TransformRule<IToken> = {
	name: (item: BRC20Balance) => item.ticker,
	symbol: (item: BRC20Balance) => item.ticker,
	decimals: (item: BRC20Balance) => item.decimal,
	balance: (item: BRC20Balance) => item.availableBalance,
	amount: (item: BRC20Balance) => Number(item.availableBalance),
	agreement: () => 'BRC-20'
};

// RunesBalance 到 IToken 的转换规则
export const RunesBalanceToTokenRules: TransformRule<IToken> = {
	name: (item: RunesBalance) => item.spacedRune,
	symbol: (item: RunesBalance) => item.symbol,
	decimals: (item: RunesBalance) => item.divisibility,
	balance: (item: RunesBalance) => item.amount,
	amount: (item: RunesBalance) => Number(item.amount),
	runeid: (item: RunesBalance) => item.runeid,
	agreement: () => 'Runes'
};

// BRC20Balance 到 IToken 的转换规则
export const BRC20InfoToTokenRules: TransformRule<IToken> = {
	name: item => item.ticker,
	symbol: item => item.ticker,
	decimals: item => item.decimal,
	balance: item => item.limit, // 铸造上限
	amount: item => Number(item.availableBalance),
	agreement: () => 'BRC-20'
};

// RunesBalance 到 IToken 的转换规则
export const RunesInfoToTokenRules: TransformRule<IToken> = {
	name: item => item.spacedRune,
	symbol: item => item.symbol,
	decimals: item => item.divisibility,
	balance: item => item.amount,
	amount: item => Number(item.amount),
	runeid: item => item.runeid,
	agreement: () => 'Runes'
};
