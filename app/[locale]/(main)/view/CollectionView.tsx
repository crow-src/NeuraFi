'use client';

import {useState, useCallback, useMemo} from 'react';
import {Tabs, Tab, Chip, Avatar, Card, CardBody, CardHeader, Button, Input, Badge, Progress} from '@heroui/react';
import {Icon} from '@iconify/react';
import {TabsClass} from '@/components/class';

// ===== 主视图 【收藏列表】=====

export function CollectionView() {
	const [selectedTab, setSelectedTab] = useState('all');
	const [searchQuery, setSearchQuery] = useState('');
	const [sortBy, setSortBy] = useState('recent');

	const handleTabChange = (key: React.Key) => {
		setSelectedTab(key as string);
	};

	const handleSearch = (value: string) => {
		setSearchQuery(value);
	};

	const handleSortChange = (key: React.Key) => {
		setSortBy(key as string);
	};

	// 获取收藏项目数据
	const getCollectionData = (category: string) => {
		switch (category) {
			case 'all':
				return allCollections;
			case 'active':
				return allCollections.filter(item => item.status === 'active');
			case 'completed':
				return allCollections.filter(item => item.status === 'completed');
			case 'upcoming':
				return allCollections.filter(item => item.status === 'upcoming');
			default:
				return allCollections;
		}
	};

	const currentCollections = getCollectionData(selectedTab);

	// 搜索和排序
	const filteredCollections = useMemo(() => {
		let filtered = currentCollections;

		// 搜索过滤
		if (searchQuery) {
			filtered = filtered.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase()) || item.category.toLowerCase().includes(searchQuery.toLowerCase()));
		}

		// 排序
		switch (sortBy) {
			case 'recent':
				return filtered.sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime());
			case 'name':
				return filtered.sort((a, b) => a.name.localeCompare(b.name));
			case 'progress':
				return filtered.sort((a, b) => b.progress - a.progress);
			case 'price':
				return filtered.sort((a, b) => b.price - a.price);
			default:
				return filtered;
		}
	}, [currentCollections, searchQuery, sortBy]);

	return (
		<div className='h-full w-full flex flex-col p-6 overflow-y-auto'>
			{/* 页面标题 */}
			<div className='mb-6'>
				<h1 className='text-3xl font-bold text-primary-foreground mb-2'>我的收藏</h1>
				<p className='text-primary-foreground'>管理您收藏的项目和投资组合</p>
			</div>

			{/* 搜索和筛选 */}
			<Card className='mb-6'>
				<CardBody>
					<div className='flex flex-col md:flex-row gap-4'>
						<div className='flex-1'>
							<Input placeholder='搜索项目名称、描述或分类...' value={searchQuery} onChange={e => handleSearch(e.target.value)} startContent={<Icon icon='mdi:magnify' className='w-4 h-4 text-default-400' />} className='max-w-md' />
						</div>
						<div className='flex gap-2'>
							<Button variant={sortBy === 'recent' ? 'solid' : 'bordered'} size='sm' onPress={() => handleSortChange('recent')} startContent={<Icon icon='mdi:clock' className='w-4 h-4' />}>
								最近添加
							</Button>
							<Button variant={sortBy === 'name' ? 'solid' : 'bordered'} size='sm' onPress={() => handleSortChange('name')} startContent={<Icon icon='mdi:sort-alphabetical' className='w-4 h-4' />}>
								按名称
							</Button>
							<Button variant={sortBy === 'progress' ? 'solid' : 'bordered'} size='sm' onPress={() => handleSortChange('progress')} startContent={<Icon icon='mdi:chart-line' className='w-4 h-4' />}>
								按进度
							</Button>
							<Button variant={sortBy === 'price' ? 'solid' : 'bordered'} size='sm' onPress={() => handleSortChange('price')} startContent={<Icon icon='mdi:currency-usd' className='w-4 h-4' />}>
								按价格
							</Button>
						</div>
					</div>
				</CardBody>
			</Card>

			{/* 分类标签页 */}
			<div className='w-full mb-6'>
				<Tabs selectedKey={selectedTab} onSelectionChange={handleTabChange} variant='underlined' classNames={TabsClass}>
					<Tab key='all' title='全部'>
						<div className='flex flex-col gap-4 py-4'>
							<div className='flex items-center justify-between'>
								<h3 className='text-lg font-semibold'>所有收藏项目</h3>
								<Badge content={filteredCollections.length} color='primary'>
									<span className='text-sm text-primary-foreground'>共 {filteredCollections.length} 个项目</span>
								</Badge>
							</div>
							<CollectionGrid collections={filteredCollections} />
						</div>
					</Tab>
					<Tab key='active' title='进行中'>
						<div className='flex flex-col gap-4 py-4'>
							<div className='flex items-center justify-between'>
								<h3 className='text-lg font-semibold'>进行中的项目</h3>
								<Badge content={filteredCollections.length} color='success'>
									<span className='text-sm text-primary-foreground'>共 {filteredCollections.length} 个项目</span>
								</Badge>
							</div>
							<CollectionGrid collections={filteredCollections} />
						</div>
					</Tab>
					<Tab key='completed' title='已完成'>
						<div className='flex flex-col gap-4 py-4'>
							<div className='flex items-center justify-between'>
								<h3 className='text-lg font-semibold'>已完成的项目</h3>
								<Badge content={filteredCollections.length} color='default'>
									<span className='text-sm text-primary-foreground'>共 {filteredCollections.length} 个项目</span>
								</Badge>
							</div>
							<CollectionGrid collections={filteredCollections} />
						</div>
					</Tab>
					<Tab key='upcoming' title='即将开始'>
						<div className='flex flex-col gap-4 py-4'>
							<div className='flex items-center justify-between'>
								<h3 className='text-lg font-semibold'>即将开始的项目</h3>
								<Badge content={filteredCollections.length} color='warning'>
									<span className='text-sm text-primary-foreground'>共 {filteredCollections.length} 个项目</span>
								</Badge>
							</div>
							<CollectionGrid collections={filteredCollections} />
						</div>
					</Tab>
				</Tabs>
			</div>
		</div>
	);
}

