// brc20铭刻订单列表
export interface BRC20Info {
	ticker: string; // 名称
	creator: string; // 创建者
	totalMinted: string; // 总铸造量
	confirmedMinted: string; // 确认铸造量
	confirmedMinted1h: string; // 1小时确认铸造量
	confirmedMinted24h: string; // 24小时确认铸造量
	completeBlocktime: number; // 完成时间
	completeHeight: number; // 完成高度
	inscriptionNumberEnd: number; // 铭刻编号结束
	inscriptionNumberStart: number; // 铭刻编号开始
	minted: string; // 铸造量
	mintTimes: number; // 铸造次数
	historyCount: number; // 历史次数
	holdersCount: number; // 持有者数量
	txid: string; // 交易id
	deployHeight: number; // 部署高度
	deployBlocktime: number; // 部署时间
	inscriptionId: string; // 铭刻id
	inscriptionNumber: number; // 铭刻编号
	max: string; // 最大铸造量
	decimal: number; // 小数位
	limit: string; // 限制铸造量
	selfMint: boolean; // 是否自铸
}

// 符文铭刻订单列表
export interface RunesInfo {
	runeid: string; // 符文id
	rune: string; // 符文
	spacedRune: string; // 符文名称
	number: number; // 符文编号
	height: number; // 高度
	txidx: number; // 交易索引
	timestamp: number; // 时间戳
	divisibility: number; // 可分割性
	symbol: string; // 符号
	etching: string; // 蚀刻
	premine: string; // 预挖remaining
	terms: {
		amount: string; // 数量
		cap: string; // 上限
		heightStart: number | null; // 高度开始
		heightEnd: number | null; // 高度结束
		offsetStart: number | null; // 偏移开始
		offsetEnd: number | null; // 偏移结束
	};
	mints: string; // 铸造
	burned: string; // 燃烧
	holders: number; // 持有者
	transactions: number; // 交易
	supply: string; // 总量
	start: number | null; // 开始
	end: number | null; // 结束
	mintable: boolean; // 可铸造
	remaining: string; // 剩余 其余的
	oneDayMints: number; // 1天铸造
	sevenDayMints: number; // 7天铸造
	sixHourMints: number; // 6小时铸造
	anHourMints: number; // 1小时铸造
	progress: number; // 进度
}
