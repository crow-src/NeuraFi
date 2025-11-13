'use client';

import {useRouter} from 'next/navigation';
import {VideoPlayer} from '@/components/client';
import {HotNFTList, HotPredictionList, type PredictionMarket} from '../components';
import {blindBoxItems} from './data_test';

// 热门预测市场数据
const hotPredictionMarkets: PredictionMarket[] = [
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

export function HomeView() {
	const router = useRouter();

	const handleViewAllPredictions = () => {
		router.push('?tab=predict');
	};

	const handleMarketClick = (market: PredictionMarket) => {
		router.push('?tab=predict');
	};

	return (
		<div className='flex flex-col gap-4 w-full bg-primary-background rounded-lg'>
			{/* Hero Section */}
			<section className='w-full h-auto sm:h-[300px] md:h-[400px] lg:h-[500px]'>
				<VideoPlayer title='Introducing Basketball Packs' description='Open a digital pack to instantly reveal a real card. Choose to hold, trade, redeem, or sell it back to us at 85% value!.' videoSrc={'/video/basketball.mp4'} posterSrc={'/images/hero-poster.jpg'} autoplay={true} muted={true} />
			</section>
			<section className='w-full'>
				<HotNFTList title='🎁 Hot Box' nfts={blindBoxItems.slice(0, 8)} onPurchase={() => {}} showViewAll />
				<HotPredictionList title='🔥 热门预测' markets={hotPredictionMarkets} showViewAll onViewAll={handleViewAllPredictions} onMarketClick={handleMarketClick} />
			</section>
		</div>
	);
}
