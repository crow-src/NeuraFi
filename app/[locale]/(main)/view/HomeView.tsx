'use client';

import {useRouter} from 'next/navigation';
import {VideoPlayer} from '@/components/client';
import {HotNFTList, HotPredictionList, type PredictionMarket} from '../components';
import {blindBoxItems, hotPredictionMarkets} from './data_test';

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
