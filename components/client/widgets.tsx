//外部组件的容器
'use client';
import {memo, useEffect, useRef} from 'react';

interface ViewWidgetProps {
	type?: 'advanced-chart' | 'market-overview' | 'ticker-tape' | 'screener';
	symbol?: string;
	theme?: 'light' | 'dark';
	locale?: string;
	autosize?: boolean;
	height?: string | number;
	width?: string | number;
	backgroundColor?: string;
	gridColor?: string;
	interval?: '1' | '3' | '5' | '15' | '30' | '60' | 'D' | 'W' | 'M';
	style?: '0' | '1' | '2' | '3' | '4';
	settings?: Record<string, any>;
}

function ViewWidget({type = 'advanced-chart', symbol = 'NASDAQ:AAPL', theme = 'dark', locale = 'en', autosize = true, height = '100%', width = '100%', backgroundColor = '#0F0F0F', gridColor = 'rgba(242, 242, 242, 0.06)', interval = 'D', style = '1', settings = {}}: ViewWidgetProps) {
	const container = useRef<HTMLDivElement>(null);
	const scriptLoaded = useRef(false);

	useEffect(() => {
		if (!container.current) return;

		// 完全清理容器内容
		container.current.innerHTML = '';
		scriptLoaded.current = false;

		// 创建 widget 容器
		const widgetContainer = document.createElement('div');
		widgetContainer.className = 'tradingview-widget-container__widget';
		widgetContainer.style.height = 'calc(100% - 32px)';
		widgetContainer.style.width = '100%';

		// 创建版权信息
		const copyrightDiv = document.createElement('div');
		copyrightDiv.className = 'tradingview-widget-copyright';
		copyrightDiv.innerHTML = `
			<a href="https://www.tradingview.com/symbols/${symbol}/?exchange=${symbol.split(':')[0]}" rel="noopener nofollow" target="_blank">
				<span class="blue-text">${symbol} chart by TradingView</span>
			</a>
		`;

		// 添加到容器
		container.current.appendChild(widgetContainer);
		container.current.appendChild(copyrightDiv);

		// 创建并配置脚本
		const script = document.createElement('script');
		script.src = `https://s3.tradingview.com/external-embedding/embed-widget-${type}.js`;
		script.type = 'text/javascript';
		script.async = true;

		// 基础配置
		const baseConfig = {
			theme,
			locale,
			autosize,
			backgroundColor,
			gridColor,
			interval,
			style
		};

		// 根据类型设置特定配置
		const typeSpecificConfig = {
			'advanced-chart': {
				symbol,
				allow_symbol_change: true,
				calendar: false,
				details: false,
				hide_side_toolbar: true,
				hide_top_toolbar: false,
				hide_legend: false,
				hide_volume: false,
				hotlist: false,
				save_image: true,
				timezone: 'Etc/UTC',
				watchlist: [],
				withdateranges: false,
				compareSymbols: [],
				studies: []
			},
			'market-overview': {
				tabs: [
					{
						title: 'Indices',
						symbols: [{s: 'NASDAQ:AAPL'}, {s: 'NYSE:BABA'}, {s: 'NYSE:SHOP'}]
					}
				]
			},
			'ticker-tape': {
				symbols: [
					{proName: 'NASDAQ:AAPL', title: 'Apple'},
					{proName: 'NYSE:BABA', title: 'Alibaba'},
					{proName: 'NYSE:SHOP', title: 'Shopify'}
				],
				displayMode: 'regular'
			},
			screener: {
				defaultColumn: 'overview',
				defaultScreen: 'general',
				market: 'crypto',
				showToolbar: true,
				colorTheme: theme
			}
		};

		// 合并配置，settings 优先级最高
		const config = {
			...baseConfig,
			...typeSpecificConfig[type],
			...settings
		};

		console.log('TradingView Widget Config:', config);
		script.innerHTML = JSON.stringify(config);

		// 添加脚本到容器
		container.current.appendChild(script);
		scriptLoaded.current = true;

		// 清理函数
		return () => {
			if (container.current) {
				container.current.innerHTML = '';
			}
			scriptLoaded.current = false;
		};
	}, [type, symbol, theme, locale, autosize, backgroundColor, gridColor, interval, style, JSON.stringify(settings)]);

	return (
		<div
			className='tradingview-widget-container'
			ref={container}
			style={{
				height: autosize ? '100%' : height,
				width: autosize ? '100%' : width
			}}
		/>
	);
}

export default memo(ViewWidget);
