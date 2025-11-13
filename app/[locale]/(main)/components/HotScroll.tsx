'use client';
import {useMemo} from 'react';
import {cn} from '@heroui/react';
import {ScrollList, type ScrollListItem} from '@/components/client';

// NFT稀有度类型
type NFTRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';

// NFT分类
type NFTCategory = 'Art' | 'Gaming' | 'Sports' | 'Music' | 'Collectibles' | 'Virtual Worlds' | 'Utility';

// 生成随机NFT数据
const generateRandomNFT = (index: number): {name: string; rarity: NFTRarity; category: NFTCategory; price: number; change24h: number} => {
	const nftNames = ['Cyberpunk Warrior', 'Digital Dream', 'Neon Genesis', 'Pixel Art Master', 'Crypto King', 'Virtual Reality', 'Blockchain Hero', 'NFT Collector', 'Digital Avatar', 'Metaverse Legend', 'Artistic Vision', 'Gaming Champion', 'Sports Icon', 'Music Maestro', 'Collectible Gem', 'Virtual Explorer', 'Crypto Artist', 'Digital Creator', 'NFT Pioneer', 'Blockchain Innovator', 'Cyber Artist', 'Digital Warrior', 'Virtual Champion', 'NFT Master', 'Crypto Visionary'];

	const categories: NFTCategory[] = ['Art', 'Gaming', 'Sports', 'Music', 'Collectibles', 'Virtual Worlds', 'Utility'];
	const rarities: NFTRarity[] = ['Common', 'Rare', 'Epic', 'Legendary'];

	const name = nftNames[index % nftNames.length];
	const rarity = rarities[Math.floor(Math.random() * rarities.length)];
	const category = categories[Math.floor(Math.random() * categories.length)];

	// 根据稀有度生成基础价格
	const basePrices: Record<NFTRarity, number> = {
		Common: 50,
		Rare: 150,
		Epic: 500,
		Legendary: 2000
	};

	const basePrice = basePrices[rarity];
	// 添加±20%的随机波动
	const variation = (Math.random() - 0.5) * 0.4;
	const price = basePrice * (1 + variation);

	// 生成24h变化率 (-25% 到 +25%)
	const change24h = (Math.random() - 0.5) * 0.5;

	return {name, rarity, category, price, change24h};
};

// 格式化价格显示
const formatPrice = (price: number): string => {
	if (price >= 1000) return `$${(price / 1000).toFixed(1)}K`;
	if (price >= 1) return `$${price.toFixed(2)}`;
	return `$${price.toFixed(4)}`;
};

// 格式化变化率显示
const formatChange = (change: number): string => {
	const sign = change >= 0 ? '+' : '';
	return `${sign}${(change * 100).toFixed(1)}%`;
};

// 获取NFT图标
const getNFTIcon = (category: NFTCategory): string => {
	const icons = {
		Art: '/images/token/erc-721/2.png',
		Gaming: '/images/token/erc-721/3.png',
		Sports: '/images/token/erc-721/1.png',
		Music: '/images/token/erc-721/6.png',
		Collectibles: '/images/token/erc-721/4.png',
		'Virtual Worlds': '/images/token/erc-721/5.png',
		Utility: '/images/token/erc-721/1.png'
	};
	return icons[category];
};

//热门NFT滚动显示
export const HotScroll = ({className}: {className?: string}) => {
	// 生成NFT数据
	const scrollListData = useMemo((): ScrollListItem[] => {
		return Array.from({length: 20}, (_, index) => {
			const {name, rarity, category, price, change24h} = generateRandomNFT(index);

			return {
				icon: getNFTIcon(category),
				name: name,
				description: `${formatPrice(price)} • ${formatChange(change24h)} • ${rarity}`
			};
		});
	}, []);

	return <ScrollList data={scrollListData} speed={40} className={cn('w-full', className)} />;
};
