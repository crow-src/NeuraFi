'use client';

import React, {useMemo, useEffect, useRef} from 'react';
import {Card, CardBody} from '@heroui/react';
import ViewWidget from '@/components/client/widgets';

// 图表时间周期类型
export type ChartInterval = '1' | '3' | '5' | '15' | '30' | '60' | 'D' | 'W' | 'M';

// 图表样式类型
export type ChartStyle = '0' | '1' | '2' | '3' | '4'; // 0=Bar, 1=Candle, 2=Line, 3=Area, 4=HeikinAshi

// 图表主题
export type ChartTheme = 'light' | 'dark';

// 商品信息接口
export interface AssetInfo {
	symbol: string; // 商品名称，如 "铂金2510"
	exchange: string; // 交易所，如 "纽商NYMEX"
	code: string; // 商品代码，如 "PL2510"
}

// 图表配置接口
export interface CandlestickChartProps {
	asset: AssetInfo;
	interval?: ChartInterval;
	theme?: ChartTheme;
	height?: string | number;
	showVolume?: boolean;
	showIndicators?: boolean;
	backgroundColor?: string;
	gridColor?: string;
	style?: ChartStyle;
	className?: string;
	// 自定义技术指标
	studies?: string[];
	// 额外的 TradingView 配置
	customSettings?: Record<string, any>;
}

// 商品代码映射 - 使用免费版本完全可用的 symbols
const SYMBOL_MAP: Record<string, string> = {
	PL: 'TVC:PLATINUM', // 铂金现货价格
	GC: 'TVC:GOLD', // 黄金现货价格
	SI: 'TVC:SILVER', // 白银现货价格
	CL: 'TVC:USOIL', // 美国原油
	NG: 'TVC:NATURALGAS', // 天然气
	HG: 'TVC:COPPER', // 铜现货价格
	ZC: 'CBOT:ZC1!', // 玉米期货
	ZS: 'CBOT:ZS1!', // 大豆期货
	ZW: 'CBOT:ZW1!' // 小麦期货
};

// 默认测试用的免费可用 symbols
const DEFAULT_SYMBOLS: Record<string, string> = {
	铂金: 'TVC:PLATINUM',
	黄金: 'TVC:GOLD',
	白银: 'TVC:SILVER',
	原油: 'TVC:USOIL',
	天然气: 'TVC:NATURALGAS',
	铜: 'TVC:COPPER',
	比特币: 'BITSTAMP:BTCUSD',
	以太坊: 'BITSTAMP:ETHUSD',
	default: 'BITSTAMP:BTCUSD' // 默认使用比特币，免费且稳定
};

// Symbol 转换函数
const convertToTradingViewSymbol = (asset: AssetInfo): string => {
	// 方法1: 根据商品名称直接匹配
	const symbolByName = DEFAULT_SYMBOLS[asset.symbol] || DEFAULT_SYMBOLS[asset.symbol.replace(/\d+$/, '')];
	if (symbolByName) {
		return symbolByName;
	}

	// 方法2: 根据代码映射
	const baseCode = asset.code.replace(/\d+$/, '');
	const mappedSymbol = SYMBOL_MAP[baseCode];
	if (mappedSymbol) {
		return mappedSymbol;
	}

	// 如果都失败，使用默认的免费symbol
	return DEFAULT_SYMBOLS.default;
};

// 蜡烛图组件
export const CandlestickChart: React.FC<CandlestickChartProps> = ({asset, interval = 'D', theme = 'dark', height = '460px', showVolume = true, showIndicators = false, backgroundColor = '#0F0F0F', gridColor = 'rgba(242, 242, 242, 0.06)', style = '1', className = '', studies = [], customSettings = {}}) => {
	const widgetRef = useRef<HTMLDivElement>(null);
	const isInitialized = useRef(false);

	// 转换为 TradingView symbol
	const tvSymbol = useMemo(() => {
		const symbol = convertToTradingViewSymbol(asset);
		console.log('CandlestickChart Symbol:', {
			original: asset,
			converted: symbol
		});
		return symbol;
	}, [asset]);

	// 构建技术指标列表
	const chartStudies = useMemo(() => {
		const defaultStudies = showIndicators ? ['MASimple@tv-basicstudies'] : [];
		return [...defaultStudies, ...studies];
	}, [showIndicators, studies]);

	// 构建完整的图表配置
	const chartSettings = useMemo(() => {
		const baseSettings = {
			allow_symbol_change: false,
			calendar: false,
			details: false,
			hide_side_toolbar: true,
			hide_top_toolbar: false,
			hide_legend: false,
			hide_volume: !showVolume,
			hotlist: false,
			save_image: false,
			timezone: 'Etc/UTC',
			watchlist: [],
			withdateranges: false,
			compareSymbols: [],
			studies: chartStudies,
			autosize: true,
			popup_width: '1000',
			popup_height: '650',
			no_referral_id: true,
			disabled_features: ['header_symbol_search', 'symbol_search_hot_key', 'header_chart_type', 'header_settings', 'header_indicators', 'header_compare', 'header_undo_redo', 'header_screenshot', 'header_fullscreen_button'],
			enabled_features: ['study_templates']
		};

		return {
			...baseSettings,
			...customSettings
		};
	}, [showVolume, chartStudies, customSettings]);

	// 使用 key 来强制重新创建组件，避免重复渲染
	const widgetKey = useMemo(() => {
		return `${tvSymbol}-${interval}-${theme}-${JSON.stringify(chartSettings)}`;
	}, [tvSymbol, interval, theme, chartSettings]);

	return (
		<Card className={`border border-content3/30 ${className}`}>
			<CardBody className='p-0'>
				<div style={{height, width: '100%'}}>
					<ViewWidget
						key={widgetKey} // 添加 key 来强制重新创建
						type='advanced-chart'
						symbol={tvSymbol}
						interval={interval}
						theme={theme}
						backgroundColor={backgroundColor}
						gridColor={gridColor}
						style={style}
						settings={chartSettings}
					/>
				</div>
			</CardBody>
		</Card>
	);
};

export default CandlestickChart;
