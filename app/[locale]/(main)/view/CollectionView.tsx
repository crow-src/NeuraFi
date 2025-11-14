'use client';

import {useState, useCallback, useMemo} from 'react';
import {Tabs, Tab, Chip, Avatar, Card, CardBody, CardHeader, Button, Input, Badge, Progress} from '@heroui/react';
import {Icon} from '@iconify/react';
import {TabsClass} from '@/components/class';

// ===== Collection view =====

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

	// filter collections by tab
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

	// search + sort
	const filteredCollections = useMemo(() => {
		let filtered = currentCollections;

		// search filter
		if (searchQuery) {
			filtered = filtered.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase()) || item.category.toLowerCase().includes(searchQuery.toLowerCase()));
		}

		// sorting rules
		switch (sortBy) {
			case 'recent':
				return filtered.sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime());
			case 'name':
				return filtered.sort((a, b) => a.name.localeCompare(b.name));
			case 'progress':
				return filtered.sort((a, b) => (b.progress ?? 0) - (a.progress ?? 0));
			case 'price':
				return filtered.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
			default:
				return filtered;
		}
	}, [currentCollections, searchQuery, sortBy]);

	return (
		<div className='h-full w-full flex flex-col p-6 overflow-y-auto'>
			{/* Header */}
			<div className='mb-6'>
				<h1 className='text-3xl font-bold text-primary-foreground mb-2'>My Collections</h1>
				<p className='text-primary-foreground'>Manage the blind box and prediction projects you follow</p>
			</div>

			{/* Search + sorting */}
			<Card className='mb-6'>
				<CardBody>
					<div className='flex flex-col md:flex-row gap-4'>
						<div className='flex-1'>
							<Input placeholder='Search by name, description or category...' value={searchQuery} onChange={e => handleSearch(e.target.value)} startContent={<Icon icon='mdi:magnify' className='w-4 h-4 text-default-400' />} className='max-w-md' />
						</div>
						<div className='flex gap-2'>
							<Button variant={sortBy === 'recent' ? 'solid' : 'bordered'} size='sm' onPress={() => handleSortChange('recent')} startContent={<Icon icon='mdi:clock' className='w-4 h-4' />}>
								Recently added
							</Button>
							<Button variant={sortBy === 'name' ? 'solid' : 'bordered'} size='sm' onPress={() => handleSortChange('name')} startContent={<Icon icon='mdi:sort-alphabetical' className='w-4 h-4' />}>
								Name
							</Button>
							<Button variant={sortBy === 'progress' ? 'solid' : 'bordered'} size='sm' onPress={() => handleSortChange('progress')} startContent={<Icon icon='mdi:chart-line' className='w-4 h-4' />}>
								Progress
							</Button>
							<Button variant={sortBy === 'price' ? 'solid' : 'bordered'} size='sm' onPress={() => handleSortChange('price')} startContent={<Icon icon='mdi:currency-usd' className='w-4 h-4' />}>
								Price
							</Button>
						</div>
					</div>
				</CardBody>
			</Card>

			{/* Tabs */}
			<div className='w-full mb-6'>
				<Tabs selectedKey={selectedTab} onSelectionChange={handleTabChange} variant='underlined' classNames={TabsClass}>
					<Tab key='all' title='All'>
						<div className='flex flex-col gap-4 py-4'>
							<div className='flex items-center justify-between'>
								<h3 className='text-lg font-semibold'>All favorites</h3>
								<Badge content={filteredCollections.length} color='primary'>
									<span className='text-sm text-primary-foreground'>{filteredCollections.length} items</span>
								</Badge>
							</div>
							<CollectionGrid collections={filteredCollections} />
						</div>
					</Tab>
					<Tab key='active' title='Active'>
						<div className='flex flex-col gap-4 py-4'>
							<div className='flex items-center justify-between'>
								<h3 className='text-lg font-semibold'>In progress</h3>
								<Badge content={filteredCollections.length} color='success'>
									<span className='text-sm text-primary-foreground'>{filteredCollections.length} items</span>
								</Badge>
							</div>
							<CollectionGrid collections={filteredCollections} />
						</div>
					</Tab>
					<Tab key='completed' title='Completed'>
						<div className='flex flex-col gap-4 py-4'>
							<div className='flex items-center justify-between'>
								<h3 className='text-lg font-semibold'>Completed projects</h3>
								<Badge content={filteredCollections.length} color='default'>
									<span className='text-sm text-primary-foreground'>{filteredCollections.length} items</span>
								</Badge>
							</div>
							<CollectionGrid collections={filteredCollections} />
						</div>
					</Tab>
					<Tab key='upcoming' title='Upcoming'>
						<div className='flex flex-col gap-4 py-4'>
							<div className='flex items-center justify-between'>
								<h3 className='text-lg font-semibold'>Upcoming projects</h3>
								<Badge content={filteredCollections.length} color='warning'>
									<span className='text-sm text-primary-foreground'>{filteredCollections.length} items</span>
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

// grid renderer
function CollectionGrid({collections}: {collections: CollectionItem[]}) {
	if (collections.length === 0) {
		return (
			<Card className='bg-default-50 border-primary-border'>
				<CardBody className='text-center py-12'>
					<Icon icon='mdi:heart-outline' className='w-16 h-16 text-default-400 mx-auto mb-4' />
					<h3 className='text-lg font-semibold text-default-600 mb-2'>No favorites yet</h3>
					<p className='text-primary-foreground'>Start bookmarking the projects you love.</p>
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

// collection card
function CollectionCard({item}: {item: CollectionItem}) {
	const [isFavorited, setIsFavorited] = useState(true);

	const handleToggleFavorite = () => {
		setIsFavorited(!isFavorited);
		// TODO integrate favorite mutation
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
				return 'Active';
			case 'completed':
				return 'Completed';
			case 'upcoming':
				return 'Upcoming';
			default:
				return 'Unknown';
		}
	};

	const isBlindBox = item.type === 'blindbox';

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

				{isBlindBox ? <BlindBoxDetails item={item} /> : <PredictionDetails item={item} />}

				<div className='flex gap-2'>
					<Button color='primary' variant='flat' size='sm' className='flex-1' startContent={<Icon icon='mdi:eye' className='w-4 h-4' />}>
						View details
					</Button>
					<Button variant='bordered' size='sm' startContent={<Icon icon='mdi:share' className='w-4 h-4' />}>
						Share
					</Button>
				</div>
			</CardBody>
		</Card>
	);
}

function BlindBoxDetails({item}: {item: CollectionItem}) {
	return (
		<>
			<div className='mb-4'>
				<div className='flex justify-between text-sm mb-2'>
					<span className='text-default-600'>Funding progress</span>
					<span className='font-medium'>{item.progress ?? 0}%</span>
				</div>
				<Progress value={item.progress ?? 0} color='primary' className='w-full' />
				<div className='flex justify-between text-xs text-primary-foreground mt-1'>
					<span>Raised: ${item.raisedAmount?.toLocaleString()}</span>
					<span>Target: ${item.targetAmount?.toLocaleString()}</span>
				</div>
			</div>

			<div className='space-y-2 mb-4'>
				<div className='flex justify-between text-sm'>
					<span className='text-default-600'>Box price:</span>
					<span className='font-medium'>${item.price}</span>
				</div>
				<div className='flex justify-between text-sm'>
					<span className='text-default-600'>Category:</span>
					<Chip size='sm' variant='flat'>
						{item.category}
					</Chip>
				</div>
				<div className='flex justify-between text-sm'>
					<span className='text-default-600'>Favorited on:</span>
					<span className='text-primary-foreground'>{new Date(item.addedDate).toLocaleDateString()}</span>
				</div>
			</div>
		</>
	);
}

function PredictionDetails({item}: {item: CollectionItem}) {
	return (
		<div className='space-y-3 mb-4'>
			<div className='flex items-center gap-2 text-xs text-default-600'>
				<Chip size='sm' variant='flat' startContent={<Icon icon='mdi:poll' className='w-3 h-3' />}>
					{item.marketCategory ?? item.category}
				</Chip>
				<Chip size='sm' color='secondary' variant='flat'>
					{item.marketType === 'binary' ? 'Binary' : 'Multiple choice'}
				</Chip>
			</div>
			{item.yesProbability !== undefined ? (
				<div className='flex justify-between items-center bg-default-100/60 rounded-xl p-3'>
					<div>
						<p className='text-xs text-default-500'>Yes probability</p>
						<p className='text-lg font-semibold text-primary-foreground'>{Math.round(item.yesProbability * 100)}%</p>
					</div>
					<div>
						<p className='text-xs text-default-500'>Volume (24h)</p>
						<p className='text-lg font-semibold text-primary-foreground'>${(item.totalVolume ?? 0).toLocaleString()}</p>
					</div>
				</div>
			) : null}
			{item.options && item.options.length > 0 && (
				<div className='space-y-2'>
					{item.options.slice(0, 3).map(option => (
						<div key={option.label} className='flex items-center justify-between text-xs'>
							<span className='text-default-600'>{option.label}</span>
							<span className='font-medium text-primary-foreground'>{Math.round(option.probability * 100)}%</span>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

// types
interface CollectionItem {
	id: string;
	name: string;
	description: string;
	logo: string;
	category: string;
	status: 'active' | 'completed' | 'upcoming';
	type: 'blindbox' | 'prediction';
	price?: number;
	targetAmount?: number;
	raisedAmount?: number;
	progress?: number;
	totalVolume?: number;
	yesProbability?: number;
	marketCategory?: string;
	marketType?: 'binary' | 'multiple';
	options?: {label: string; probability: number}[];
	addedDate: string;
}

// mock data
const allCollections: CollectionItem[] = [
	{
		id: 'collection-1',
		name: 'Basketball Legends',
		description: 'Limited-edition blind boxes featuring iconic basketball stars.',
		logo: '/images/token/erc-721/1.png',
		category: 'Sports',
		status: 'active',
		type: 'blindbox',
		price: 150,
		targetAmount: 1000000,
		raisedAmount: 750000,
		progress: 75,
		addedDate: '2024-01-15'
	},
	{
		id: 'collection-2',
		name: 'Digital Art Gallery',
		description: 'Digital art collectibles featuring contemporary creators.',
		logo: '/images/token/erc-721/2.png',
		category: 'Art',
		status: 'completed',
		type: 'blindbox',
		price: 200,
		targetAmount: 500000,
		raisedAmount: 500000,
		progress: 100,
		addedDate: '2024-01-10'
	},
	{
		id: 'collection-3',
		name: 'RWA Gold Tokens',
		description: 'Gold-backed blind boxes redeemable 1:1 for real bullion.',
		logo: '/images/token/erc-721/3.png',
		category: 'RWA',
		status: 'upcoming',
		type: 'blindbox',
		price: 2500,
		targetAmount: 2000000,
		raisedAmount: 0,
		progress: 0,
		addedDate: '2024-01-20'
	},
	{
		id: 'collection-4',
		name: 'Gaming Universe',
		description: 'Game-themed blind boxes covering characters, gear and virtual land.',
		logo: '/images/token/erc-721/4.png',
		category: 'Gaming',
		status: 'active',
		type: 'blindbox',
		price: 80,
		targetAmount: 800000,
		raisedAmount: 320000,
		progress: 40,
		addedDate: '2024-01-12'
	},
	{
		id: 'collection-5',
		name: 'DeFi Protocol',
		description: 'Blind boxes with DeFi protocol tokens for LP and governance.',
		logo: '/images/token/erc-721/5.png',
		category: 'DeFi',
		status: 'active',
		type: 'blindbox',
		price: 50,
		targetAmount: 1500000,
		raisedAmount: 900000,
		progress: 60,
		addedDate: '2024-01-08'
	},
	{
		id: 'collection-6',
		name: 'Vintage Cars',
		description: 'Vintage car memorabilia captured inside blind boxes.',
		logo: '/images/token/erc-721/6.png',
		category: 'Collectibles',
		status: 'completed',
		type: 'blindbox',
		price: 500,
		targetAmount: 300000,
		raisedAmount: 300000,
		progress: 100,
		addedDate: '2024-01-05'
	},
	{
		id: 'collection-7',
		name: 'Space Exploration',
		description: 'Space exploration NFTs celebrating historic missions.',
		logo: '/images/token/erc-721/1.png',
		category: 'Tech',
		status: 'upcoming',
		type: 'blindbox',
		price: 300,
		targetAmount: 1200000,
		raisedAmount: 0,
		progress: 0,
		addedDate: '2024-01-18'
	},
	{
		id: 'collection-8',
		name: 'Music Legends',
		description: 'Music legends blind boxes with albums and memorabilia.',
		logo: '/images/token/erc-721/2.png',
		category: 'Music',
		status: 'active',
		type: 'blindbox',
		price: 120,
		targetAmount: 600000,
		raisedAmount: 480000,
		progress: 80,
		addedDate: '2024-01-14'
	},
	{
		id: 'collection-9',
		name: 'Fashion Week',
		description: 'Fashion Week exclusives from top designers.',
		logo: '/images/token/erc-721/3.png',
		category: 'Fashion',
		status: 'completed',
		type: 'blindbox',
		price: 180,
		targetAmount: 400000,
		raisedAmount: 400000,
		progress: 100,
		addedDate: '2024-01-03'
	},
	{
		id: 'collection-10',
		name: 'Nature Conservation',
		description: 'Eco-friendly blind boxes funding conservation efforts.',
		logo: '/images/token/erc-721/4.png',
		category: 'Environment',
		status: 'active',
		type: 'blindbox',
		price: 100,
		targetAmount: 800000,
		raisedAmount: 240000,
		progress: 30,
		addedDate: '2024-01-16'
	},
	{
		id: 'collection-11',
		name: 'Bitcoin above 80k?',
		description: 'Prediction market on whether BTC closes above $80k this quarter.',
		logo: '/images/token/erc-721/bitcoin.png',
		category: 'Crypto',
		marketCategory: 'Crypto',
		status: 'active',
		type: 'prediction',
		marketType: 'binary',
		yesProbability: 0.62,
		totalVolume: 3200000,
		options: [
			{label: 'Yes', probability: 0.62},
			{label: 'No', probability: 0.38}
		],
		addedDate: '2024-01-13'
	},
	{
		id: 'collection-12',
		name: 'Top NBA seed 2025',
		description: 'Multi-outcome market on the regular-season #1 seed.',
		logo: '/images/token/erc-721/nba.png',
		category: 'Sports',
		marketCategory: 'Sports',
		status: 'active',
		type: 'prediction',
		marketType: 'multiple',
		totalVolume: 780000,
		options: [
			{label: 'Boston', probability: 0.34},
			{label: 'Denver', probability: 0.22},
			{label: 'Milwaukee', probability: 0.18}
		],
		addedDate: '2024-01-11'
	}
];
