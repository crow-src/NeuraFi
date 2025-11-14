import {NFT} from '../components';
import {type PredictionMarket} from '../components';

type BlindBoxType = 'rwa' | 'cards' | 'toys' | 'sports' | 'art' | 'welfare';

const DESCRIPTION_BY_TYPE: Record<BlindBoxType, string> = {
	rwa: 'Tokenized real-world asset backed by audited custody and redeemable utility.',
	cards: 'Basketball highlight card capturing heroic plays with animated stats for collectors.',
	toys: 'Digital collectible toy crafted for metaverse showcases and AR-ready storytelling.',
	sports: 'Sports memorabilia NFT preserving iconic competitive moments with immutable proof.',
	art: 'Curated digital artwork featuring gallery-grade visuals and on-chain provenance.',
	welfare: 'Community welfare reward that thanks loyal supporters with exclusive platform perks.'
};

export const rawBlindBoxItems: NFT[] = [
	{
		id: 'rwa-1',
		type: 'rwa',
		name: 'Gold Bar NFT',
		image: '/images/token/erc-721/f (1).png',
		price: 2500,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.rwa,
		rarity: 'Legendary',
		collection: 'RWA Assets'
	},
	{
		id: 'rwa-2',
		type: 'rwa',
		name: 'Real Estate Token',
		image: '/images/token/erc-721/f (2).png',
		price: 5000,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.rwa,
		rarity: 'Epic',
		collection: 'RWA Assets'
	},
	{
		id: 'rwa-3',
		type: 'rwa',
		name: 'Art Collection Share',
		image: '/images/token/erc-721/f (3).png',
		price: 1200,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.rwa,
		rarity: 'Rare',
		collection: 'RWA Assets'
	},
	{
		id: 'rwa-4',
		type: 'rwa',
		name: 'Silver Coin NFT',
		image: '/images/token/erc-721/f (4).png',
		price: 800,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.rwa,
		rarity: 'Rare',
		collection: 'RWA Assets'
	},
	{
		id: 'rwa-5',
		type: 'rwa',
		name: 'Commercial Property Share',
		image: '/images/token/erc-721/f (5).png',
		price: 3200,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.rwa,
		rarity: 'Epic',
		collection: 'RWA Assets'
	},
	{
		id: 'rwa-6',
		type: 'rwa',
		name: 'Diamond Certificate',
		image: '/images/token/erc-721/f (6).png',
		price: 1800,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.rwa,
		rarity: 'Legendary',
		collection: 'RWA Assets'
	},
	{
		id: 'rwa-7',
		type: 'rwa',
		name: 'Vintage Wine Token',
		image: '/images/token/erc-721/f (7).png',
		price: 950,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.rwa,
		rarity: 'Rare',
		collection: 'RWA Assets'
	},
	{
		id: 'rwa-8',
		type: 'rwa',
		name: 'Luxury Watch NFT',
		image: '/images/token/erc-721/f (8).png',
		price: 2200,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.rwa,
		rarity: 'Epic',
		collection: 'RWA Assets'
	},

	{
		id: 'card-1',
		type: 'cards',
		name: 'All-Star Card',
		image: '/images/token/erc-721/b (1).png',
		price: 200,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.cards,
		rarity: 'Epic',
		collection: 'Basketball Legends'
	},
	{
		id: 'card-2',
		type: 'cards',
		name: 'Championship Card',
		image: '/images/token/erc-721/b (2).png',
		price: 300,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.cards,
		rarity: 'Legendary',
		collection: 'Basketball Legends'
	},
	{
		id: 'card-3',
		type: 'cards',
		name: 'MVP Season Card',
		image: '/images/token/erc-721/b (3).png',
		price: 180,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.cards,
		rarity: 'Epic',
		collection: 'Basketball Legends'
	},
	{
		id: 'card-4',
		type: 'cards',
		name: 'Hall of Fame Card',
		image: '/images/token/erc-721/b (4).png',
		price: 400,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.cards,
		rarity: 'Legendary',
		collection: 'Basketball Legends'
	},
	{
		id: 'card-5',
		type: 'cards',
		name: 'Team Jersey Card',
		image: '/images/token/erc-721/b (5).png',
		price: 75,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.cards,
		rarity: 'Rare',
		collection: 'Basketball Legends'
	},
	{
		id: 'card-6',
		type: 'cards',
		name: 'Draft Pick Card',
		image: '/images/token/erc-721/b (6).png',
		price: 60,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.cards,
		rarity: 'Common',
		collection: 'Basketball Legends'
	},
	{
		id: 'card-7',
		type: 'cards',
		name: 'Retro Vintage Card',
		image: '/images/token/erc-721/b (7).png',
		price: 120,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.cards,
		rarity: 'Rare',
		collection: 'Basketball Legends'
	},
	{
		id: 'card-8',
		type: 'cards',
		name: 'Game Winner Card',
		image: '/images/token/erc-721/b (8).png',
		price: 250,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.cards,
		rarity: 'Epic',
		collection: 'Basketball Legends'
	},
	{
		id: 'card-9',
		type: 'cards',
		name: 'Game Winner Card',
		image: '/images/token/erc-721/b (9).png',
		price: 250,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.cards,
		rarity: 'Epic',
		collection: 'Basketball Legends'
	},
	{
		id: 'card-10',
		type: 'cards',
		name: 'Game Winner Card',
		image: '/images/token/erc-721/b (10).png',
		price: 250,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.cards,
		rarity: 'Epic',
		collection: 'Basketball Legends'
	},

	{
		id: 'toy-1',
		type: 'toys',
		name: 'Vintage Action Figure',
		image: '/images/token/erc-721/1.png',
		price: 120,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.toys,
		rarity: 'Epic',
		collection: 'Collectible Toys'
	},
	{
		id: 'toy-2',
		type: 'toys',
		name: 'Superhero Collectible',
		image: '/images/token/erc-721/2.png',
		price: 95,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.toys,
		rarity: 'Rare',
		collection: 'Collectible Toys'
	},
	{
		id: 'toy-3',
		type: 'toys',
		name: 'Miniature Model Kit',
		image: '/images/token/erc-721/3.png',
		price: 35,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.toys,
		rarity: 'Common',
		collection: 'Collectible Toys'
	},
	{
		id: 'toy-4',
		type: 'toys',
		name: 'Anime Character Figure',
		image: '/images/token/erc-721/4.png',
		price: 150,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.toys,
		rarity: 'Epic',
		collection: 'Collectible Toys'
	},
	{
		id: 'toy-5',
		type: 'toys',
		name: 'Robot Transformer',
		image: '/images/token/erc-721/5.png',
		price: 180,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.toys,
		rarity: 'Legendary',
		collection: 'Collectible Toys'
	},
	{
		id: 'toy-6',
		type: 'toys',
		name: 'Plush Animal',
		image: '/images/token/erc-721/6.png',
		price: 45,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.toys,
		rarity: 'Common',
		collection: 'Collectible Toys'
	},
	{
		id: 'sport-1',
		type: 'sports',
		name: 'Championship Ring',
		image: '/images/token/erc-721/f (1).png',
		price: 800,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.sports,
		rarity: 'Legendary',
		collection: 'Sports Memorabilia'
	},
	{
		id: 'sport-2',
		type: 'sports',
		name: 'Signed Jersey',
		image: '/images/token/erc-721/f (2).png',
		price: 200,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.sports,
		rarity: 'Rare',
		collection: 'Sports Memorabilia'
	},
	{
		id: 'sport-3',
		type: 'sports',
		name: 'Game Ticket NFT',
		image: '/images/token/erc-721/f (3).png',
		price: 150,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.sports,
		rarity: 'Epic',
		collection: 'Sports Memorabilia'
	},
	{
		id: 'sport-4',
		type: 'sports',
		name: 'Training Equipment',
		image: '/images/token/erc-721/f (4).png',
		price: 100,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.sports,
		rarity: 'Common',
		collection: 'Sports Memorabilia'
	},
	{
		id: 'sport-5',
		type: 'sports',
		name: 'Olympic Medal NFT',
		image: '/images/token/erc-721/f (5).png',
		price: 1200,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.sports,
		rarity: 'Legendary',
		collection: 'Sports Memorabilia'
	},
	{
		id: 'sport-6',
		type: 'sports',
		name: 'World Cup Trophy',
		image: '/images/token/erc-721/f (6).png',
		price: 1500,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.sports,
		rarity: 'Legendary',
		collection: 'Sports Memorabilia'
	},
	{
		id: 'sport-7',
		type: 'sports',
		name: 'Baseball Card Collection',
		image: '/images/token/erc-721/f (7).png',
		price: 180,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.sports,
		rarity: 'Epic',
		collection: 'Sports Memorabilia'
	},
	{
		id: 'sport-8',
		type: 'sports',
		name: 'Basketball Court NFT',
		image: '/images/token/erc-721/f (8).png',
		price: 250,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.sports,
		rarity: 'Rare',
		collection: 'Sports Memorabilia'
	},
	{
		id: 'sport-9',
		type: 'sports',
		name: 'Soccer Boot NFT',
		image: '/images/token/erc-721/f (9).png',
		price: 120,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.sports,
		rarity: 'Common',
		collection: 'Sports Memorabilia'
	},
	{
		id: 'sport-10',
		type: 'sports',
		name: 'Tennis Racket NFT',
		image: '/images/token/erc-721/f (10).png',
		price: 160,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.sports,
		rarity: 'Rare',
		collection: 'Sports Memorabilia'
	},
	{
		id: 'art-1',
		type: 'art',
		name: 'Digital Masterpiece',
		image: '/images/token/erc-721/a (1).png',
		price: 1000,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.art,
		rarity: 'Legendary',
		collection: 'Digital Art'
	},
	{
		id: 'art-2',
		type: 'art',
		name: 'Abstract Collection',
		image: '/images/token/erc-721/a (2).png',
		price: 300,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.art,
		rarity: 'Rare',
		collection: 'Digital Art'
	},
	{
		id: 'art-3',
		type: 'art',
		name: 'Pixel Art Series',
		image: '/images/token/erc-721/a (3).png',
		price: 150,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.art,
		rarity: 'Common',
		collection: 'Digital Art'
	},
	{
		id: 'art-4',
		type: 'art',
		name: 'Surrealist Dream',
		image: '/images/token/erc-721/a (4).png',
		price: 450,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.art,
		rarity: 'Epic',
		collection: 'Digital Art'
	},
	{
		id: 'art-5',
		type: 'art',
		name: 'Minimalist Geometry',
		image: '/images/token/erc-721/a (5).png',
		price: 200,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.art,
		rarity: 'Rare',
		collection: 'Digital Art'
	},
	{
		id: 'art-6',
		type: 'art',
		name: 'Cyberpunk Neon',
		image: '/images/token/erc-721/a (6).png',
		price: 350,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.art,
		rarity: 'Epic',
		collection: 'Digital Art'
	},
	{
		id: 'art-7',
		type: 'art',
		name: 'Watercolor Fantasy',
		image: '/images/token/erc-721/a (7).png',
		price: 180,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.art,
		rarity: 'Common',
		collection: 'Digital Art'
	},
	{
		id: 'art-8',
		type: 'art',
		name: '3D Sculpture NFT',
		image: '/images/token/erc-721/a (8).png',
		price: 600,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.art,
		rarity: 'Legendary',
		collection: 'Digital Art'
	},
	{
		id: 'art-9',
		type: 'art',
		name: 'Vintage Poster Art',
		image: '/images/token/erc-721/a (9).png',
		price: 120,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.art,
		rarity: 'Common',
		collection: 'Digital Art'
	},
	{
		id: 'art-10',
		type: 'art',
		name: 'Interactive Art Piece',
		image: '/images/token/erc-721/a (10).png',
		price: 800,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.art,
		rarity: 'Legendary',
		collection: 'Digital Art'
	},
	{
		id: 'art-11',
		type: 'art',
		name: 'Interactive Art Piece',
		image: '/images/token/erc-721/a (11).png',
		price: 800,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.art,
		rarity: 'Legendary',
		collection: 'Digital Art'
	},
	{
		id: 'art-12',
		type: 'art',
		name: 'Interactive Art Piece',
		image: '/images/token/erc-721/a (12).png',
		price: 800,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.art,
		rarity: 'Legendary',
		collection: 'Digital Art'
	},
	{
		id: 'welfare-1',
		type: 'welfare',
		name: 'Community Reward',
		image: '/images/token/erc-721/j (1).png',
		price: 50,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.welfare,
		rarity: 'Special',
		collection: 'Community Rewards'
	},
	{
		id: 'welfare-2',
		type: 'welfare',
		name: 'Early Adopter Badge',
		image: '/images/token/erc-721/j (2).png',
		price: 0,
		currency: 'FREE',
		description: DESCRIPTION_BY_TYPE.welfare,
		rarity: 'Special',
		collection: 'Community Rewards'
	},
	{
		id: 'welfare-3',
		type: 'welfare',
		name: 'Loyalty Token',
		image: '/images/token/erc-721/j (3).png',
		price: 30,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.welfare,
		rarity: 'Rare',
		collection: 'Community Rewards'
	},
	{
		id: 'welfare-4',
		type: 'welfare',
		name: 'Referral Bonus',
		image: '/images/token/erc-721/j (4).png',
		price: 20,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.welfare,
		rarity: 'Common',
		collection: 'Community Rewards'
	},
	{
		id: 'welfare-5',
		type: 'welfare',
		name: 'VIP Member Pass',
		image: '/images/token/erc-721/j (5).png',
		price: 100,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.welfare,
		rarity: 'Epic',
		collection: 'Community Rewards'
	},
	{
		id: 'welfare-6',
		type: 'welfare',
		name: 'Genesis Collector',
		image: '/images/token/erc-721/j (6).png',
		price: 0,
		currency: 'FREE',
		description: DESCRIPTION_BY_TYPE.welfare,
		rarity: 'Legendary',
		collection: 'Community Rewards'
	},
	{
		id: 'welfare-7',
		type: 'welfare',
		name: 'Trading Fee Discount',
		image: '/images/token/erc-721/j (7).png',
		price: 75,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.welfare,
		rarity: 'Rare',
		collection: 'Community Rewards'
	},
	{
		id: 'welfare-8',
		type: 'welfare',
		name: 'Platform Anniversary',
		image: '/images/token/erc-721/j (8).png',
		price: 0,
		currency: 'FREE',
		description: DESCRIPTION_BY_TYPE.welfare,
		rarity: 'Special',
		collection: 'Community Rewards'
	},
	{
		id: 'welfare-9',
		type: 'welfare',
		name: 'Event Participation',
		image: '/images/token/erc-721/j (9).png',
		price: 15,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.welfare,
		rarity: 'Common',
		collection: 'Community Rewards'
	},
	{
		id: 'welfare-10',
		type: 'welfare',
		name: 'Developer Support',
		image: '/images/token/erc-721/j (10).png',
		price: 40,
		currency: 'USD',
		description: DESCRIPTION_BY_TYPE.welfare,
		rarity: 'Rare',
		collection: 'Community Rewards'
	},
	{
		id: 'welfare-11',
		type: 'welfare',
		name: 'Social Media Share',
		image: '/images/token/erc-721/j (11).png',
		price: 0,
		currency: 'FREE',
		description: DESCRIPTION_BY_TYPE.welfare,
		rarity: 'Common',
		collection: 'Community Rewards'
	},
	{
		id: 'welfare-12',
		type: 'welfare',
		name: 'Beta Tester Badge',
		image: '/images/token/erc-721/j (12).png',
		price: 0,
		currency: 'FREE',
		description: DESCRIPTION_BY_TYPE.welfare,
		rarity: 'Special',
		collection: 'Community Rewards'
	}
];

