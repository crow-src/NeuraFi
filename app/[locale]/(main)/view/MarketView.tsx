import {useMemo, useState, useCallback} from 'react';
import {Tabs, Tab, Card, CardBody, Button, Input, Select, SelectItem} from '@heroui/react';
import {Icon} from '@iconify/react';
import {TabsClass} from '@/components/class';
import {NFT, NFTGrid} from '../components';
import {blindBoxItems} from './data_test';

const SELLER_NAMES = ['BoxTrader', 'LuckyDealer', 'ChainHunter', 'CryptoBoxer', 'MetaCollector', 'RareVault', 'MysteryGuru', 'BlindBoxer'];
const SELLER_AVATARS = ['/images/avatar/1.png', '/images/avatar/2.png', '/images/avatar/3.png', '/images/avatar/4.png', '/images/avatar/5.png', '/images/avatar/6.png', '/images/avatar/7.png', '/images/avatar/8.png'];
const CATEGORY_MAP: Record<string, string> = {
	rwa: 'Collectibles',
	cards: 'Sports',
	toys: 'Collectibles',
	sports: 'Sports',
	art: 'Art',
	welfare: 'Community'
};

export const blindBoxListings: NFT[] = blindBoxItems.slice(0, 24).map((item, index) => ({
	...item,
	status: 'listed',
	category: CATEGORY_MAP[item.type] ?? item.category ?? 'Collectibles',
	sellerName: SELLER_NAMES[index % SELLER_NAMES.length],
	sellerAvatar: SELLER_AVATARS[index % SELLER_AVATARS.length],
	listedDate: new Date(Date.now() - index * 86400000).toISOString(),
	isMyListing: index % 5 === 0,
	isMyPurchase: index % 7 === 0,
	isFavorited: index % 3 === 0
}));

// ====== Constant definitions ======
type MarketTabKey = 'all' | 'my-listings' | 'my-purchases' | 'favorites'; // market tabs
type SortKey = 'recent' | 'price-low' | 'price-high' | 'rarity'; // sort keys

type Option<T extends string> = {key: T; label: string}; // generic option

type SortOption = Option<SortKey> & {icon: string}; // sort option

type TabOption = Option<MarketTabKey>; // tab option

type RarityOption = Option<'all' | 'Common' | 'Rare' | 'Epic' | 'Legendary'>; // rarity option

// tabs configuration
const TABS: TabOption[] = [
	{key: 'all', label: 'All'},
	{key: 'my-listings', label: 'My Listings'},
	{key: 'my-purchases', label: 'My Purchases'},
	{key: 'favorites', label: 'Favorites'}
];
// sort option configuration
const SORT_OPTIONS: SortOption[] = [
	{key: 'recent', label: 'Newest', icon: 'mdi:clock'},
	{key: 'price-low', label: 'Price: Low', icon: 'mdi:sort-ascending'},
	{key: 'price-high', label: 'Price: High', icon: 'mdi:sort-descending'},
	{key: 'rarity', label: 'Rarity', icon: 'mdi:star'}
];

const RARITY_OPTIONS: RarityOption[] = [
	{key: 'all', label: 'All rarities'},
	{key: 'Common', label: 'Common'},
	{key: 'Rare', label: 'Rare'},
	{key: 'Epic', label: 'Epic'},
	{key: 'Legendary', label: 'Legendary'}
];

const rarityOrder: Record<string, number> = {Common: 1, Rare: 2, Epic: 3, Legendary: 4}; // rarity order

// sorters
const SORTERS: Record<SortKey, (a: NFT, b: NFT) => number> = {
	recent: (a, b) => (b.listedDate ? Date.parse(b.listedDate) : 0) - (a.listedDate ? Date.parse(a.listedDate) : 0),
	'price-low': (a, b) => a.price - b.price,
	'price-high': (a, b) => b.price - a.price,
	rarity: (a, b) => (rarityOrder[b.rarity ?? ''] || 0) - (rarityOrder[a.rarity ?? ''] || 0)
};

// ====== Market component ======
export function MarketView() {
	const [marketItems, setMarketItems] = useState<NFT[]>(blindBoxListings); // market dataset
	const [selectedTab, setSelectedTab] = useState<MarketTabKey>('all'); // active tab
	const [searchQuery, setSearchQuery] = useState(''); // search keyword
	const [sortBy, setSortBy] = useState<SortKey>('recent'); // sorting key
	const [selectedCategory, setSelectedCategory] = useState('all'); // category filter
	const [selectedRarity, setSelectedRarity] = useState<'all' | 'Common' | 'Rare' | 'Epic' | 'Legendary'>('all'); // rarity filter

	// toggle favorite flag
	const toggleFavorite = useCallback((target: NFT, next: boolean) => {
		setMarketItems(items => items.map(item => (item.id === target.id ? {...item, isFavorited: next} : item)));
	}, []);

	// cancel listing
	const cancelListing = useCallback((target: NFT) => {
		setMarketItems(items => items.filter(item => item.id !== target.id));
	}, []);

	// edit listing (placeholder)
	const editListing = useCallback((target: NFT) => {
		console.info('Edit listing', target.id);
	}, []);

	// build tab buckets
	const tabBuckets = useMemo(() => {
		const buckets: Record<MarketTabKey, NFT[]> = {
			all: marketItems.filter(item => !item.isMyListing),
			'my-listings': marketItems.filter(item => item.isMyListing),
			'my-purchases': marketItems.filter(item => item.isMyPurchase),
			favorites: marketItems.filter(item => item.isFavorited)
		};
		return buckets;
	}, [marketItems]);

	// compose filters + sorting
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

	// filtered list per tab
	const filteredPerTab = useMemo(() => {
		return (Object.keys(tabBuckets) as MarketTabKey[]).reduce<Record<MarketTabKey, NFT[]>>(
			(acc, key) => {
				acc[key] = applyFilters(tabBuckets[key]);
				return acc;
			},
			{all: [], 'my-listings': [], 'my-purchases': [], favorites: []}
		);
	}, [tabBuckets, applyFilters]);

	// category dropdown options
	const categoryOptions = useMemo(() => ['all', ...new Set(marketItems.map(item => item.category ?? 'Other'))], [marketItems]);

	// card selection handler
	const handleSelect = useCallback(
		(tab: MarketTabKey, nft: NFT) => {
			if (tab === 'my-listings') {
				editListing(nft);
				return;
			}
			console.info('View NFT', nft.id);
		},
		[editListing]
	);

	return (
		<div className='h-full w-full flex flex-col p-6 pt-0 overflow-y-auto custom-scrollbar'>
			<Card>
				<CardBody>
					<div className='flex flex-col lg:flex-row gap-4 items-center justify-between'>
						{/* Header */}
						<div className='w-full flex flex-col gap-1'>
							<h1 className='text-xl font-bold text-primary-foreground'>NFT Blind Box Marketplace</h1>
							<p className='text-primary-foreground text-xs'>Trade your NFTs and discover rare collectibles</p>
						</div>
						{/* Filters */}
						<div className='flex gap-2 items-center'>
							<Input placeholder='Search NFT name, description or category...' value={searchQuery} onChange={e => setSearchQuery(e.target.value)} startContent={<Icon icon='mdi:magnify' className='w-4 h-4 text-default-400' />} className='max-w-md' />
							<Select selectedKeys={[selectedCategory]} onSelectionChange={keys => setSelectedCategory(Array.from(keys)[0] as string)} className='w-32' size='sm'>
								{categoryOptions.map(option => (
									<SelectItem key={option}>{option === 'all' ? 'All categories' : option}</SelectItem>
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

			{/* Tabs content */}
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
