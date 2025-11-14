'use client';

import {useState, useCallback, useMemo} from 'react';
import {Tabs, Tab, Listbox, ListboxItem, Chip, Avatar, Divider} from '@heroui/react';
import {Icon} from '@iconify/react';
import {TabsClass} from '@/components/class';
// ===== 排行榜配置 =====

interface RankingTabConfig {
	key: string;
	title: string;
	heading: string;
	description: string;
	getData: () => RankingItem[];
}

const rankingTabs: RankingTabConfig[] = [
	{
		key: 'trending',
		title: '最热',
		heading: '最热排行榜',
		description: '根据24小时交易量和热度排序',
		getData: () => trendingRanking
	},
	{
		key: 'marketCap',
		title: '市值',
		heading: '市值排行榜',
		description: '根据总市值从高到低排序',
		getData: () => marketCapRanking
	},
	{
		key: 'newest',
		title: '最新',
		heading: '最新排行榜',
		description: '根据发布时间排序',
		getData: () => newestRanking
	},
	{
		key: 'volume',
		title: '交易量',
		heading: '交易量排行榜',
		description: '根据7天交易量排序',
		getData: () => volumeRanking
	},
	{
		key: 'price',
		title: '价格',
		heading: '价格排行榜',
		description: '根据当前价格从高到低排序',
		getData: () => priceRanking
	},
	{
		key: 'rarity',
		title: '稀有度',
		heading: '稀有度排行榜',
		description: '根据稀有度等级排序',
		getData: () => rarityRanking
	}
];

// ===== 排行榜 主视图 =====

export function RankView() {
	const [selectedTab, setSelectedTab] = useState('trending');
	const currentTabConfig = useMemo(() => rankingTabs.find(tab => tab.key === selectedTab) ?? rankingTabs[0], [selectedTab]); // 获取当前选中的标签页配置
	const currentRanking = useMemo(() => currentTabConfig.getData(), [currentTabConfig]); // 获取当前排行榜数据

	return (
		<div className='h-[93vh] w-full flex flex-col'>
			{/* 排行榜分类标签页 */}
			<div className='w-full p-4'>
				<Tabs selectedKey={selectedTab} onSelectionChange={key => setSelectedTab(key as string)} variant='underlined' classNames={TabsClass}>
					{rankingTabs.map(tab => (
						<Tab key={tab.key} title={tab.title}>
							<div className='flex flex-col gap-4 py-4'>
								<span className='flex gap-2 items-baseline'>
									<h3 className='text-lg font-semibold'>{tab.heading}</h3>
									<p className='text-sm text-primary-foreground'>{tab.description}</p>
								</span>
								<RankingList items={currentRanking} />
							</div>
						</Tab>
					))}
				</Tabs>
			</div>
		</div>
	);
}

// 排行榜列表组件
function RankingList({items}: {items: RankingItem[]}) {
	return (
		<div className='w-full'>
			<Listbox
				aria-label='排行榜'
				classNames={{
					base: 'max-w-full p-0',
					list: 'gap-0'
				}}>
				{items.map((item, index) => (
					<ListboxItem
						key={item.id}
						textValue={item.name}
						className='px-2 py-3 hover:bg-default-100'
						startContent={
							<div className='flex items-center gap-4 w-full'>
								{/* 排名 */}
								<div className='flex items-center justify-center w-12 h-12 rounded-md bg-primary text-primary-foreground font-bold text-lg'>{index + 1}</div>
								{/* 图片 */}
								<Avatar src={item.image} radius='sm' className='w-12 h-12 shrink-0' fallback={<Icon icon='mdi:image' className='w-6 h-6' />} />
								{/* 信息 */}
								<div className='flex-1 min-w-0'>
									<div className='flex items-center gap-2 mb-1'>
										<h4 className='font-semibold text-primary-foreground truncate'>{item.name}</h4>
										<Chip size='sm' color={getRarityColor(item.rarity)} variant='flat'>
											{item.rarity}
										</Chip>
									</div>
									<p className='text-sm text-primary-foreground truncate'>{item.collection}</p>
								</div>
								{/* 价格和变化 */}
								<div className='text-right shrink-0'>
									<div className='font-bold text-primary-foreground'>${item.price.toLocaleString()}</div>
									<div className={`text-sm flex items-center gap-1 ${item.change >= 0 ? 'text-success' : 'text-danger'}`}>
										<Icon icon={item.change >= 0 ? 'mdi:trending-up' : 'mdi:trending-down'} className='w-4 h-4' />
										{Math.abs(item.change)}%
									</div>
								</div>
							</div>
						}>
						{/* 分隔线 */}
						{index < items.length - 1 && <Divider className='my-2' />}
					</ListboxItem>
				))}
			</Listbox>
		</div>
	);
}

