'use client';
import React, {useState} from 'react';
import {cn, Button, Input, Image, ScrollShadow, Avatar, Chip, Card, CardBody} from '@heroui/react';
import {Icon} from '@iconify/react';
import {useTranslations} from 'next-intl';

// NFT 数据类型
export type NFT = {
	id: string;
	type: string;
	name: string;
	image: string;
	price: number;
	currency: string; //USD
	description?: string; //描述
	rarity?: string; //稀有度
	collection?: string; //收藏
	category?: string;
	sellerName?: string;
	sellerAvatar?: string;
	listedDate?: string;
	status?: 'mint' | 'listed'; // mint: 官方盲盒购买, listed: 用户挂单
	isMyListing?: boolean;
	isMyPurchase?: boolean;
	isFavorited?: boolean;
	symbol?: string; // 行情代号
	exchange?: string; // 行情来源
	last?: number; // 行情最新价
	changePct?: number; // 行情涨跌幅（0.01 = 1%）
	quoteCategory?: QuoteCategory; // 行情分类
	group?: string; // 行情自选分组
	starred?: boolean; // 是否星标
};

type NFTCardMode = 'blindbox' | 'market';
// 基础卡片组件
interface NFTCardBaseProps {
	nft: NFT;
	mode: NFTCardMode;
	className?: string;
	noShadow?: boolean;
	isFavorited?: boolean;
	onToggleFavorite?: () => void;
	onImageClick?: () => void;
	children: React.ReactNode;
}

// 盲盒卡片组件
interface NFTCardProps {
	nft: NFT;
	className?: string;
	noShadow?: boolean;
	mode?: NFTCardMode;
	onPurchase?: (id: string, quantity: number) => void;
	onSelect?: (nft: NFT) => void;
	onEditListing?: (nft: NFT) => void;
	onCancelListing?: (nft: NFT) => void;
	onToggleFavorite?: (nft: NFT, next: boolean) => void;
}
// 稀有度颜色映射
const rarityColorMap: Record<string, 'default' | 'primary' | 'secondary' | 'warning'> = {
	Common: 'default',
	Rare: 'primary',
	Epic: 'secondary',
	Legendary: 'warning'
};
// 稀有度文本映射
const rarityTextMap: Record<string, string> = {
	Common: '普通',
	Rare: '稀有',
	Epic: '史诗',
	Legendary: '传说'
};

// ===== 行情类型与组件 =====

export type QuoteCategory = '主流' | 'DeFi' | '稳定币' | 'Layer2' | '预言机' | '扩容' | 'Meme' | 'AI' | 'GameFi';

export type QuoteItem = NFT & {
	symbol: string;
	exchange: string;
	last: number;
	changePct: number;
	quoteCategory: QuoteCategory;
};

const formatPercent = (value: number) => `${(value * 100).toFixed(2)}%`;

