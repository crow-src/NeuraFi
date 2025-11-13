'use client';
import {useMemo, useState, useCallback} from 'react';
import {useSearchParams} from 'next/navigation';
import {Avatar, AvatarGroup, Button, Card, Tab, Tabs, Chip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from '@heroui/react';
import {cn} from '@heroui/react';
import {Icon} from '@iconify/react';
import {useTranslations} from 'next-intl';

import CandlestickChart, {type AssetInfo, type ChartInterval} from '../components/CandlestickChart';

// ===== Trading Layout Types =====
export type KlineResolution = 'time' | 'daily' | '1min' | '15min' | '1hour' | 'more';

export interface QuoteHeader {
	symbol: string;
	exchange: string;
	code: string;
	last: number;
	change: number;
	changePct: number;
	bid: number;
	ask: number;
	pos: string;
}

interface TradingPageProps {
	header: QuoteHeader;
	onBack?: () => void;
	onOpenBuy?: () => void;
	onOpenSell?: () => void;
	showBottomActions?: boolean;
}

// ===== Helpers =====
const pct = (n: number): string => `${(n * 100).toFixed(2)}%`;
const getInterval = (res: KlineResolution): ChartInterval => {
	switch (res) {
		case 'time':
			return '1';
		case 'daily':
			return 'D';
		case '1min':
			return '1';
		case '15min':
			return '15';
		case '1hour':
			return '60';
		default:
			return 'D';
	}
};

// 交易图表
export function TradingChart({header, onBack, onOpenBuy, onOpenSell, showBottomActions = true}: TradingPageProps) {
	const tSwap = useTranslations('swap');
	const [res, setRes] = useState<KlineResolution>('daily');
	const [showIndicators, setShowIndicators] = useState<boolean>(true);

	const isUp = header.changePct >= 0;
	const RES_LIST: KlineResolution[] = ['time', 'daily', '1min', '15min', '1hour', 'more'];

	const assetInfo: AssetInfo = useMemo(() => ({symbol: header.symbol, exchange: header.exchange, code: header.code}), [header.symbol, header.exchange, header.code]);
	const currentInterval = useMemo(() => getInterval(res), [res]);

	// 创建翻译映射函数
	const getTabTitle = (key: KlineResolution) => {
		switch (key) {
			case 'time':
				return tSwap('time_chart');
			case 'daily':
				return tSwap('daily_chart');
			case '1min':
				return tSwap('1min_chart');
			case '15min':
				return tSwap('15min_chart');
			case '1hour':
				return tSwap('1hour_chart');
			case 'more':
				return tSwap('more');
			default:
				return key;
		}
	};

	return (
		<div className='mx-auto p-0 mt-4'>
			{/* 顶栏 */}
			<div className='mb-3 flex items-center justify-between'>
				<div className='flex items-center gap-2'>
					<Button isIconOnly variant='light' radius='sm' onPress={onBack} aria-label={tSwap('back')}>
						<Icon icon='mdi:arrow-left' width={20} className='text-primary' />
					</Button>
					<div className='flex flex-col leading-tight'>
						<div className='flex items-center gap-2'>
							<h1 className='text-xl font-bold'>{header.symbol}</h1>
							<Chip size='sm' radius='sm' variant='flat'>
								{tSwap('network')}
							</Chip>
							<Chip size='sm' radius='sm' variant='flat' className='tracking-wider'>
								{header.exchange}
							</Chip>
							<span className='text-xs text-foreground-500'>{header.code}</span>
						</div>
					</div>
				</div>
				<div className='flex items-center gap-2'>
					<Button isIconOnly variant='light' radius='sm' aria-label={tSwap('refresh')}>
						<Icon icon='mdi:refresh' width={20} />
					</Button>
					<Button isIconOnly variant='light' radius='sm' aria-label={tSwap('more_options')}>
						<Icon icon='mdi:dots-vertical' width={20} />
					</Button>
				</div>
			</div>

			{/* 报价区域 */}
			<Card className='flex flex-row mb-3 w-full p-2 justify-between'>
				<div className='flex flex-col'>
					<div className={`text-3xl font-bold tabular-nums ${isUp ? 'text-success' : 'text-danger'}`}>{header.last}</div>
					<div className='mt-1 text-sm tabular-nums text-foreground-500'>
						{header.change >= 0 ? '+' : ''}
						{header.change.toFixed(1)} / {pct(header.changePct)}
					</div>
				</div>
				<div className='flex flex-col gap-1'>
					<div className='flex justify-between items-center gap-4'>
						<div className='text-foreground-500 text-sm'>{tSwap('buy')}</div>
						<div className='tabular-nums font-medium'>{header.bid}</div>
					</div>
					<div className='flex justify-between items-center gap-4'>
						<div className='text-foreground-500 text-sm'>{tSwap('sell')}</div>
						<div className='tabular-nums font-medium'>{header.ask}</div>
					</div>
					<div className='flex justify-between items-center gap-4'>
						<div className='text-foreground-500 text-sm'>{tSwap('position')}</div>
						<div className='tabular-nums font-medium'>{header.pos}</div>
					</div>
				</div>
			</Card>

			{/* 周期 Tabs & 设置 */}
			<div className='mb-3 flex items-center justify-between gap-2'>
				<div className='flex-1 min-w-0'>
					<Tabs selectedKey={res} onSelectionChange={k => setRes(k as KlineResolution)} variant='underlined' classNames={{cursor: 'bg-primary'}}>
						{RES_LIST.map(t => (
							<Tab key={t} title={getTabTitle(t)} />
						))}
					</Tabs>
				</div>
				<div className='flex items-center gap-3 shrink-0'>
					<Dropdown>
						<DropdownTrigger className='w-full border-none'>
							<Button size='sm' variant='bordered' startContent={<Icon icon='mdi:tune' width={16} />}>
								{tSwap('settings')}
							</Button>
						</DropdownTrigger>
						<DropdownMenu aria-label={tSwap('settings')}>
							<DropdownItem key='indicator' onPress={() => setShowIndicators(v => !v)}>
								{tSwap('show_hide_indicators')}
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</div>
			</div>

			{/* 图表 */}
			<div className='w-full h-full'>
				<CandlestickChart asset={assetInfo} interval={currentInterval} theme='dark' height='460px' showVolume={true} showIndicators={showIndicators} backgroundColor='#0F0F0F' gridColor='rgba(242, 242, 242, 0.06)' style='1' className='mb-3' />
			</div>

			{/* 占位 */}
			{/* <div className='flex flex-row gap-2'>
				<div className='h-full w-full bg-green-500 rounded-lg'>{tSwap('placeholder')}</div>
				<div className='h-full w-full  bg-green-500 rounded-lg'>{tSwap('placeholder')}</div>
			</div> */}
		</div>
	);
}
