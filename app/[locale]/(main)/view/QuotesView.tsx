'use client';

import React, {useMemo, useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {Card, CardHeader, CardBody, Tabs, Tab, Input, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from '@heroui/react';
import {Icon} from '@iconify/react';
import {useTranslations} from 'next-intl';
import {TabsClass} from '@/components/class';
import {QuoteCard, QuoteItem, QuoteCategory, NFT} from '../components';
import {rawBlindBoxItems} from './data_test';

// ===== 行情 主视图 =====
export interface SortState {
	key: 'last' | 'changePct' | 'name';
	dir: 'asc' | 'desc';
}

const sortItems = (items: QuoteItem[], sort: SortState): QuoteItem[] => {
	const copy = [...items];
	copy.sort((a, b) => {
		const dir = sort.dir === 'asc' ? 1 : -1;
		if (sort.key === 'name') return a.name.localeCompare(b.name) * dir;
		if (sort.key === 'last') return (a.last - b.last) * dir;
		return (a.changePct - b.changePct) * dir;
	});
	return copy;
};

const QUOTE_CATEGORIES: QuoteCategory[] = ['主流', 'DeFi', '稳定币', 'Layer2', '扩容', '预言机', 'Meme', 'AI', 'GameFi'];
const QUOTE_EXCHANGES = ['OKX', 'Binance', 'Coinbase', 'Bybit', 'Gate', 'KuCoin'];
const QUOTE_GROUPS = ['默认分组', '热门自选', '套利组合'];

const buildSymbol = (name: string, index: number) => {
	const letters = name
		.replace(/[^a-zA-Z]/g, '')
		.slice(0, 3)
		.toUpperCase();
	const suffix = String.fromCharCode(65 + (index % 26));
	return `${letters || 'NFT'}-${suffix}`;
};

const deriveQuotes = (items: NFT[]): QuoteItem[] =>
	items.map((item, index) => {
		const category = QUOTE_CATEGORIES[index % QUOTE_CATEGORIES.length];
		const changePct = Number((((index % 17) - 8) / 100).toFixed(4));
		const last = Number((item.price * (1 + changePct)).toFixed(2));
		return {
			...item,
			symbol: buildSymbol(item.name, index),
			exchange: QUOTE_EXCHANGES[index % QUOTE_EXCHANGES.length],
			last,
			changePct,
			quoteCategory: category,
			group: QUOTE_GROUPS[index % QUOTE_GROUPS.length],
			starred: index % 5 === 0
		};
	});

export function QuotesView() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const t = useTranslations('common');
	const allQuotes = useMemo(() => deriveQuotes(rawBlindBoxItems), []);
	const quoteCategories = useMemo(() => Array.from(new Set(allQuotes.map(item => item.quoteCategory))) as QuoteCategory[], [allQuotes]);
	const [activeCat, setActiveCat] = useState<QuoteCategory>(() => quoteCategories[0] ?? QUOTE_CATEGORIES[0]);
	const [query, setQuery] = useState<string>('');
	const [onlyUp, setOnlyUp] = useState<boolean>(false);
	const [sort, setSort] = useState<SortState>({key: 'name', dir: 'asc'});

	const filtered = useMemo(() => {
		const q = query.trim();
		let list = allQuotes.filter(i => i.quoteCategory === activeCat);
		if (q.length > 0) {
			const lower = q.toLowerCase();
			list = list.filter(i => i.name.toLowerCase().includes(lower) || i.symbol.toLowerCase().includes(lower) || i.exchange.toLowerCase().includes(lower));
		}
		if (onlyUp) list = list.filter(i => i.changePct >= 0);
		return sortItems(list, sort);
	}, [activeCat, allQuotes, onlyUp, query, sort]);

	// 处理点击市场卡片 - 导航到交易页面并附带 id 参数
	const handleCardClick = (item: QuoteItem) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('tab', 'trading');
		params.set('id', item.id);
		router.push(`?${params.toString()}`);
	};

	return (
		<Card className='bg-background/60 backdrop-blur-xl border border-content3/30 shadow-lg w-full md:h-[93vh]'>
			<CardHeader className='flex  gap-4 sm:flex-row sm:items-center sm:justify-between'>
				{/* 标题区域 */}
				<div className='flex items-center gap-3 flex-shrink-0'>
					<Icon icon='material-symbols:trending-up' className='w-8 h-8 text-primary flex-shrink-0' />
					<h2 className='text-xl font-bold tracking-tight flex-shrink-0'>{t('real_time_quotes')}</h2>
				</div>
				{/* 搜索和筛选区域 */}
				<div className='flex items-center gap-2 w-full sm:w-auto min-w-0'>
					<Input value={query} onValueChange={setQuery} startContent={<Icon icon='mdi:magnify' width={20} />} radius='sm' variant='bordered' placeholder={t('search')} className='flex-1 min-w-0' />
					<Button size='sm' variant={onlyUp ? 'solid' : 'bordered'} onPress={() => setOnlyUp(prev => !prev)} startContent={<Icon icon='mdi:trending-up' width={18} />}>
						仅看涨幅
					</Button>
					<Dropdown>
						<DropdownTrigger>
							<Button isIconOnly variant='flat' radius='sm' className='text-primary-foreground'>
								<Icon icon='mdi:filter-variant' width={16} />
							</Button>
						</DropdownTrigger>
						<DropdownMenu
							aria-label={t('sort_field')}
							selectionMode='single'
							classNames={{list: 'bg-primary-background'}}
							disallowEmptySelection
							selectedKeys={[sort.key]}
							onSelectionChange={keys => {
								const key = Array.from(keys)[0] as SortState['key'];
								setSort(prev => ({key, dir: prev.key === key ? prev.dir : 'desc'}));
							}}>
							<DropdownItem key='name'>{t('sort_by_name')}</DropdownItem>
							<DropdownItem key='last'>{t('sort_by_price')}</DropdownItem>
							<DropdownItem key='changePct'>{t('sort_by_change')}</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</div>
			</CardHeader>
			<CardBody className='pt-0'>
				<Tabs aria-label={t('category')} selectedKey={activeCat} onSelectionChange={k => setActiveCat(k as QuoteCategory)} variant='underlined' classNames={TabsClass}>
					{quoteCategories.map(c => (
						<Tab key={c} title={c} />
					))}
				</Tabs>
				<div className='mt-3 grid grid-cols-1 gap-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>{filtered.length === 0 ? <div className='col-span-full py-8 text-center text-foreground-500'>{t('no_data')}</div> : filtered.map(it => <QuoteCard key={it.id} item={it} onClick={handleCardClick} />)}</div>
			</CardBody>
		</Card>
	);
}