// 收藏项目网格组件
function CollectionGrid({collections}: {collections: CollectionItem[]}) {
	if (collections.length === 0) {
		return (
			<Card className='bg-default-50 border-primary-border'>
				<CardBody className='text-center py-12'>
					<Icon icon='mdi:heart-outline' className='w-16 h-16 text-default-400 mx-auto mb-4' />
					<h3 className='text-lg font-semibold text-default-600 mb-2'>暂无收藏项目</h3>
					<p className='text-primary-foreground'>开始收藏您感兴趣的项目吧！</p>
				</CardBody>
			</Card>
		);
	}

	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
			{collections.map(item => (
				<CollectionCard key={item.id} item={item} />
			))}
		</div>
	);
}

// 收藏项目卡片组件
function CollectionCard({item}: {item: CollectionItem}) {
	const [isFavorited, setIsFavorited] = useState(true);

	const handleToggleFavorite = () => {
		setIsFavorited(!isFavorited);
		// 这里可以添加实际的收藏/取消收藏逻辑
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'active':
				return 'success';
			case 'completed':
				return 'default';
			case 'upcoming':
				return 'warning';
			default:
				return 'default';
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'active':
				return '进行中';
			case 'completed':
				return '已完成';
			case 'upcoming':
				return '即将开始';
			default:
				return '未知';
		}
	};

	return (
		<Card className='hover:shadow-lg transition-shadow duration-300'>
			<CardHeader className='pb-2'>
				<div className='flex items-start justify-between w-full'>
					<div className='flex items-center gap-3'>
						<Avatar src={item.logo} className='w-12 h-12' fallback={<Icon icon='mdi:folder' className='w-6 h-6' />} />
						<div>
							<h4 className='font-semibold text-primary-foreground'>{item.name}</h4>
							<Chip size='sm' color={getStatusColor(item.status)} variant='flat'>
								{getStatusText(item.status)}
							</Chip>
						</div>
					</div>
					<Button isIconOnly variant='ghost' color={isFavorited ? 'danger' : 'default'} onPress={handleToggleFavorite} startContent={<Icon icon={isFavorited ? 'mdi:heart' : 'mdi:heart-outline'} className='w-5 h-5' />} />
				</div>
			</CardHeader>
			<CardBody className='pt-0'>
				<p className='text-sm text-default-600 mb-4 line-clamp-2'>{item.description}</p>

				{/* 进度条 */}
				<div className='mb-4'>
					<div className='flex justify-between text-sm mb-2'>
						<span className='text-default-600'>募资进度</span>
						<span className='font-medium'>{item.progress}%</span>
					</div>
					<Progress value={item.progress} color='primary' className='w-full' />
					<div className='flex justify-between text-xs text-primary-foreground mt-1'>
						<span>已募集: ${item.raisedAmount.toLocaleString()}</span>
						<span>目标: ${item.targetAmount.toLocaleString()}</span>
					</div>
				</div>

				{/* 项目信息 */}
				<div className='space-y-2 mb-4'>
					<div className='flex justify-between text-sm'>
						<span className='text-default-600'>盲盒价格:</span>
						<span className='font-medium'>${item.price}</span>
					</div>
					<div className='flex justify-between text-sm'>
						<span className='text-default-600'>分类:</span>
						<Chip size='sm' variant='flat'>
							{item.category}
						</Chip>
					</div>
					<div className='flex justify-between text-sm'>
						<span className='text-default-600'>收藏时间:</span>
						<span className='text-primary-foreground'>{new Date(item.addedDate).toLocaleDateString()}</span>
					</div>
				</div>

				{/* 操作按钮 */}
				<div className='flex gap-2'>
					<Button color='primary' variant='flat' size='sm' className='flex-1' startContent={<Icon icon='mdi:eye' className='w-4 h-4' />}>
						查看详情
					</Button>
					<Button variant='bordered' size='sm' startContent={<Icon icon='mdi:share' className='w-4 h-4' />}>
						分享
					</Button>
				</div>
			</CardBody>
		</Card>
	);
}

