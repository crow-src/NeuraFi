'use client';
import {useMemo, useState} from 'react';
import {Card, CardBody, Chip, Button, Input, Select, SelectItem, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from '@heroui/react';
import {Icon} from '@iconify/react';

// ===== Type definitions =====
interface MarketOption {
	id: string;
	label: string;
	yesProbability: number; // 0-1 probability for “Yes”
	noProbability: number; // 0-1 probability for “No” (usually = 1 - yesProbability)
	volume?: number;
}

interface PredictionMarket {
	id: string;
	title: string;
	category: string;
	type: 'binary' | 'multiple'; // binary: yes/no, multiple: several options
	options?: MarketOption[]; // used for multiple
	yesProbability?: number; // used for binary
	noProbability?: number; // used for binary
	totalVolume: number;
	status: 'active' | 'ending_soon' | 'live';
	isTrending?: boolean;
	endDate?: string;
}

// ===== Mock market data =====
const mockMarkets: PredictionMarket[] = [
	{
		id: '1',
		title: 'What day will the Government Shutdown end?',
		category: 'Politics',
		type: 'multiple',
		status: 'active',
		totalVolume: 31000000,
		options: [
			{id: 'opt1', label: 'November 13', yesProbability: 1.0, noProbability: 0.01},
			{id: 'opt2', label: 'November 14', yesProbability: 0.01, noProbability: 1.0},
			{id: 'opt3', label: 'November 15', yesProbability: 0.01, noProbability: 1.0},
			{id: 'opt4', label: 'November 16', yesProbability: 0.01, noProbability: 1.0},
			{id: 'opt5', label: 'November 17', yesProbability: 0.01, noProbability: 1.0}
		]
	},
	{
		id: '2',
		title: 'When will the Government shutdown end?',
		category: 'Politics',
		type: 'multiple',
		status: 'active',
		totalVolume: 40000000,
		options: [
			{id: 'opt1', label: 'November 12-15', yesProbability: 1.0, noProbability: 0.01},
			{id: 'opt2', label: 'November 16+', yesProbability: 0.01, noProbability: 1.0}
		]
	},
	{
		id: '3',
		title: 'Fed decision in December?',
		category: 'Finance',
		type: 'multiple',
		status: 'active',
		totalVolume: 84000000,
		options: [
			{id: 'opt1', label: '50+ bps decrease', yesProbability: 0.02, noProbability: 0.98},
			{id: 'opt2', label: '25 bps decrease', yesProbability: 0.56, noProbability: 0.44},
			{id: 'opt3', label: 'No change', yesProbability: 0.4, noProbability: 0.6},
			{id: 'opt4', label: '25+ bps increase', yesProbability: 0.01, noProbability: 0.99}
		]
	},
	{
		id: '4',
		title: 'Super Bowl Champion 2026',
		category: 'Sports',
		type: 'multiple',
		status: 'active',
		isTrending: true,
		totalVolume: 526000000,
		options: [
			{id: 'opt1', label: 'Kansas City', yesProbability: 0.13, noProbability: 0.87},
			{id: 'opt2', label: 'Los Angeles R', yesProbability: 0.11, noProbability: 0.89},
			{id: 'opt3', label: 'Philadelphia', yesProbability: 0.11, noProbability: 0.89},
			{id: 'opt4', label: 'Detroit', yesProbability: 0.1, noProbability: 0.9},
			{id: 'opt5', label: 'Buffalo', yesProbability: 0.1, noProbability: 0.9}
		]
	},
	{
		id: '5',
		title: 'House passes Epstein disclosure bill/resolution in 2025?',
		category: 'Politics',
		type: 'binary',
		yesProbability: 0.69,
		noProbability: 0.31,
		status: 'active',
		totalVolume: 135000
	},
	{
		id: '6',
		title: 'Will Trump create a tariff dividend in 2025?',
		category: 'Politics',
		type: 'binary',
		yesProbability: 0.11,
		noProbability: 0.89,
		status: 'active',
		totalVolume: 733000
	},
	{
		id: '7',
		title: 'Bitcoin above ___ on November 13?',
		category: 'Crypto',
		type: 'multiple',
		status: 'active',
		totalVolume: 3000000,
		options: [
			{id: 'opt1', label: '90,000', yesProbability: 1.0, noProbability: 0.01},
			{id: 'opt2', label: '92,000', yesProbability: 1.0, noProbability: 0.01},
			{id: 'opt3', label: '94,000', yesProbability: 1.0, noProbability: 0.01},
			{id: 'opt4', label: '96,000', yesProbability: 1.0, noProbability: 0.01},
			{id: 'opt5', label: '98,000', yesProbability: 0.99, noProbability: 0.01}
		]
	},
	{
		id: '8',
		title: 'Ethereum above ___ on November 13?',
		category: 'Crypto',
		type: 'multiple',
		status: 'ending_soon',
		totalVolume: 974000,
		options: [
			{id: 'opt1', label: '2,800', yesProbability: 1.0, noProbability: 0.01},
			{id: 'opt2', label: '2,900', yesProbability: 1.0, noProbability: 0.01},
			{id: 'opt3', label: '3,000', yesProbability: 1.0, noProbability: 0.01},
			{id: 'opt4', label: '3,100', yesProbability: 1.0, noProbability: 0.01},
			{id: 'opt5', label: '3,200', yesProbability: 0.99, noProbability: 0.01}
		]
	},
	{
		id: '9',
		title: 'Top Spotify Artist 2025',
		category: 'Pop Culture',
		type: 'multiple',
		status: 'active',
		totalVolume: 17000000,
		options: [
			{id: 'opt1', label: 'Bad Bunny', yesProbability: 0.94, noProbability: 0.06},
			{id: 'opt2', label: 'Taylor Swift', yesProbability: 0.05, noProbability: 0.95},
			{id: 'opt3', label: 'Bruno Mars', yesProbability: 0.01, noProbability: 0.99}
		]
	},
	{
		id: '10',
		title: 'Largest Company end of 2025?',
		category: 'Tech',
		type: 'multiple',
		status: 'active',
		isTrending: true,
		totalVolume: 24000000,
		options: [
			{id: 'opt1', label: 'NVIDIA', yesProbability: 0.92, noProbability: 0.08},
			{id: 'opt2', label: 'Apple', yesProbability: 0.05, noProbability: 0.95},
			{id: 'opt3', label: 'Alphabet', yesProbability: 0.01, noProbability: 0.99},
			{id: 'opt4', label: 'Microsoft', yesProbability: 0.01, noProbability: 0.99},
			{id: 'opt5', label: 'Tesla', yesProbability: 0.01, noProbability: 0.99}
		]
	},
	{
		id: '11',
		title: '2026 NBA Champion',
		category: 'Sports',
		type: 'multiple',
		status: 'active',
		totalVolume: 47000000,
		options: [
			{id: 'opt1', label: 'Oklahoma City Thunder', yesProbability: 0.33, noProbability: 0.67},
			{id: 'opt2', label: 'Denver Nuggets', yesProbability: 0.12, noProbability: 0.88},
			{id: 'opt3', label: 'Cleveland Cavaliers', yesProbability: 0.08, noProbability: 0.92},
			{id: 'opt4', label: 'Houston Rockets', yesProbability: 0.08, noProbability: 0.92},
			{id: 'opt5', label: 'New York Knicks', yesProbability: 0.07, noProbability: 0.93}
		]
	},
	{
		id: '12',
		title: 'English Premier League Winner',
		category: 'Sports',
		type: 'multiple',
		status: 'live',
		isTrending: true,
		totalVolume: 98000000,
		options: [
			{id: 'opt1', label: 'Arsenal', yesProbability: 0.54, noProbability: 0.46},
			{id: 'opt2', label: 'Man City', yesProbability: 0.3, noProbability: 0.7},
			{id: 'opt3', label: 'Liverpool', yesProbability: 0.08, noProbability: 0.92},
			{id: 'opt4', label: 'Chelsea', yesProbability: 0.04, noProbability: 0.96},
			{id: 'opt5', label: 'Man United', yesProbability: 0.02, noProbability: 0.98}
		]
	}
];

const categories = ['All', 'Politics', 'Sports', 'Crypto', 'Tech', 'Pop Culture', 'Finance', 'AI'];

const sortOptions = [
	{key: 'volume', label: '24hr Volume', icon: 'mdi:chart-bar'},
	{key: 'trending', label: 'Trending', icon: 'mdi:fire'},
	{key: 'newest', label: 'New', icon: 'mdi:clock'},
	{key: 'ending', label: 'Ending Soon', icon: 'mdi:clock-alert'}
];

// ===== Main component =====
export function PredictView() {
	const [selectedCategory, setSelectedCategory] = useState('All');
	const [sortBy, setSortBy] = useState('volume');
	const [searchQuery, setSearchQuery] = useState('');

	// Filter + sort markets
	const filteredMarkets = useMemo(() => {
		let filtered = mockMarkets;

		// category filter
		if (selectedCategory !== 'All') {
			filtered = filtered.filter(market => market.category === selectedCategory);
		}

		// search filter
		if (searchQuery) {
			filtered = filtered.filter(market => market.title.toLowerCase().includes(searchQuery.toLowerCase()));
		}

		// sorting
		filtered = [...filtered].sort((a, b) => {
			switch (sortBy) {
				case 'volume':
					return b.totalVolume - a.totalVolume;
				case 'trending':
					if (a.isTrending && !b.isTrending) return -1;
					if (!a.isTrending && b.isTrending) return 1;
					return b.totalVolume - a.totalVolume;
				case 'newest':
					return b.id.localeCompare(a.id);
				case 'ending':
					if (a.status === 'ending_soon' && b.status !== 'ending_soon') return -1;
					if (a.status !== 'ending_soon' && b.status === 'ending_soon') return 1;
					return b.totalVolume - a.totalVolume;
				default:
					return 0;
			}
		});

		return filtered;
	}, [selectedCategory, sortBy, searchQuery]);

	return (
		<div className='h-full w-full flex flex-col p-6 pt-0 overflow-y-auto custom-scrollbar'>
			{/* Filter header */}
			<Card>
				<CardBody>
					<div className='flex flex-col md:flex-row gap-4 items-center justify-between'>
						{/* Header */}
						<div className='shrink-0 flex flex-col gap-1'>
							<h1 className='text-xl font-bold text-primary-foreground'>Prediction Markets</h1>
							<p className='text-primary-foreground text-xs hidden md:block'>Join prediction markets and trade on future outcomes</p>
						</div>
						{/* Filters - desktop layout */}
						<div className='hidden md:flex gap-2 items-center flex-1 justify-end'>
							<Input placeholder='Search markets...' value={searchQuery} onValueChange={setSearchQuery} startContent={<Icon icon='mdi:magnify' className='w-4 h-4 text-default-400' />} className='max-w-md' size='sm' />
							<Select selectedKeys={[selectedCategory]} onSelectionChange={keys => setSelectedCategory(Array.from(keys)[0] as string)} className='w-32' size='sm'>
								{categories.map(category => (
									<SelectItem key={category}>{category === 'All' ? 'All categories' : category}</SelectItem>
								))}
							</Select>
							{sortOptions.map(option => (
								<Button key={option.key} variant={sortBy === option.key ? 'solid' : 'bordered'} size='sm' onPress={() => setSortBy(option.key)} startContent={<Icon icon={option.icon} className='w-4 h-4' />}>
									{option.label}
								</Button>
							))}
						</div>
						{/* Filters - mobile layout */}
						<div className='md:hidden w-full flex gap-2 items-center'>
							<Input placeholder='Search...' value={searchQuery} onValueChange={setSearchQuery} startContent={<Icon icon='mdi:magnify' className='w-4 h-4 text-default-400' />} className='flex-1' size='sm' />
							<Dropdown>
								<DropdownTrigger>
									<Button isIconOnly variant='flat' size='sm'>
										<Icon icon='mdi:tag' className='w-5 h-5' />
									</Button>
								</DropdownTrigger>
								<DropdownMenu aria-label='Category filter' selectedKeys={[selectedCategory]} onSelectionChange={keys => setSelectedCategory(Array.from(keys)[0] as string)} selectionMode='single' disallowEmptySelection>
									{categories.map(category => (
										<DropdownItem key={category} textValue={category}>
											{category === 'All' ? 'All categories' : category}
										</DropdownItem>
									))}
								</DropdownMenu>
							</Dropdown>
							<Dropdown>
								<DropdownTrigger>
									<Button isIconOnly variant='flat' size='sm'>
										<Icon icon='mdi:sort' className='w-5 h-5' />
									</Button>
								</DropdownTrigger>
								<DropdownMenu aria-label='Sort options' selectedKeys={[sortBy]} onSelectionChange={keys => setSortBy(Array.from(keys)[0] as string)} selectionMode='single' disallowEmptySelection>
									{sortOptions.map(option => (
										<DropdownItem key={option.key} startContent={<Icon icon={option.icon} className='w-4 h-4' />} textValue={option.label}>
											{option.label}
										</DropdownItem>
									))}
								</DropdownMenu>
							</Dropdown>
						</div>
					</div>
				</CardBody>
			</Card>

			{/* Market list */}
			<div className='w-full py-4'>
				{filteredMarkets.length > 0 ? (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
						{filteredMarkets.map(market => (
							<MarketCard key={market.id} market={market} />
						))}
					</div>
				) : (
					<div className='flex flex-col items-center justify-center py-16 text-center'>
						<Icon icon='mdi:chart-line-variant' className='w-16 h-16 text-default-300 mb-4' />
						<h3 className='text-lg font-semibold text-default-600 mb-2'>No markets found</h3>
						<p className='text-sm text-default-400'>Try adjusting your filters</p>
					</div>
				)}
			</div>
		</div>
	);
}

// ===== Market card =====
interface MarketCardProps {
	market: PredictionMarket;
}

function MarketCard({market}: MarketCardProps) {
	const formatVolume = (volume: number) => {
		if (volume >= 1000000) {
			return `$${(volume / 1000000).toFixed(0)}m`;
		}
		if (volume >= 1000) {
			return `$${(volume / 1000).toFixed(0)}k`;
		}
		return `$${volume}`;
	};

	const formatProbability = (prob: number) => {
		const percent = prob * 100;
		if (percent >= 99.5) return '100%';
		if (percent < 0.5) return '<1%';
		return `${percent.toFixed(0)}%`;
	};

	return (
		<Card className='hover:shadow-lg transition-all border border-primary-border bg-content1'>
			<CardBody className='p-4 space-y-3'>
				{/* Title */}
				<h3 className='text-sm font-semibold text-primary-foreground leading-tight line-clamp-2'>{market.title}</h3>

				{/* Binary market */}
				{market.type === 'binary' && market.yesProbability !== undefined && (
					<div className='space-y-3'>
						{/* Circular indicator */}
						<div className='flex justify-center'>
							<div className='relative w-20 h-20'>
								<svg className='w-20 h-20 transform -rotate-90'>
									<circle cx='40' cy='40' r='36' stroke='currentColor' strokeWidth='6' fill='none' className='text-default-200' />
									<circle cx='40' cy='40' r='36' stroke='currentColor' strokeWidth='6' fill='none' strokeDasharray={`${2 * Math.PI * 36}`} strokeDashoffset={`${2 * Math.PI * 36 * (1 - market.yesProbability)}`} className='text-success transition-all' strokeLinecap='round' />
								</svg>
								<div className='absolute inset-0 flex items-center justify-center'>
									<span className='text-lg font-bold text-primary-foreground'>{formatProbability(market.yesProbability)}</span>
								</div>
							</div>
						</div>
						<div className='text-center text-xs text-primary-foreground mb-2'>chance</div>
						{/* Yes/No actions */}
						<div className='flex gap-2'>
							<Button size='sm' color='success' className='flex-1 font-semibold' variant='solid'>
								Yes
							</Button>
							<Button size='sm' color='danger' className='flex-1 font-semibold' variant='solid'>
								No
							</Button>
						</div>
					</div>
				)}

				{/* Multiple-choice market */}
				{market.type === 'multiple' && market.options && (
					<div className='space-y-2'>
						{market.options.map(option => (
							<OptionRow key={option.id} option={option} />
						))}
					</div>
				)}

				{/* Footer: volume + meta */}
				<div className='flex items-center justify-between pt-2 border-t border-primary-border'>
					<span className='text-xs text-primary-foreground font-medium'>{formatVolume(market.totalVolume)} Vol.</span>
					<div className='flex items-center gap-2'>
						{market.status === 'live' && (
							<Chip size='sm' color='danger' variant='flat' className='h-5 text-xs'>
								Live
							</Chip>
						)}
						{market.isTrending && <Icon icon='mdi:fire' className='w-4 h-4 text-warning' />}
						<button className='p-1 hover:bg-default-100 rounded transition-colors'>
							<Icon icon='mdi:gift-outline' className='w-4 h-4 text-default-400' />
						</button>
						<button className='p-1 hover:bg-default-100 rounded transition-colors'>
							<Icon icon='mdi:bookmark-outline' className='w-4 h-4 text-default-400' />
						</button>
					</div>
				</div>
			</CardBody>
		</Card>
	);
}

// ===== Option row =====
interface OptionRowProps {
	option: MarketOption;
}

function OptionRow({option}: OptionRowProps) {
	const formatProbability = (prob: number) => {
		const percent = prob * 100;
		if (percent >= 99.5) return '100%';
		if (percent < 0.5) return '<1%';
		return `${percent.toFixed(0)}%`;
	};

	return (
		<div className='flex items-center justify-between gap-2'>
			<span className='text-xs font-medium text-primary-foreground flex-1 truncate'>{option.label}</span>
			<div className='flex gap-1 shrink-0'>
				<Button size='sm' color='success' variant='flat' className='min-w-[60px] h-7 text-xs font-semibold px-2' style={{backgroundColor: 'rgba(34, 197, 94, 0.1)'}}>
					Yes {formatProbability(option.yesProbability)}
				</Button>
				<Button size='sm' color='danger' variant='flat' className='min-w-[60px] h-7 text-xs font-semibold px-2' style={{backgroundColor: 'rgba(239, 68, 68, 0.1)'}}>
					No {formatProbability(option.noProbability)}
				</Button>
			</div>
		</div>
	);
}