// 获取稀有度颜色
function getRarityColor(rarity: string) {
	switch (rarity) {
		case 'Legendary':
			return 'warning';
		case 'Epic':
			return 'secondary';
		case 'Rare':
			return 'primary';
		case 'Common':
			return 'default';
		case 'Special':
			return 'success';
		default:
			return 'default';
	}
}

// 排行榜项目类型
interface RankingItem {
	id: string;
	name: string;
	image: string;
	price: number;
	rarity: string;
	collection: string;
	change: number;
	volume?: number;
	marketCap?: number;
}

// 最热排行榜数据
const trendingRanking: RankingItem[] = [
	{
		id: 'trending-1',
		name: 'Gold Bar NFT',
		image: '/images/token/erc-721/j (21).png',
		price: 2500,
		rarity: 'Legendary',
		collection: 'RWA Assets',
		change: 15.2,
		volume: 1250000
	},
	{
		id: 'trending-2',
		name: 'Legendary Basketball Card',
		image: '/images/token/erc-721/j (21).png',
		price: 150,
		rarity: 'Legendary',
		collection: 'Basketball Legends',
		change: 8.7,
		volume: 890000
	},
	{
		id: 'trending-3',
		name: 'Digital Masterpiece',
		image: '/images/token/erc-721/j (21).png',
		price: 1000,
		rarity: 'Legendary',
		collection: 'Digital Art',
		change: 12.4,
		volume: 750000
	},
	{
		id: 'trending-4',
		name: 'Championship Ring',
		image: '/images/token/erc-721/j (21).png',
		price: 800,
		rarity: 'Legendary',
		collection: 'Sports Memorabilia',
		change: 6.3,
		volume: 650000
	},
	{
		id: 'trending-5',
		name: 'Robot Transformer',
		image: '/images/token/erc-721/j (21).png',
		price: 180,
		rarity: 'Legendary',
		collection: 'Collectible Toys',
		change: 9.8,
		volume: 520000
	},
	{
		id: 'trending-6',
		name: 'VIP Member Pass',
		image: '/images/token/erc-721/j (21).png',
		price: 100,
		rarity: 'Epic',
		collection: 'Community Rewards',
		change: 4.2,
		volume: 380000
	},
	{
		id: 'trending-7',
		name: 'All-Star Card',
		image: '/images/token/erc-721/j (21).png',
		price: 200,
		rarity: 'Epic',
		collection: 'Basketball Legends',
		change: 7.1,
		volume: 320000
	},
	{
		id: 'trending-8',
		name: 'Real Estate Token',
		image: '/images/token/erc-721/j (21).png',
		price: 5000,
		rarity: 'Epic',
		collection: 'RWA Assets',
		change: 3.5,
		volume: 280000
	}
];

// 市值排行榜数据
const marketCapRanking: RankingItem[] = [
	{
		id: 'market-1',
		name: 'Real Estate Token',
		image: '/images/token/erc-721/j (1).png',
		price: 5000,
		rarity: 'Epic',
		collection: 'RWA Assets',
		change: 3.5,
		marketCap: 50000000
	},
	{
		id: 'market-2',
		name: 'Gold Bar NFT',
		image: '/images/token/erc-721/j (2).png',
		price: 2500,
		rarity: 'Legendary',
		collection: 'RWA Assets',
		change: 15.2,
		marketCap: 25000000
	},
	{
		id: 'market-3',
		name: 'Commercial Property Share',
		image: '/images/token/erc-721/j (3).png',
		price: 3200,
		rarity: 'Epic',
		collection: 'RWA Assets',
		change: 5.8,
		marketCap: 18000000
	},
	{
		id: 'market-4',
		name: 'Digital Masterpiece',
		image: '/images/token/erc-721/j (4).png',
		price: 1000,
		rarity: 'Legendary',
		collection: 'Digital Art',
		change: 12.4,
		marketCap: 12000000
	},
	{
		id: 'market-5',
		name: 'Diamond Certificate',
		image: '/images/token/erc-721/j (5).png',
		price: 1800,
		rarity: 'Legendary',
		collection: 'RWA Assets',
		change: 8.9,
		marketCap: 9000000
	},
	{
		id: 'market-6',
		name: 'World Cup Trophy',
		image: '/images/token/erc-721/j (6).png',
		price: 1500,
		rarity: 'Legendary',
		collection: 'Sports Memorabilia',
		change: 6.7,
		marketCap: 7500000
	},
	{
		id: 'market-7',
		name: 'Olympic Medal NFT',
		image: '/images/token/erc-721/j (7).png',
		price: 1200,
		rarity: 'Legendary',
		collection: 'Sports Memorabilia',
		change: 4.3,
		marketCap: 6000000
	},
	{
		id: 'market-8',
		name: 'Luxury Watch NFT',
		image: '/images/token/erc-721/j (8).png',
		price: 2200,
		rarity: 'Epic',
		collection: 'RWA Assets',
		change: 7.2,
		marketCap: 4500000
	}
];

