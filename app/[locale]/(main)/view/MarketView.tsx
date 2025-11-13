import {useMemo, useState, useCallback} from 'react';
import {Tabs, Tab, Card, CardBody, Button, Input, Select, SelectItem} from '@heroui/react';
import {Icon} from '@iconify/react';
import {TabsClass} from '@/components/class';
import {NFT, NFTGrid} from '../components';
import {blindBoxItems} from './data_test';

const SELLER_NAMES = ['BoxTrader', 'LuckyDealer', 'ChainHunter', 'CryptoBoxer', 'MetaCollector', 'RareVault', 'MysteryGuru', 'BlindBoxer'];
const SELLER_AVATARS = ['/images/avatar/1.png', '/images/avatar/2.png', '/images/avatar/3.png', '/images/avatar/4.png', '/images/avatar/5.png', '/images/avatar/6.png', '/images/avatar/7.png', '/images/avatar/8.png'];
const CATEGORY_MAP: Record<string, string> = {
	rwa: '收藏品',
	cards: '体育',
	toys: '收藏品',
	sports: '体育',
	art: '艺术',
	welfare: '社区'
};

export const blindBoxListings: NFT[] = blindBoxItems.slice(0, 24).map((item, index) => ({
	...item,
	status: 'listed',
	category: CATEGORY_MAP[item.type] ?? item.category ?? '收藏品',
	sellerName: SELLER_NAMES[index % SELLER_NAMES.length],
	sellerAvatar: SELLER_AVATARS[index % SELLER_AVATARS.length],
	listedDate: new Date(Date.now() - index * 86400000).toISOString(),
	isMyListing: index % 5 === 0,
	isMyPurchase: index % 7 === 0,
	isFavorited: index % 3 === 0
}));

// ====== 常量定义 ======
type MarketTabKey = 'all' | 'my-listings' | 'my-purchases' | 'favorites'; //市场标签
type SortKey = 'recent' | 'price-low' | 'price-high' | 'rarity'; //排序方式

type Option<T extends string> = {key: T; label: string}; //选项

type SortOption = Option<SortKey> & {icon: string}; //排序选项

type TabOption = Option<MarketTabKey>; //市场标签选项

type RarityOption = Option<'all' | 'Common' | 'Rare' | 'Epic' | 'Legendary'>; //稀有度选项

//市场标签数据
const TABS: TabOption[] = [
	{key: 'all', label: '全部'},
	{key: 'my-listings', label: '我的挂单'},
	{key: 'my-purchases', label: '我的购买'},
	{key: 'favorites', label: '我的收藏'}
];
//排序选项数据
const SORT_OPTIONS: SortOption[] = [
	{key: 'recent', label: '最新', icon: 'mdi:clock'},
	{key: 'price-low', label: '价格低', icon: 'mdi:sort-ascending'},
	{key: 'price-high', label: '价格高', icon: 'mdi:sort-descending'},
	{key: 'rarity', label: '稀有度', icon: 'mdi:star'}
];

const RARITY_OPTIONS: RarityOption[] = [
	{key: 'all', label: '全部稀有度'},
	{key: 'Common', label: '普通'},
	{key: 'Rare', label: '稀有'},
	{key: 'Epic', label: '史诗'},
	{key: 'Legendary', label: '传说'}
];

const rarityOrder: Record<string, number> = {Common: 1, Rare: 2, Epic: 3, Legendary: 4}; //稀有度排序

//排序器
const SORTERS: Record<SortKey, (a: NFT, b: NFT) => number> = {
	recent: (a, b) => (b.listedDate ? Date.parse(b.listedDate) : 0) - (a.listedDate ? Date.parse(a.listedDate) : 0),
	'price-low': (a, b) => a.price - b.price,
	'price-high': (a, b) => b.price - a.price,
	rarity: (a, b) => (rarityOrder[b.rarity ?? ''] || 0) - (rarityOrder[a.rarity ?? ''] || 0)
};