// 类型定义
interface CollectionItem {
	id: string;
	name: string;
	description: string;
	logo: string;
	category: string;
	status: 'active' | 'completed' | 'upcoming';
	price: number;
	targetAmount: number;
	raisedAmount: number;
	progress: number;
	addedDate: string;
}

// 测试数据
const allCollections: CollectionItem[] = [
	{
		id: 'collection-1',
		name: 'Basketball Legends',
		description: '经典篮球明星卡收藏，包含传奇球员的限量版卡片',
		logo: '/images/token/erc-721/1.png',
		category: '体育',
		status: 'active',
		price: 150,
		targetAmount: 1000000,
		raisedAmount: 750000,
		progress: 75,
		addedDate: '2024-01-15'
	},
	{
		id: 'collection-2',
		name: 'Digital Art Gallery',
		description: '数字艺术收藏品，展示当代艺术家的创新作品',
		logo: '/images/token/erc-721/2.png',
		category: '艺术',
		status: 'completed',
		price: 200,
		targetAmount: 500000,
		raisedAmount: 500000,
		progress: 100,
		addedDate: '2024-01-10'
	},
	{
		id: 'collection-3',
		name: 'RWA Gold Tokens',
		description: '实物黄金支持的代币，1:1对应真实黄金资产',
		logo: '/images/token/erc-721/3.png',
		category: 'RWA',
		status: 'upcoming',
		price: 2500,
		targetAmount: 2000000,
		raisedAmount: 0,
		progress: 0,
		addedDate: '2024-01-20'
	},
	{
		id: 'collection-4',
		name: 'Gaming Universe',
		description: '游戏世界NFT收藏，包含角色、装备和虚拟土地',
		logo: '/images/token/erc-721/4.png',
		category: '游戏',
		status: 'active',
		price: 80,
		targetAmount: 800000,
		raisedAmount: 320000,
		progress: 40,
		addedDate: '2024-01-12'
	},
	{
		id: 'collection-5',
		name: 'DeFi Protocol',
		description: '去中心化金融协议代币，支持流动性挖矿和治理',
		logo: '/images/token/erc-721/5.png',
		category: 'DeFi',
		status: 'active',
		price: 50,
		targetAmount: 1500000,
		raisedAmount: 900000,
		progress: 60,
		addedDate: '2024-01-08'
	},
	{
		id: 'collection-6',
		name: 'Vintage Cars',
		description: '经典汽车收藏品，包含历史悠久的跑车和概念车',
		logo: '/images/token/erc-721/6.png',
		category: '收藏品',
		status: 'completed',
		price: 500,
		targetAmount: 300000,
		raisedAmount: 300000,
		progress: 100,
		addedDate: '2024-01-05'
	},
	{
		id: 'collection-7',
		name: 'Space Exploration',
		description: '太空探索主题NFT，纪念人类航天历史的重要时刻',
		logo: '/images/token/erc-721/1.png',
		category: '科技',
		status: 'upcoming',
		price: 300,
		targetAmount: 1200000,
		raisedAmount: 0,
		progress: 0,
		addedDate: '2024-01-18'
	},
	{
		id: 'collection-8',
		name: 'Music Legends',
		description: '音乐传奇人物收藏，包含经典专辑和演唱会纪念品',
		logo: '/images/token/erc-721/2.png',
		category: '音乐',
		status: 'active',
		price: 120,
		targetAmount: 600000,
		raisedAmount: 480000,
		progress: 80,
		addedDate: '2024-01-14'
	},
	{
		id: 'collection-9',
		name: 'Fashion Week',
		description: '时尚周限定NFT，展示顶级设计师的创意作品',
		logo: '/images/token/erc-721/3.png',
		category: '时尚',
		status: 'completed',
		price: 180,
		targetAmount: 400000,
		raisedAmount: 400000,
		progress: 100,
		addedDate: '2024-01-03'
	},
	{
		id: 'collection-10',
		name: 'Nature Conservation',
		description: '自然保护主题NFT，支持环保事业和野生动物保护',
		logo: '/images/token/erc-721/4.png',
		category: '环保',
		status: 'active',
		price: 100,
		targetAmount: 800000,
		raisedAmount: 240000,
		progress: 30,
		addedDate: '2024-01-16'
	}
];