export const blindBoxItems: NFT[] = rawBlindBoxItems.map(item => ({
	...item,
	status: item.status ?? 'mint'
}));

// ===== Swap Data =====
export type SwapToken = {
	symbol: string;
	name: string;
	icon: string;
	price: number;
	balance: string;
};

export type SwapPair = {
	id: string;
	baseSymbol: string;
	quoteSymbol: string;
	price: number;
	changePct: number;
	volume: string;
};

export const swapTokens: SwapToken[] = [
	{symbol: 'ETH', name: 'Ethereum', icon: '/tokens/eth.png', price: 3000, balance: '5.75'},
	{symbol: 'USDC', name: 'USD Coin', icon: '/tokens/usdc.png', price: 1, balance: '1500.00'},
	{symbol: 'USDT', name: 'Tether', icon: '/tokens/usdt.png', price: 1, balance: '2000.00'},
	{symbol: 'UNI', name: 'Uniswap', icon: '/tokens/uni.png', price: 8, balance: '100.00'},
	{symbol: 'LINK', name: 'Chainlink', icon: '/tokens/link.png', price: 15, balance: '200.00'},
	{symbol: 'AAVE', name: 'Aave', icon: '/tokens/aave.png', price: 120, balance: '50.00'}
];

export const swapPairs: SwapPair[] = [
	{id: 'eth-usdc', baseSymbol: 'ETH', quoteSymbol: 'USDC', price: 3025.5, changePct: 0.024, volume: '145.2K'},
	{id: 'eth-usdt', baseSymbol: 'ETH', quoteSymbol: 'USDT', price: 3024.8, changePct: -0.011, volume: '98.4K'},
	{id: 'uni-usdc', baseSymbol: 'UNI', quoteSymbol: 'USDC', price: 7.92, changePct: 0.032, volume: '12.7K'},
	{id: 'link-usdc', baseSymbol: 'LINK', quoteSymbol: 'USDC', price: 15.43, changePct: -0.008, volume: '8.3K'},
	{id: 'aave-usdc', baseSymbol: 'AAVE', quoteSymbol: 'USDC', price: 118.6, changePct: 0.015, volume: '6.1K'}
];

// 热门预测市场数据
export const hotPredictionMarkets: PredictionMarket[] = [
	{
		id: '4',
		title: 'Super Bowl Champion 2026',
		category: 'Sports',
		type: 'multiple',
		status: 'active',
		isTrending: true,
		totalVolume: 526000000,
		options: [
			{id: 'opt1', label: 'Kansas City', yesProbability: 0.33, noProbability: 0.67},
			{id: 'opt2', label: 'Los Angeles R', yesProbability: 0.11, noProbability: 0.89},
			{id: 'opt3', label: 'Philadelphia', yesProbability: 0.11, noProbability: 0.89},
			{id: 'opt4', label: 'Detroit', yesProbability: 0.1, noProbability: 0.9},
			{id: 'opt5', label: 'Buffalo', yesProbability: 0.1, noProbability: 0.9}
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
		id: '6',
		title: 'Will Trump create a tariff dividend in 2025?',
		category: 'Politics',
		type: 'binary',
		yesProbability: 0.11,
		noProbability: 0.89,
		status: 'active',
		totalVolume: 733000
	}
];