// ====== 市场组件 ======
export function MarketView() {
	const [marketItems, setMarketItems] = useState<NFT[]>(blindBoxListings); // 市场数据
	const [selectedTab, setSelectedTab] = useState<MarketTabKey>('all'); // 当前标签
	const [searchQuery, setSearchQuery] = useState(''); // 搜索关键词
	const [sortBy, setSortBy] = useState<SortKey>('recent'); // 排序方式
	const [selectedCategory, setSelectedCategory] = useState('all'); // 分类
	const [selectedRarity, setSelectedRarity] = useState<'all' | 'Common' | 'Rare' | 'Epic' | 'Legendary'>('all'); // 稀有度

	// 切换收藏状态
	const toggleFavorite = useCallback((target: NFT, next: boolean) => {
		setMarketItems(items => items.map(item => (item.id === target.id ? {...item, isFavorited: next} : item)));
	}, []);

	// 下架挂单
	const cancelListing = useCallback((target: NFT) => {
		setMarketItems(items => items.filter(item => item.id !== target.id));
	}, []);

	// 编辑挂单（占位）
	const editListing = useCallback((target: NFT) => {
		console.info('编辑挂单', target.id);
	}, []);

	// 标签数据桶：根据身份拆分数据
	const tabBuckets = useMemo(() => {
		const buckets: Record<MarketTabKey, NFT[]> = {
			all: marketItems.filter(item => !item.isMyListing),
			'my-listings': marketItems.filter(item => item.isMyListing),
			'my-purchases': marketItems.filter(item => item.isMyPurchase),
			favorites: marketItems.filter(item => item.isFavorited)
		};
		return buckets;
	}, [marketItems]);

	// 组合筛选 + 排序
	const applyFilters = useCallback(
		(items: NFT[]) => {
			const keyword = searchQuery.trim().toLowerCase();
			const filtered = items.filter(item => {
				const matchKeyword = !keyword || [item.name, item.description, item.category].some(text => text?.toLowerCase().includes(keyword));
				const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
				const matchRarity = selectedRarity === 'all' || item.rarity === selectedRarity;
				return matchKeyword && matchCategory && matchRarity;
			});
			return [...filtered].sort(SORTERS[sortBy]);
		},
		[searchQuery, selectedCategory, selectedRarity, sortBy]
	);

	// 各标签过滤后的数据
	const filteredPerTab = useMemo(() => {
		return (Object.keys(tabBuckets) as MarketTabKey[]).reduce<Record<MarketTabKey, NFT[]>>(
			(acc, key) => {
				acc[key] = applyFilters(tabBuckets[key]);
				return acc;
			},
			{all: [], 'my-listings': [], 'my-purchases': [], favorites: []}
		);
	}, [tabBuckets, applyFilters]);

	// 分类选项
	const categoryOptions = useMemo(() => ['all', ...new Set(marketItems.map(item => item.category ?? '其他'))], [marketItems]);

	// 选中卡片
	const handleSelect = useCallback(
		(tab: MarketTabKey, nft: NFT) => {
			if (tab === 'my-listings') {
				editListing(nft);
				return;
			}
			console.info('查看NFT', nft.id);
		},
		[editListing]
	);

	return (
		<div className='h-full w-full flex flex-col p-6 pt-0 overflow-y-auto custom-scrollbar'>
			<Card>
				<CardBody>
					<div className='flex flex-col lg:flex-row gap-4 items-center justify-between'>
						{/* 标题区域 */}
						<div className='w-full flex flex-col gap-1'>
							<h1 className='text-xl font-bold text-primary-foreground'>NFT盲盒市场</h1>
							<p className='text-primary-foreground text-xs'>交易您的NFT盲盒，发现稀有收藏品</p>
						</div>
						{/* 筛选器 */}
						<div className='flex gap-2 items-center'>
							<Input placeholder='搜索NFT名称、描述或分类...' value={searchQuery} onChange={e => setSearchQuery(e.target.value)} startContent={<Icon icon='mdi:magnify' className='w-4 h-4 text-default-400' />} className='max-w-md' />
							<Select selectedKeys={[selectedCategory]} onSelectionChange={keys => setSelectedCategory(Array.from(keys)[0] as string)} className='w-32' size='sm'>
								{categoryOptions.map(option => (
									<SelectItem key={option}>{option === 'all' ? '全部分类' : option}</SelectItem>
								))}
							</Select>
							<Select selectedKeys={[selectedRarity]} onSelectionChange={keys => setSelectedRarity(Array.from(keys)[0] as typeof selectedRarity)} className='w-32' size='sm'>
								{RARITY_OPTIONS.map(option => (
									<SelectItem key={option.key}>{option.label}</SelectItem>
								))}
							</Select>
							{SORT_OPTIONS.map(option => (
								<Button key={option.key} variant={sortBy === option.key ? 'solid' : 'bordered'} size='sm' onPress={() => setSortBy(option.key)} startContent={<Icon icon={option.icon} className='w-4 h-4' />}>
									{option.label}
								</Button>
							))}
						</div>
					</div>
				</CardBody>
			</Card>

			{/* 标签页内容 */}
			<div className='w-full'>
				<Tabs selectedKey={selectedTab} onSelectionChange={key => setSelectedTab(key as MarketTabKey)} variant='underlined' classNames={TabsClass}>
					{TABS.map(tab => (
						<Tab key={tab.key} title={tab.label}>
							<div className='py-4'>
								<NFTGrid nfts={filteredPerTab[tab.key]} mode='market' onSelect={nft => handleSelect(tab.key, nft)} onToggleFavorite={toggleFavorite} onEditListing={editListing} onCancelListing={cancelListing} />
							</div>
						</Tab>
					))}
				</Tabs>
			</div>
		</div>
	);
}