const NFTCardBase: React.FC<NFTCardBaseProps> = ({nft, mode, className, noShadow, isFavorited, onToggleFavorite, onImageClick, children}) => {
	const rarityColor = rarityColorMap[nft.rarity ?? ''] ?? 'default';
	const rarityText = rarityTextMap[nft.rarity ?? ''] ?? nft.rarity ?? '';
	const isMarket = mode === 'market';

	return (
		<div className={cn('flex flex-col gap-4 p-4 transition-all duration-200 rounded-lg border border-divider/30 bg-background', noShadow ? '' : 'shadow-xl hover:shadow-2xl', className)}>
			<div className={cn('relative w-full h-64 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20', onImageClick && 'cursor-pointer')} onClick={onImageClick}>
				<div className='absolute inset-0 z-0'>
					<Image src={nft.image} alt={nft.name} className='w-full h-full object-cover transition-transform duration-300 hover:scale-105' fallbackSrc='/images/nft-placeholder.png' />
				</div>

				<div className='absolute bottom-4 left-2 right-2 z-20 backdrop-blur-lg bg-black/60 px-4 py-3 flex items-center gap-2 border-t border-white/10  rounded-lg'>
					<Icon icon='token-branded:usdt' className='w-5 h-5 text-yellow-400' />
					<span className='text-lg font-bold text-white drop-shadow-lg'>
						{nft.price} {nft.currency}
					</span>
				</div>
				{/* 稀有度标签 */}
				{nft.rarity && isMarket && (
					<div className='absolute top-2 right-2 z-20'>
						<Chip size='sm' color={rarityColor} variant='flat'>
							{rarityText}
						</Chip>
					</div>
				)}
				{/* 收藏按钮 */}
				{isMarket && (
					<Button isIconOnly variant='ghost' color={isFavorited ? 'danger' : 'default'} onPress={onToggleFavorite} className='absolute top-2 left-2 z-20' size='sm'>
						<Icon icon={isFavorited ? 'mdi:heart' : 'mdi:heart-outline'} className='w-4 h-4' />
					</Button>
				)}
			</div>

			<div className='flex flex-col gap-3'>
				<div className='flex flex-col gap-1'>
					<h3 className='text-lg font-bold text-priamry-foreground truncate'>{nft.name}</h3>
					{nft.description && <p className='text-sm text-priamry-foreground/70 line-clamp-2'>{nft.description}</p>}
				</div>
				{children}
			</div>
		</div>
	);
};
// 盲盒卡片组件（Mint）
const BlindboxNFTCard: React.FC<NFTCardProps> = ({nft, className, noShadow, onPurchase}) => {
	const t = useTranslations('common');
	const [quantity, setQuantity] = useState(1);
	const totalPrice = (nft.price * quantity).toFixed(4);

	const handlePurchase = () => onPurchase?.(nft.id, quantity);
	const handleQuantityChange = (value: string) => setQuantity(Math.max(1, Math.min(100, parseInt(value) || 1)));

	return (
		<NFTCardBase nft={nft} mode='blindbox' className={className} noShadow={noShadow}>
			<div className='flex items-center gap-3 pt-2 border-t border-primary-border/30'>
				<div className='flex-1'>
					<Input
						type='number'
						value={quantity.toString()}
						onChange={e => handleQuantityChange(e.target.value)}
						min={1}
						max={100}
						size='sm'
						className='w-full'
						startContent={
							<Button isIconOnly size='sm' variant='light' onPress={() => setQuantity(Math.max(1, quantity - 1))} className='min-w-6 w-6 h-6'>
								<Icon icon='mdi:minus' className='w-3 h-3' />
							</Button>
						}
						endContent={
							<Button isIconOnly size='sm' variant='light' onPress={() => setQuantity(Math.min(100, quantity + 1))} className='min-w-6 w-6 h-6'>
								<Icon icon='mdi:plus' className='w-3 h-3' />
							</Button>
						}
					/>
				</div>

				<Button color='primary' size='sm' onPress={handlePurchase} className='flex-shrink-0 px-6' startContent={<Icon icon='mdi:shopping-cart' className='w-4 h-4' />}>
					{t('buy')}
				</Button>
			</div>

			<div className='flex justify-between items-center text-sm'>
				<span className='text-priamry-foreground/60'>{t('total_price')}</span>
				<span className='font-semibold text-primary-foreground/60'>
					{totalPrice} {nft.currency}
				</span>
			</div>
		</NFTCardBase>
	);
};

