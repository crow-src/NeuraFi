'use client';
import {useMemo, useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {Tab, Tabs} from '@heroui/react';
import {useTranslations} from 'next-intl';
import {Panel, PanelGroup, PanelResizeHandle} from 'react-resizable-panels';
import {useMedia} from 'react-use';
import {TradingChart, SwapTool, FundingList} from '../components';
import {swapPairs, SwapPair} from './data_test';

export function SwapView() {
	const tSwap = useTranslations('swap');
	const searchParams = useSearchParams();
	const [tab, setTab] = useState<string>('chart');
	const [selectedFunds, setSelectedFunds] = useState<Set<string>>(new Set());
	const isMd = useMedia('(min-width: 768px)');

	// 根据URL参数id获取市场数据
	const selectedPair: SwapPair | null = useMemo(() => {
		const id = searchParams.get('id');
		if (!id) return swapPairs[0] ?? null;
		return swapPairs.find(pair => pair.id === id) ?? swapPairs[0] ?? null;
	}, [searchParams]);

	// 生成交易头部数据
	const tradingHeader = useMemo(() => {
		const pair = selectedPair ?? swapPairs[0];
		if (!pair) {
			return {
				symbol: 'ETH/USDC',
				exchange: 'Swap',
				code: 'ETHUSDC',
				last: 3000.5,
				change: 125.8,
				changePct: 0.0437,
				bid: 3000.2,
				ask: 3000.8,
				pos: '125.6K'
			};
		}
		return {
			symbol: `${pair.baseSymbol}/${pair.quoteSymbol}`,
			exchange: 'Swap',
			code: pair.id.toUpperCase(),
			last: pair.price,
			change: pair.price * pair.changePct,
			changePct: pair.changePct,
			bid: pair.price * 0.999,
			ask: pair.price * 1.001,
			pos: pair.volume
		};
	}, [selectedPair]);

	// 处理配资资金选择
	const handleFundSelection = (fundId: string, isSelected: boolean) => {
		const newSelection = new Set(selectedFunds);
		if (isSelected) {
			newSelection.add(fundId);
		} else {
			newSelection.delete(fundId);
		}
		setSelectedFunds(newSelection);
	};

	const leftContent = (
		<div className='h-full w-full'>
			<Tabs fullWidth selectedKey={tab} onSelectionChange={e => setTab(e as string)} destroyInactiveTabPanel={false}>
				<Tab key='chart' title={tSwap('chart')}>
					<div className='h-full'>
						<TradingChart header={tradingHeader} onBack={() => console.log('back')} onOpenBuy={() => console.log('buy')} onOpenSell={() => console.log('sell')} showBottomActions={false} />
					</div>
				</Tab>
				<Tab key='robot' title={tSwap('funding')}>
					<FundingList selectedFunds={selectedFunds} onSelection={handleFundSelection} />
				</Tab>
			</Tabs>
		</div>
	);

	return isMd ? (
		<div className='h-[93vh] w-full mt-4'>
			<PanelGroup direction='horizontal' className=' w-full space-x-2'>
				<Panel defaultSize={70} minSize={55} maxSize={85} className='flex flex-col  h-full p-4 rounded-lg bg-background/60 backdrop-blur-xl border border-content3/30'>
					{leftContent}
				</Panel>
				<PanelResizeHandle className='w-1 bg-primary/30 hover:bg-primary transition-colors cursor-col-resize rounded-lg' />
				<Panel defaultSize={30} minSize={15} maxSize={45} className='flex flex-col h-full p-4 rounded-lg bg-background/60 backdrop-blur-xl border border-content3/30'>
					<SwapTool selectedPair={selectedPair ?? undefined} />
				</Panel>
			</PanelGroup>
		</div>
	) : (
		<div className='flex flex-col gap-2 w-full mt-4 px-2'>
			<SwapTool selectedPair={selectedPair ?? undefined} />
			{leftContent}
		</div>
	);
}