// 最新排行榜数据
const newestRanking: RankingItem[] = [
	{
		id: 'new-1',
		name: 'Genesis Collector',
		image: '/images/token/erc-721/j (9).png',
		price: 0,
		rarity: 'Legendary',
		collection: 'Community Rewards',
		change: 0,
		volume: 0
	},
	{
		id: 'new-2',
		name: 'Interactive Art Piece',
		image: '/images/token/erc-721/j (10).png',
		price: 800,
		rarity: 'Legendary',
		collection: 'Digital Art',
		change: 2.1,
		volume: 150000
	},
	{
		id: 'new-3',
		name: 'Vintage Doll House',
		image: '/images/token/erc-721/j (11).png',
		price: 200,
		rarity: 'Legendary',
		collection: 'Collectible Toys',
		change: 1.8,
		volume: 120000
	},
	{
		id: 'new-4',
		name: 'Swimming Pool NFT',
		image: '/images/token/erc-721/j (12).png',
		price: 90,
		rarity: 'Common',
		collection: 'Sports Memorabilia',
		change: 0.5,
		volume: 85000
	},
	{
		id: 'new-5',
		name: 'Calligraphy Art',
		image: '/images/token/erc-721/j (13).png',
		price: 160,
		rarity: 'Common',
		collection: 'Digital Art',
		change: 1.2,
		volume: 95000
	},
	{
		id: 'new-6',
		name: 'Beta Tester Badge',
		image: '/images/token/erc-721/j (14).png',
		price: 0,
		rarity: 'Special',
		collection: 'Community Rewards',
		change: 0,
		volume: 0
	},
	{
		id: 'new-7',
		name: 'Golf Club Set',
		image: '/images/token/erc-721/j (15).png',
		price: 300,
		rarity: 'Epic',
		collection: 'Sports Memorabilia',
		change: 3.4,
		volume: 180000
	},
	{
		id: 'new-8',
		name: 'Social Media Share',
		image: '/images/token/erc-721/j (16).png',
		price: 0,
		rarity: 'Common',
		collection: 'Community Rewards',
		change: 0,
		volume: 0
	}
];

// 交易量排行榜数据
const volumeRanking: RankingItem[] = [
	{
		id: 'volume-1',
		name: 'Gold Bar NFT',
		image: '/images/token/erc-721/j (17).png',
		price: 2500,
		rarity: 'Legendary',
		collection: 'RWA Assets',
		change: 15.2,
		volume: 1250000
	},
	{
		id: 'volume-2',
		name: 'Legendary Basketball Card',
		image: '/images/token/erc-721/j (21).png',
		price: 150,
		rarity: 'Legendary',
		collection: 'Basketball Legends',
		change: 8.7,
		volume: 890000
	},
	{
		id: 'volume-3',
		name: 'Digital Masterpiece',
		image: '/images/token/erc-721/j (21).png',
		price: 1000,
		rarity: 'Legendary',
		collection: 'Digital Art',
		change: 12.4,
		volume: 750000
	},
	{
		id: 'volume-4',
		name: 'Championship Ring',
		image: '/images/token/erc-721/j (21).png',
		price: 800,
		rarity: 'Legendary',
		collection: 'Sports Memorabilia',
		change: 6.3,
		volume: 650000
	},
	{
		id: 'volume-5',
		name: 'Robot Transformer',
		image: '/images/token/erc-721/j (21).png',
		price: 180,
		rarity: 'Legendary',
		collection: 'Collectible Toys',
		change: 9.8,
		volume: 520000
	},
	{
		id: 'volume-6',
		name: 'All-Star Card',
		image: '/images/token/erc-721/j (21).png',
		price: 200,
		rarity: 'Epic',
		collection: 'Basketball Legends',
		change: 7.1,
		volume: 420000
	},
	{
		id: 'volume-7',
		name: 'VIP Member Pass',
		image: '/images/token/erc-721/j (21).png',
		price: 100,
		rarity: 'Epic',
		collection: 'Community Rewards',
		change: 4.2,
		volume: 380000
	},
	{
		id: 'volume-8',
		name: 'Real Estate Token',
		image: '/images/token/erc-721/j (21).png',
		price: 5000,
		rarity: 'Epic',
		collection: 'RWA Assets',
		change: 3.5,
		volume: 320000
	}
];