// 市场挂单卡片组件
const MarketNFTCard: React.FC<NFTCardProps> = ({nft, className, noShadow, onSelect, onEditListing, onCancelListing, onToggleFavorite}) => {
	const [isFavorited, setIsFavorited] = useState(Boolean(nft.isFavorited));
	const listedDate = nft.listedDate ? new Date(nft.listedDate).toLocaleDateString() : undefined;

	const toggleFavorite = () => {
		const next = !isFavorited;
		setIsFavorited(next);
		onToggleFavorite?.(nft, next);
	};

	return (
		<NFTCardBase nft={nft} mode='market' className={className} noShadow={noShadow} isFavorited={isFavorited} onToggleFavorite={toggleFavorite} onImageClick={() => onSelect?.(nft)}>
			<div className='flex items-center justify-between text-sm'>
				<span className='text-default-600'>卖家</span>
				<div className='flex items-center gap-2'>
					{nft.sellerAvatar && <Avatar src={nft.sellerAvatar} size='sm' />}
					<span className='font-medium'>{nft.sellerName ?? '--'}</span>
				</div>
			</div>
			<div className='flex items-center justify-between text-sm'>
				<span className='text-default-600'>挂单时间</span>
				<span className='text-primary-foreground'>{listedDate ?? '--'}</span>
			</div>
			<div className='flex gap-2 pt-2 border-t border-primary-border/30'>
				{nft.isMyListing ? (
					<>
						<Button color='warning' variant='flat' size='sm' className='flex-1' startContent={<Icon icon='mdi:pencil' className='w-4 h-4' />} onPress={() => onEditListing?.(nft)}>
							编辑
						</Button>
						<Button color='danger' variant='flat' size='sm' className='flex-1' startContent={<Icon icon='mdi:delete' className='w-4 h-4' />} onPress={() => onCancelListing?.(nft)}>
							下架
						</Button>
					</>
				) : (
					<Button color='primary' variant='flat' size='sm' className='w-full' startContent={<Icon icon='mdi:shopping' className='w-4 h-4' />} onPress={() => onSelect?.(nft)}>
						立即购买
					</Button>
				)}
			</div>
		</NFTCardBase>
	);
};

export const NFTCard: React.FC<NFTCardProps> = props => {
	if (props.mode === 'market') {
		return <MarketNFTCard {...props} />;
	}
	return <BlindboxNFTCard {...props} />;
};

// ===== 行情卡片（列表） =====

