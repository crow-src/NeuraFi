'use client';
import {useMemo, useState} from 'react';
import {Avatar, AvatarGroup, Button, Card, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from '@heroui/react';
import {useTranslations} from 'next-intl';

// ===== Mock Data & Types =====
type TokenType = 'ETH' | 'USDC' | 'USDT' | 'UNI' | 'LINK' | 'AAVE';

// 配资资金提供者数据类型
interface FundingProvider {
	id: string;
	provider: string;
	avatar: string;
	amount: string;
	token: TokenType;
	apy: string;
	duration: string;
	minAmount: string;
	maxAmount: string;
	fee: string; // 手续费，替换原来的risk
	reputation: number; // 1-5 stars
	minUsageDays: number; // 最短使用天数
	maxUsageDays: number; // 最长使用天数
}

// Mock配资资金推测数据
const MOCK_FUNDING_PROVIDERS: FundingProvider[] = [];

// 配资资金提供者卡片组件
export const FundingProviderCard = ({fund, isSelected, onToggle}: {fund: FundingProvider; isSelected: boolean; onToggle: () => void}) => {
	const t = useTranslations('swap');

	return (
		<div key={fund.id} className={`p-4 border rounded-lg transition-all cursor-pointer w-full ${isSelected ? 'border-primary bg-primary/10' : 'border-primary/20 hover:bg-primary/5'}`} onClick={onToggle}>
			<div className='flex justify-between items-start w-full'>
				<div className='flex items-center gap-3'>
					<Avatar size='md' src={fund.avatar} />
					<div>
						<div className='flex items-center gap-2'>
							<p className='font-semibold'>{fund.provider}</p>
							<div className='flex items-center'>
								{[...Array(5)].map((_, i) => (
									<span key={i} className={`text-xs ${i < fund.reputation ? 'text-yellow-500' : 'text-primary-foreground/20'}`}>
										★
									</span>
								))}
							</div>
						</div>
						<p className='text-sm text-primary-foreground/60'>
							{fund.amount} {fund.token} {t('available')}
						</p>
					</div>
				</div>
				<div className='text-right'>
					<p className='text-lg font-semibold text-primary'>{fund.apy}</p>
					<p className='text-xs text-primary-foreground/60'>{fund.duration}</p>
				</div>
			</div>

			<div className='mt-3 grid grid-cols-2 gap-4 text-xs w-full'>
				<div>
					<p className='text-primary-foreground/50'>{t('amount_range')}</p>
					<p className='font-medium'>
						{fund.minAmount} - {fund.maxAmount} {fund.token}
					</p>
				</div>
				<div>
					<p className='text-primary-foreground/50'>{t('fee')}</p>
					<p className='font-medium text-primary'>{fund.fee}</p>
				</div>
			</div>

			<div className='mt-2 grid grid-cols-1 gap-2 text-xs w-full'>
				<div>
					<p className='text-primary-foreground/50'>{t('usage_period')}</p>
					<p className='font-medium'>
						{fund.minUsageDays} - {fund.maxUsageDays} {t('days')}
					</p>
				</div>
			</div>

			{/* 选中状态指示器 */}
			{isSelected && (
				<div className='mt-2 flex items-center gap-1 text-primary text-sm w-full'>
					<span>✓</span>
					<span>{t('selected')}</span>
				</div>
			)}
		</div>
	);
};

// 配资Tab组件
export const FundingList = ({selectedFunds, onSelection}: {selectedFunds: Set<string>; onSelection: (fundId: string, isSelected: boolean) => void}) => {
	const t = useTranslations('swap');
	const [filterToken, setFilterToken] = useState<TokenType | 'ALL'>('ALL');
	const [filterMinReputation, setFilterMinReputation] = useState<number>(0);
	const [sortBy, setSortBy] = useState<'apy' | 'reputation' | 'amount'>('apy');

	// 获取所有可用的代币类型
	const availableTokens = useMemo(() => {
		const tokens = new Set(MOCK_FUNDING_PROVIDERS.map(fund => fund.token));
		return Array.from(tokens);
	}, []);

	// 筛选和排序逻辑
	const filteredAndSortedProviders = useMemo(() => {
		const filtered = MOCK_FUNDING_PROVIDERS.filter(fund => {
			// 代币类型筛选
			if (filterToken !== 'ALL' && fund.token !== filterToken) return false;
			// 评级筛选
			if (fund.reputation < filterMinReputation) return false;
			return true;
		});

		// 排序
		filtered.sort((a, b) => {
			switch (sortBy) {
				case 'apy':
					return parseFloat(b.apy.replace('%', '')) - parseFloat(a.apy.replace('%', ''));
				case 'reputation':
					return b.reputation - a.reputation;
				case 'amount':
					return parseFloat(b.maxAmount.replace(',', '')) - parseFloat(a.maxAmount.replace(',', ''));
				default:
					return 0;
			}
		});

		return filtered;
	}, [filterToken, filterMinReputation, sortBy]);

	return (
		<div className='space-y-4 h-full w-full'>
			<div className='flex justify-between items-center w-full'>
				<h3 className='text-lg font-semibold'>{t('available_funding')}</h3>
				<div className='flex items-center gap-3'>
					{/* 筛选控件 */}
					<div className='flex items-center gap-2'>
						{/* 代币类型筛选 */}
						<Dropdown>
							<DropdownTrigger>
								<Button variant='bordered' size='sm' className='text-xs'>
									{filterToken === 'ALL' ? t('all_tokens') : filterToken}
								</Button>
							</DropdownTrigger>
							<DropdownMenu
								aria-label='代币类型筛选'
								selectionMode='single'
								disallowEmptySelection
								selectedKeys={[filterToken]}
								onSelectionChange={keys => {
									const key = Array.from(keys)[0] as TokenType | 'ALL';
									setFilterToken(key);
								}}>
								<DropdownItem key='ALL'>{t('all_tokens')}</DropdownItem>
								<DropdownItem key='USDC'>USDC</DropdownItem>
								<DropdownItem key='USDT'>USDT</DropdownItem>
								<DropdownItem key='ETH'>ETH</DropdownItem>
							</DropdownMenu>
						</Dropdown>

						{/* 评级筛选 */}
						<Dropdown>
							<DropdownTrigger>
								<Button variant='bordered' size='sm' className='text-xs'>
									{filterMinReputation === 0 ? t('no_rating_limit') : `${filterMinReputation}${t('stars_above')}`}
								</Button>
							</DropdownTrigger>
							<DropdownMenu
								aria-label='评级筛选'
								selectionMode='single'
								disallowEmptySelection
								selectedKeys={[filterMinReputation.toString()]}
								onSelectionChange={keys => {
									const key = Array.from(keys)[0] as string;
									setFilterMinReputation(parseInt(key));
								}}>
								<DropdownItem key='0'>{t('no_rating_limit')}</DropdownItem>
								<DropdownItem key='3'>3{t('stars_above')}</DropdownItem>
								<DropdownItem key='4'>4{t('stars_above')}</DropdownItem>
								<DropdownItem key='5'>5{t('stars')}</DropdownItem>
							</DropdownMenu>
						</Dropdown>

						{/* 排序方式 */}
						<Dropdown>
							<DropdownTrigger>
								<Button variant='bordered' size='sm' className='text-xs'>
									{sortBy === 'apy' ? t('by_apy') : sortBy === 'reputation' ? t('by_rating') : t('by_amount')}
								</Button>
							</DropdownTrigger>
							<DropdownMenu
								aria-label='排序方式'
								selectionMode='single'
								disallowEmptySelection
								selectedKeys={[sortBy]}
								onSelectionChange={keys => {
									const key = Array.from(keys)[0] as 'apy' | 'reputation' | 'amount';
									setSortBy(key);
								}}>
								<DropdownItem key='apy'>{t('by_apy')}</DropdownItem>
								<DropdownItem key='reputation'>{t('by_rating')}</DropdownItem>
								<DropdownItem key='amount'>{t('by_amount')}</DropdownItem>
							</DropdownMenu>
						</Dropdown>

						<div className='text-sm text-primary-foreground/60'>
							{t('selected_count')}: {selectedFunds.size} {t('funding_sources')}
						</div>
					</div>
				</div>
			</div>

			{/* 资金统计 */}
			{selectedFunds.size > 0 && (
				<Card className='p-3 border-primary/20 bg-primary/5 w-full'>
					<div className='flex justify-between items-center w-full'>
						<div>
							<p className='text-sm text-primary-foreground/70'>{t('total_available_funding')}</p>
							<p className='text-lg font-semibold text-primary'>
								{MOCK_FUNDING_PROVIDERS.filter(fund => selectedFunds.has(fund.id))
									.reduce((total, fund) => {
										const amount = parseFloat(fund.maxAmount.replace(',', ''));
										return total + amount;
									}, 0)
									.toLocaleString()}{' '}
								{t('usdc_equivalent')}
							</p>
						</div>
						<div className='text-right'>
							<p className='text-sm text-primary-foreground/70'>{t('average_rate')}</p>
							<p className='text-lg font-semibold text-primary-secondary'>{(MOCK_FUNDING_PROVIDERS.filter(fund => selectedFunds.has(fund.id)).reduce((sum, fund) => sum + parseFloat(fund.apy.replace('%', '')), 0) / selectedFunds.size || 0).toFixed(1)}%</p>
						</div>
					</div>
				</Card>
			)}

			{/* 资金提供者列表 */}
			<div className='grid grid-cols-1 gap-1 md:gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 overflow-y-auto w-full'>
				{filteredAndSortedProviders.length > 0 ? (
					filteredAndSortedProviders.map(fund => <FundingProviderCard key={fund.id} fund={fund} isSelected={selectedFunds.has(fund.id)} onToggle={() => onSelection(fund.id, !selectedFunds.has(fund.id))} />)
				) : (
					<div className='col-span-full text-center py-8 text-primary-foreground/60'>
						<p>{t('no_funding_found')}</p>
					</div>
				)}
			</div>
		</div>
	);
};