// 价格排行榜数据
const priceRanking: RankingItem[] = [
	{
		id: 'price-1',
		name: 'Real Estate Token',
		image: '/images/token/erc-721/1.png',
		price: 5000,
		rarity: 'Epic',
		collection: 'RWA Assets',
		change: 3.5,
		volume: 320000
	},
	{
		id: 'price-2',
		name: 'Commercial Property Share',
		image: '/images/token/erc-721/2.png',
		price: 3200,
		rarity: 'Epic',
		collection: 'RWA Assets',
		change: 5.8,
		volume: 280000
	},
	{
		id: 'price-3',
		name: 'Gold Bar NFT',
		image: '/images/token/erc-721/3.png',
		price: 2500,
		rarity: 'Legendary',
		collection: 'RWA Assets',
		change: 15.2,
		volume: 1250000
	},
	{
		id: 'price-4',
		name: 'Luxury Watch NFT',
		image: '/images/token/erc-721/4.png',
		price: 2200,
		rarity: 'Epic',
		collection: 'RWA Assets',
		change: 7.2,
		volume: 180000
	},
	{
		id: 'price-5',
		name: 'Diamond Certificate',
		image: '/images/token/erc-721/5.png',
		price: 1800,
		rarity: 'Legendary',
		collection: 'RWA Assets',
		change: 8.9,
		volume: 250000
	},
	{
		id: 'price-6',
		name: 'World Cup Trophy',
		image: '/images/token/erc-721/6.png',
		price: 1500,
		rarity: 'Legendary',
		collection: 'Sports Memorabilia',
		change: 6.7,
		volume: 200000
	},
	{
		id: 'price-7',
		name: 'Olympic Medal NFT',
		image: '/images/token/erc-721/1.png',
		price: 1200,
		rarity: 'Legendary',
		collection: 'Sports Memorabilia',
		change: 4.3,
		volume: 150000
	},
	{
		id: 'price-8',
		name: 'Digital Masterpiece',
		image: '/images/token/erc-721/2.png',
		price: 1000,
		rarity: 'Legendary',
		collection: 'Digital Art',
		change: 12.4,
		volume: 750000
	}
];

// 稀有度排行榜数据
const rarityRanking: RankingItem[] = [
	{
		id: 'rarity-1',
		name: 'Gold Bar NFT',
		image: '/images/token/erc-721/1.png',
		price: 2500,
		rarity: 'Legendary',
		collection: 'RWA Assets',
		change: 15.2,
		volume: 1250000
	},
	{
		id: 'rarity-2',
		name: 'Legendary Basketball Card',
		image: '/images/token/erc-721/2.png',
		price: 150,
		rarity: 'Legendary',
		collection: 'Basketball Legends',
		change: 8.7,
		volume: 890000
	},
	{
		id: 'rarity-3',
		name: 'Digital Masterpiece',
		image: '/images/token/erc-721/3.png',
		price: 1000,
		rarity: 'Legendary',
		collection: 'Digital Art',
		change: 12.4,
		volume: 750000
	},
	{
		id: 'rarity-4',
		name: 'Championship Ring',
		image: '/images/token/erc-721/4.png',
		price: 800,
		rarity: 'Legendary',
		collection: 'Sports Memorabilia',
		change: 6.3,
		volume: 650000
	},
	{
		id: 'rarity-5',
		name: 'Robot Transformer',
		image: '/images/token/erc-721/5.png',
		price: 180,
		rarity: 'Legendary',
		collection: 'Collectible Toys',
		change: 9.8,
		volume: 520000
	},
	{
		id: 'rarity-6',
		name: 'Diamond Certificate',
		image: '/images/token/erc-721/6.png',
		price: 1800,
		rarity: 'Legendary',
		collection: 'RWA Assets',
		change: 8.9,
		volume: 250000
	},
	{
		id: 'rarity-7',
		name: 'World Cup Trophy',
		image: '/images/token/erc-721/1.png',
		price: 1500,
		rarity: 'Legendary',
		collection: 'Sports Memorabilia',
		change: 6.7,
		volume: 200000
	},
	{
		id: 'rarity-8',
		name: 'Olympic Medal NFT',
		image: '/images/token/erc-721/2.png',
		price: 1200,
		rarity: 'Legendary',
		collection: 'Sports Memorabilia',
		change: 4.3,
		volume: 150000
	}
];