interface QuoteCardProps {
	item: QuoteItem;
	onClick?: (item: QuoteItem) => void;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({item, onClick}) => {
	const isUp = item.changePct >= 0;
	return (
		<button onClick={() => onClick?.(item)} className='group flex items-center justify-between border border-content3/20 bg-content1/40 p-4 text-left hover:bg-content2/40 transition-colors rounded-lg'>
			<div className='flex min-w-0 items-center gap-3'>
				<Image alt={item.name} src={item.image} className='w-10 h-10 rounded-md object-cover flex-shrink-0' fallbackSrc='/images/nft-placeholder.png' />
				<div className='flex min-w-0 flex-col'>
					<div className='truncate font-semibold'>{item.name}</div>
					<div className='mt-1 flex items-center gap-2 text-xs text-priamry-foreground-500'>
						<Chip size='sm' variant='flat' radius='sm' className='h-5'>
							{item.exchange}
						</Chip>
						<span className='tracking-wider'>{item.symbol}</span>
					</div>
				</div>
			</div>
			<div className='flex shrink-0 items-end gap-4'>
				<div className='text-right'>
					<div className='tabular-nums font-bold'>{item.last}</div>
				</div>
				<Chip size='sm' color={isUp ? 'danger' : 'success'} variant='solid' className='min-w-20 text-center'>
					{isUp ? '+' : ''}
					{formatPercent(item.changePct)}
				</Chip>
				<Icon icon='mdi:chevron-right' width={20} className='text-primary-foreground' />
			</div>
		</button>
	);
};

// ===== 行情卡片（自选） =====
interface QuoteWatchCardProps {
	item: QuoteItem;
	onOpen?: (item: QuoteItem) => void;
	onRemove?: (id: string) => void;
	onStar?: (id: string, value: boolean) => void;
}

export const QuoteWatchCard: React.FC<QuoteWatchCardProps> = ({item, onOpen, onRemove, onStar}) => {
	const isUp = item.changePct >= 0;
	return (
		<div className='group flex items-center justify-between rounded-lg border border-content3/20 bg-content1/40 p-4 hover:bg-content2/40 transition-colors'>
			<button onClick={() => onOpen?.(item)} className='flex min-w-0 flex-1 items-center gap-3 text-left'>
				<Image alt={item.name} src={item.image} className='w-10 h-10 rounded-md object-cover flex-shrink-0' fallbackSrc='/images/nft-placeholder.png' />
				<div className='flex min-w-0 flex-col'>
					<div className='flex items-center gap-2'>
						<span className='truncate font-semibold'>{item.name}</span>
						<Chip size='sm' variant='flat' radius='sm' className='h-5'>
							{item.exchange}
						</Chip>
						<span className='text-xs text-priamry-foreground-500'>{item.symbol}</span>
					</div>
					<div className='mt-1 text-xs text-priamry-foreground-500'>{item.group ?? '默认分组'}</div>
				</div>
			</button>
			<div className='ml-3 flex shrink-0 items-center gap-3'>
				<div className='text-right'>
					<div className='tabular-nums font-bold'>{item.last}</div>
					<Chip size='sm' color={isUp ? 'danger' : 'success'} variant='solid' className='min-w-20 text-center' radius='sm'>
						{isUp ? '+' : ''}
						{formatPercent(item.changePct)}
					</Chip>
				</div>
				<button aria-label='星标' className={`rounded-lg p-2 hover:bg-content2/60 ${item.starred ? 'text-warning' : 'text-priamry-foreground-500'}`} onClick={() => onStar?.(item.id, !item.starred)}>
					<Icon icon={item.starred ? 'mdi:star' : 'mdi:star-outline'} width={20} />
				</button>
				{onRemove && (
					<button aria-label='移除' className='rounded-lg p-2 hover:bg-content2/60 text-priamry-foreground-400' onClick={() => onRemove(item.id)}>
						<Icon icon='mdi:chevron-right' width={20} />
					</button>
				)}
			</div>
		</div>
	);
};

// NFT 网格列表组件
interface NFTGridProps {
	nfts: NFT[]; //数据
	mode?: NFTCardMode;
	onPurchase?: (id: string, quantity: number) => void; //购买函数
	onSelect?: (nft: NFT) => void;
	onEditListing?: (nft: NFT) => void;
	onCancelListing?: (nft: NFT) => void;
	onToggleFavorite?: (nft: NFT, next: boolean) => void;
	loading?: boolean; //是否加载中
	hasMore?: boolean; //是否还有更多
	onLoadMore?: () => void; //加载更多函数
}
export const NFTGrid: React.FC<NFTGridProps> = ({nfts, mode = 'blindbox', onPurchase, onSelect, onEditListing, onCancelListing, onToggleFavorite, loading = false, hasMore = false, onLoadMore}) => {
	return (
		<div className='w-full h-full'>
			{/* NFT 网格 */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
				{nfts.map(nft => (
					<NFTCard key={nft.id} nft={nft} mode={mode} onPurchase={onPurchase} onSelect={onSelect} onEditListing={onEditListing} onCancelListing={onCancelListing} onToggleFavorite={onToggleFavorite} />
				))}
			</div>

			{/* 加载更多按钮 */}
			{hasMore && (
				<div className='flex justify-center mt-8'>
					<Button color='primary' variant='bordered' size='lg' onPress={onLoadMore} isLoading={loading} startContent={!loading && <Icon icon='mdi:refresh' className='w-4 h-4' />}>
						{loading ? '加载中...' : '加载更多'}
					</Button>
				</div>
			)}

			{/* 空状态 */}
			{nfts.length === 0 && !loading && (
				<div className='flex flex-col items-center justify-center py-16 text-center'>
					<Icon icon='mdi:image-off' className='w-16 h-16 text-priamry-foreground/30 mb-4' />
					<h3 className='text-lg font-semibold text-priamry-foreground/60 mb-2'>No available</h3>
					<p className='text-sm text-priamry-foreground/40'>No available</p>
				</div>
			)}
		</div>
	);
};

// 热门 NFT 横向列表组件（首页用）
interface HotNFTListProps {
	nfts: NFT[]; //数据
	title?: string; //标题
	showViewAll?: boolean;
	onViewAll?: () => void; //查看全部函数
	onPurchase: (id: string, quantity: number) => void; //购买函数
}

export const HotNFTList: React.FC<HotNFTListProps> = ({nfts, onPurchase, title = '🎁 Hot Box', showViewAll = true, onViewAll}) => {
	const tTip = useTranslations('tip');
	return (
		<div className='w-full flex flex-col gap-1 '>
			{/* 标题区域 */}
			<div className='flex items-center justify-between rounded-sm bg-background p-2'>
				<div className='flex items-center gap-3'>
					<Icon icon='mdi:fire' className='w-8 h-8 text-primary' />
					<h2 className='text-2xl font-bold text-primary'>{title}</h2>
				</div>
				{showViewAll && (
					<Button variant='light' className='text-primary-foreground' onPress={onViewAll} endContent={<Icon icon='mdi:arrow-right' className='w-4 h-4' />}>
						{tTip('view_all')}
					</Button>
				)}
			</div>

			{/* 横向滚动列表 */}
			<ScrollShadow orientation='horizontal' className='w-full' hideScrollBar>
				<div className='flex gap-4'>
					{nfts.map(nft => (
						<NFTCard key={nft.id} nft={nft} className='w-80 flex-shrink-0' mode='blindbox' onPurchase={onPurchase} noShadow />
					))}
				</div>
			</ScrollShadow>
		</div>
	);
};

// ===== 预测市场类型定义 =====
export interface MarketOption {
	id: string;
	label: string;
	yesProbability: number; // 0-1, Yes 的概率
	noProbability: number; // 0-1, No 的概率 (通常 = 1 - yesProbability)
	volume?: number;
}

export interface PredictionMarket {
	id: string;
	title: string;
	category: string;
	type: 'binary' | 'multiple'; // binary: 简单 Yes/No, multiple: 多个选项
	options?: MarketOption[]; // multiple 类型时使用
	yesProbability?: number; // binary 类型时使用
	noProbability?: number; // binary 类型时使用
	totalVolume: number;
	status: 'active' | 'ending_soon' | 'live';
	isTrending?: boolean;
	endDate?: string;
}

// ===== 简化版预测市场卡片（用于横向滚动） =====
interface PredictionMarketCardProps {
	market: PredictionMarket;
	onClick?: (market: PredictionMarket) => void;
	className?: string;
}

const PredictionMarketCard: React.FC<PredictionMarketCardProps> = ({market, onClick, className}) => {
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
		<Card className={cn('hover:shadow-lg transition-all border border-default-200 bg-content1 cursor-pointer', className)} onClick={() => onClick?.(market)}>
			<CardBody className='p-4 space-y-3'>
				{/* 标题和分类 */}
				<div className='flex items-start justify-between gap-2'>
					<h3 className='text-sm font-semibold text-priamry-foreground leading-tight line-clamp-2 flex-1'>{market.title}</h3>
					{market.isTrending && <Icon icon='mdi:fire' className='w-4 h-4 text-warning flex-shrink-0' />}
				</div>

				{/* Binary 类型：简单 Yes/No */}
				{market.type === 'binary' && market.yesProbability !== undefined && (
					<div className='space-y-2'>
						{/* 圆形进度条显示概率 */}
						<div className='flex justify-center'>
							<div className='relative w-16 h-16'>
								<svg className='w-16 h-16 transform -rotate-90'>
									<circle cx='32' cy='32' r='28' stroke='currentColor' strokeWidth='5' fill='none' className='text-default-200' />
									<circle cx='32' cy='32' r='28' stroke='currentColor' strokeWidth='5' fill='none' strokeDasharray={`${2 * Math.PI * 28}`} strokeDashoffset={`${2 * Math.PI * 28 * (1 - market.yesProbability)}`} className='text-success transition-all' strokeLinecap='round' />
								</svg>
								<div className='absolute inset-0 flex items-center justify-center'>
									<span className='text-base font-bold text-priamry-foreground'>{formatProbability(market.yesProbability)}</span>
								</div>
							</div>
						</div>
						<div className='text-center text-xs text-primary-foreground'>chance</div>
						{/* Yes/No 按钮 */}
						<div className='flex gap-2'>
							<Button size='sm' color='success' className='flex-1 font-semibold text-xs' variant='solid'>
								Yes
							</Button>
							<Button size='sm' color='danger' className='flex-1 font-semibold text-xs' variant='solid'>
								No
							</Button>
						</div>
					</div>
				)}

				{/* Multiple 类型：显示前两个选项 */}
				{market.type === 'multiple' && market.options && (
					<div className='space-y-1.5'>
						{market.options.slice(0, 2).map(option => {
							const formatProb = (prob: number) => {
								const percent = prob * 100;
								if (percent >= 99.5) return '100%';
								if (percent < 0.5) return '<1%';
								return `${percent.toFixed(0)}%`;
							};
							return (
								<div key={option.id} className='flex items-center justify-between gap-2'>
									<span className='text-xs font-medium text-priamry-foreground flex-1 truncate'>{option.label}</span>
									<div className='flex gap-1 flex-shrink-0' onClick={e => e.stopPropagation()}>
										<Button size='sm' color='success' variant='flat' className='min-w-[50px] h-6 text-xs font-semibold px-2' style={{backgroundColor: 'rgba(34, 197, 94, 0.1)'}}>
											Yes {formatProb(option.yesProbability)}
										</Button>
										<Button size='sm' color='danger' variant='flat' className='min-w-[50px] h-6 text-xs font-semibold px-2' style={{backgroundColor: 'rgba(239, 68, 68, 0.1)'}}>
											No {formatProb(option.noProbability)}
										</Button>
									</div>
								</div>
							);
						})}
						{market.options.length > 2 && <div className='text-xs text-primary-foreground text-center pt-1'>+{market.options.length - 2} more</div>}
					</div>
				)}

				{/* 底部：交易量和状态 */}
				<div className='flex items-center justify-between pt-2 border-t border-default-200'>
					<span className='text-xs text-primary-foreground font-medium'>{formatVolume(market.totalVolume)} Vol.</span>
					<div className='flex items-center gap-1.5'>
						{market.status === 'live' && (
							<Chip size='sm' color='danger' variant='flat' className='h-5 text-xs'>
								Live
							</Chip>
						)}
						{market.status === 'ending_soon' && (
							<Chip size='sm' color='warning' variant='flat' className='h-5 text-xs'>
								Ending
							</Chip>
						)}
					</div>
				</div>
			</CardBody>
		</Card>
	);
};

// ===== 热门预测市场横向列表组件（首页用） =====
interface HotPredictionListProps {
	markets: PredictionMarket[]; //数据
	title?: string; //标题
	showViewAll?: boolean;
	onViewAll?: () => void; //查看全部函数
	onMarketClick?: (market: PredictionMarket) => void; //点击市场函数
}

export const HotPredictionList: React.FC<HotPredictionListProps> = ({markets, title = '🔥 热门预测', showViewAll = true, onViewAll, onMarketClick}) => {
	const tTip = useTranslations('tip');
	return (
		<div className='w-full flex flex-col gap-1'>
			{/* 标题区域 */}
			<div className='flex items-center justify-between rounded-sm bg-background p-2'>
				<div className='flex items-center gap-3'>
					<Icon icon='mdi:chart-line-variant' className='w-8 h-8 text-primary' />
					<h2 className='text-2xl font-bold text-primary'>{title}</h2>
				</div>
				{showViewAll && (
					<Button variant='light' className='text-primary-foreground' onPress={onViewAll} endContent={<Icon icon='mdi:arrow-right' className='w-4 h-4' />}>
						{tTip('view_all')}
					</Button>
				)}
			</div>

			{/* 横向滚动列表 */}
			<ScrollShadow orientation='horizontal' className='w-full' hideScrollBar>
				<div className='flex gap-4'>
					{markets.map(market => (
						<PredictionMarketCard key={market.id} market={market} className='w-80 flex-shrink-0' onClick={onMarketClick} />
					))}
				</div>
			</ScrollShadow>
		</div>
	);
};
