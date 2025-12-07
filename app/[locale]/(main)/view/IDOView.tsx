'use client';
import React, {useEffect, useCallback, useMemo, useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {Card, CardBody, CardHeader, Button, Chip, Divider, InputOtp, Tabs, Tab} from '@heroui/react';
import {Icon} from '@iconify/react';
import {useTranslations} from 'next-intl';
import type {UserData} from '@/app/store/useUserDataStore';
import {TabsClass, InputOtpClass} from '@/components';
import {CopyButton, Snippet} from '@/components/client/common';
import {BaseTable} from '@/components/client/table';
import {useNeuraFiAccount, useInviteValidation} from '@/lib/hooks/evm/account';
import {obsTxt} from '@/lib/utils';

// ===== 类型定义 =====
type WhitelistTier = 'global' | 'regional' | 'community'; //全球 区域 社区

interface WhitelistTierConfig {
	id: WhitelistTier;
	name: string; //名称
	description: string; //描述
	benefits?: string; // benefits: '享有 IDO 最高优先级，独享所有权益。'
	donationAmount: number; // donationAmount: 5000
	limit: number; //上限
	tokenAmount: number; // tokenAmount: 5000
	releaseMonths: number; // releaseMonths: 10
	feeShare: number; //手续费分享收益
	level: number; // 等级
	requirements: string[]; // 要求
	icon: string;
	color: 'primary' | 'secondary' | 'success' | 'warning' | 'default';
}

// 等级优先级映射（用于判断是否可以升级）
const TIER_PRIORITY: Record<WhitelistTier, number> = {
	community: 1,
	regional: 2,
	global: 3
};

// 根据 level 找到对应的 tier（用于下线列表显示）
const getTierByLevel = (level: number, tierConfigs: WhitelistTierConfig[]): WhitelistTier | null => {
	const tierConfig = tierConfigs.find(t => t.level === level);
	return tierConfig?.id ?? null;
};

export function IDOView() {
	const tIdo = useTranslations('ido');
	const searchParams = useSearchParams();
	const slug = searchParams.get('slug'); //获取链接中的slug 参数
	const {userData, purchase, address, isConnected, isLoading, isExecuting} = useNeuraFiAccount();
	const {inviteCode, setInviteCode, inviteAccepted, inviteError, checkingInvite, inviteCompleted} = useInviteValidation(slug);

	const [selectedTab, setSelectedTab] = useState<'purchase' | 'my'>('purchase');

	const tierConfigs = useMemo<WhitelistTierConfig[]>(
		() => [
			{
				id: 'global',
				name: tIdo('tiers.super.name'),
				description: tIdo('tiers.super.description'),
				benefits: tIdo('tiers.super.benefits'),
				donationAmount: 5000,
				limit: 100,
				tokenAmount: 5000,
				releaseMonths: 10,
				feeShare: 0.5,
				level: 4,
				requirements: [tIdo('tiers.super.requirements.r1'), tIdo('tiers.super.requirements.r3')],
				icon: 'mdi:crown',
				color: 'warning'
			},
			{
				id: 'regional',
				name: tIdo('tiers.regional.name'),
				description: tIdo('tiers.regional.description'),
				benefits: tIdo('tiers.regional.benefits'),
				donationAmount: 1000,
				limit: 1000,
				tokenAmount: 1000,
				releaseMonths: 10,
				feeShare: 0.5,
				level: 3,
				requirements: [tIdo('tiers.regional.requirements.r1'), tIdo('tiers.super.requirements.r3')],
				icon: 'mdi:star',
				color: 'secondary'
			},
			{
				id: 'community',
				name: tIdo('tiers.community.name'),
				description: tIdo('tiers.community.description'),
				benefits: tIdo('tiers.community.benefits'),
				donationAmount: 200,
				limit: 1000,
				tokenAmount: 200,
				releaseMonths: 10,
				feeShare: 0,
				level: 1,
				requirements: [tIdo('tiers.community.requirements.r1'), tIdo('tiers.community.requirements.r2')],
				icon: 'mdi:star',
				color: 'default'
			}
		],
		[tIdo]
	);

	// 根据 userData.level 找到已申购的等级配置
	const currentTierConfig = useMemo(() => {
		if (!userData?.level || userData.level === 0) return null;
		const config = tierConfigs.find(t => t.level === userData.level);
		return config ?? null;
	}, [userData?.level, tierConfigs]);

	const donatedTier = currentTierConfig?.id; //已申购的等级

	//获取所需金额
	const getRequiredAmount = useCallback(
		(targetTier: WhitelistTier) => {
			const tierConfig = tierConfigs.find(t => t.id === targetTier);
			if (!tierConfig) return 0;
			const currentAmount = userData?.idoAmount ?? 0;
			const targetAmount = tierConfig.donationAmount;
			// 如果当前金额已经达到或超过目标金额，则不需要支付
			if (currentAmount >= targetAmount) return 0;
			// 否则需要支付差额
			return targetAmount - currentAmount;
		},
		[tierConfigs, userData]
	);

	return (
		<div className={`h-full w-full flex flex-col ${!inviteAccepted ? 'justify-center' : 'p-4 overflow-y-auto'} custom-scrollbar relative md:max-w-5xl mx-auto`}>
			{/* 背景装饰 */}
			<div className='absolute inset-0 overflow-hidden pointer-events-none'>
				<div className='absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl' />
				<div className='absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl' />
			</div>

			{/* 邀请码输入 - 最外层，未验证时只显示这个 */}
			{!inviteAccepted ? (
				<Card className='border border-primary/30 bg-content1/80 shadow-xl w-full my-24'>
					<CardBody className='space-y-4 py-8'>
						<div className='flex items-center gap-3'>
							<div className='p-3 rounded-xl bg-primary/10 border border-primary/20'>
								<Icon icon='mdi:key-variant' className='w-6 h-6 text-primary' />
							</div>
							<div>
								<p className='text-base font-semibold text-primary'>{tIdo('invite.title')}</p>
								<p className='text-sm text-default-500'>{tIdo('invite.description')}</p>
							</div>
						</div>
						<div className='flex justify-center w-full'>
							<InputOtp
								value={inviteCode}
								onValueChange={setInviteCode}
								length={6}
								size='lg'
								variant='bordered'
								isInvalid={inviteError}
								aria-label={tIdo('invite.ariaLabel')}
								classNames={{
									...InputOtpClass,
									base: 'mx-auto w-auto'
								}}
							/>
						</div>
						<div className='text-sm text-center'>
							{inviteError && <p className='text-danger font-medium'>{tIdo('invite.error')}</p>}
							{!inviteCompleted && !inviteAccepted && <p className='text-default-500'>{tIdo('invite.placeholder')}</p>}
						</div>
					</CardBody>
				</Card>
			) : (
				<>
					{/* 头部信息 */}
					<Card className='mb-6 relative overflow-hidden border-0 shadow-xl bg-linear-to-br from-content1 via-content1 to-default-100/50'>
						{/* 装饰性渐变条 */}
						<div className='absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary via-secondary to-warning' />
						<CardBody className='p-6'>
							<div className='flex flex-col md:flex-row gap-4 items-center justify-between relative z-10'>
								<div className='flex-1'>
									<div className='flex items-center gap-3 mb-3'>
										<div className='p-3 rounded-xl bg-content1 border border-primary-border shadow-md'>
											<Icon icon='mdi:rocket-launch' className='w-8 h-8 text-primary' />
										</div>
										<div>
											<h1 className='text-3xl font-bold text-primary mb-1 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text'>{tIdo('hero_title')}</h1>
											<p className='text-sm text-primary-foreground flex items-center gap-2'>
												<Icon icon='mdi:shield-check' className='w-4 h-4' />
												{tIdo('hero_subtitle')}
											</p>
										</div>
									</div>
								</div>
								{isConnected && address && (
									<Chip
										size='lg'
										variant='flat'
										color='primary'
										classNames={{
											base: 'bg-content1/80 border border-primary-border p-4',
											content: 'text-primary-foreground font-semibold'
										}}
										startContent={<Icon icon='mdi:wallet' className='w-6 h-6' />}>
										{Number.parseFloat(userData?.usdtBalance ?? '0').toLocaleString(undefined, {maximumFractionDigits: 4})} USDT
									</Chip>
								)}
							</div>
						</CardBody>
					</Card>

					<Tabs destroyInactiveTabPanel={false} selectedKey={selectedTab} onSelectionChange={key => setSelectedTab(key as 'purchase' | 'my')} className='w-full' classNames={{...TabsClass, tabList: 'gap-2 w-full', tab: 'w-full'}}>
						<Tab key='purchase' title={tIdo('tabs.purchase')}>
							<div className='mt-4'>
								<div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
									{tierConfigs.map(tier => {
										const currentTier = donatedTier;
										const currentRank = currentTier ? TIER_PRIORITY[currentTier] : -1;
										const targetRank = TIER_PRIORITY[tier.id];
										// 如果当前等级已经达到或超过目标等级，则禁用（不能降级或购买相同等级）
										const disabledByRank = currentRank >= targetRank;
										const requiredAmount = getRequiredAmount(tier.id);
										const walletBalance = Number(userData?.usdtBalance ?? '0');
										// 检查余额是否不足：需要支付的金额 > 0 且 钱包余额 < 所需金额
										const needsPayment = requiredAmount > 0;
										const insufficientBalance = needsPayment && walletBalance < requiredAmount;
										const disabled = !isConnected || isExecuting || disabledByRank || insufficientBalance || requiredAmount <= 0;
										// 显示升级标签：如果用户已有等级且目标等级更高
										const showUpgradeLabel = Boolean(currentTier) && currentRank < targetRank;
										return <TierCard key={tier.id} tier={tier} onPurchase={() => purchase(tier.level, requiredAmount.toString(), inviteCode)} isLoading={isExecuting} isDisabled={disabled} showUpgradeLabel={showUpgradeLabel} insufficientBalance={insufficientBalance} />;
									})}
								</div>
							</div>
						</Tab>
						{userData?.slug && userData.slug !== '' && (
							<Tab key='my' title={tIdo('tabs.my') || '我的'}>
								<MyIDOView userData={userData} currentTierConfig={currentTierConfig} tierConfigs={tierConfigs} />
							</Tab>
						)}
					</Tabs>
				</>
			)}
		</div>
	);
}

// ===== 白名单级别卡片组件 =====

function TierCard({tier, onPurchase, isLoading, isDisabled, showUpgradeLabel, insufficientBalance}: {tier: WhitelistTierConfig; onPurchase: (tier: WhitelistTier) => void; isLoading: boolean; isDisabled: boolean; showUpgradeLabel: boolean; insufficientBalance: boolean}) {
	const tIdo = useTranslations('ido');
	const tTip = useTranslations('tip');

	// 颜色映射：根据 tier.id 获取主色和次色
	const colorMap: Record<WhitelistTier, {primary: string; secondary: string; iconColor: string}> = {
		global: {primary: 'warning', secondary: 'warning', iconColor: 'warning'},
		regional: {primary: 'secondary', secondary: 'secondary', iconColor: 'secondary'},
		community: {primary: 'cyan', secondary: 'sky-300', iconColor: 'cyan-600'}
	};

	const colors = colorMap[tier.id] || {primary: 'default', secondary: 'default', iconColor: 'default'};

	// 使用模板字符串生成样式类名
	const styles = {
		gradient: `from-${colors.primary}/20 via-${colors.secondary}/10 to-transparent`,
		border: `border-${colors.primary}`,
		topBar: `from-${colors.primary} via-${colors.secondary}/50 to-transparent`,
		iconBg: `from-${colors.primary}/20 to-${colors.secondary}/10`,
		iconBorder: `border-${colors.primary}/30`,
		hoverGlow: `bg-${colors.primary}/5`,
		iconColor: `text-${colors.iconColor}`
	};

	return (
		<Card className={`group relative overflow-hidden transition-all duration-300 border-2 shadow-xl hover:shadow-2xl hover:scale-[1.02] ${styles.border} bg-linear-to-br ${styles.gradient} backdrop-blur-sm`}>
			{/* 装饰性背景光效 */}
			<div className={`absolute top-0 right-0 w-48 h-48 ${styles.hoverGlow} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
			{/* 顶部装饰条 */}
			<div className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${styles.topBar}`} />
			<CardHeader className='pb-3 relative z-10'>
				<div className='flex items-center justify-between w-full'>
					<div className='flex items-center gap-4'>
						<div className={`p-4 rounded-2xl bg-linear-to-br ${styles.iconBg} border ${styles.iconBorder} shadow-lg`}>
							<Icon icon={tier.icon} className={`w-8 h-8 ${styles.iconColor}`} />
						</div>
						<div>
							<h3 className='font-bold text-xl mb-1'>{tier.name}</h3>
							<Chip size='sm' color={tier.color} variant='flat' className='font-bold border border-current/30'>
								{`Level ${tier.level}`}
							</Chip>
						</div>
					</div>
				</div>
			</CardHeader>
			<CardBody className='space-y-4 relative z-10'>
				<p className={`text-sm leading-relaxed ${tier.id === 'community' ? 'text-primary-foreground font-medium' : 'text-default-600'}`}>{tier.description}</p>
				{tier.benefits && <div className='p-3 rounded-lg bg-content1/60 border border-primary-border/60 text-sm text-primary-foreground'>{tier.benefits}</div>}

				<Divider className='bg-default-200' />
				{/* 关键信息 - 使用卡片样式 */}
				<div className='space-y-3'>
					<div className={`flex justify-between items-center p-3 rounded-lg border transition-colors ${tier.id === 'community' ? 'bg-white/70 dark:bg-content1/80 border-cyan-300/40 hover:bg-white/90 dark:hover:bg-content1' : 'bg-content1/50 border-primary-border/50 hover:bg-content1'}`}>
						<div className='flex items-center gap-2'>
							<Icon icon='mdi:currency-usd' className={`w-4 h-4 ${tier.id === 'community' ? 'text-cyan-600' : 'text-default-400'}`} />
							<span className={`text-sm ${tier.id === 'community' ? 'text-primary-foreground font-medium' : 'text-primary-foreground'}`}>{tIdo('fields.donation')}</span>
						</div>
						<span className='font-bold text-xl text-primary-foreground'>${tier.donationAmount}</span>
					</div>
					<div className={`flex justify-between items-center p-3 rounded-lg border transition-colors ${tier.id === 'community' ? 'bg-white/70 dark:bg-content1/80 border-cyan-300/40 hover:bg-white/90 dark:hover:bg-content1' : 'bg-content1/50 border-primary-border/50 hover:bg-content1'}`}>
						<div className='flex items-center gap-2'>
							<Icon icon='mdi:coin' className={`w-4 h-4 ${tier.id === 'community' ? 'text-cyan-600' : 'text-default-400'}`} />
							<span className={`text-sm ${tier.id === 'community' ? 'text-primary-foreground font-medium' : 'text-primary-foreground'}`}>{tIdo('fields.token_amount')}</span>
						</div>
						<span className='font-semibold text-lg text-primary-foreground'>${tier.tokenAmount}</span>
					</div>
					<div className='grid grid-cols-2 gap-2'>
						<div className={`flex justify-between items-center p-2 rounded-lg ${tier.id === 'community' ? 'bg-white/60 dark:bg-content1/70 border border-cyan-200/30' : 'bg-content1/30'}`}>
							<span className={`text-xs ${tier.id === 'community' ? 'text-primary-foreground' : 'text-primary-foreground'}`}>{tIdo('fields.release_period')}</span>
							<span className='font-semibold text-sm text-primary-foreground'>{tIdo('fields.release_value', {value: tier.releaseMonths})}</span>
						</div>
						<div className={`flex justify-between items-center p-2 rounded-lg ${tier.id === 'community' ? 'bg-white/60 dark:bg-content1/70 border border-cyan-200/30' : 'bg-content1/30'}`}>
							<span className={`text-xs ${tier.id === 'community' ? 'text-primary-foreground' : 'text-primary-foreground'}`}>{tIdo('fields.fee_share')}</span>
							<span className='font-semibold text-sm text-primary-foreground'>{tIdo('fields.fee_value', {value: tier.feeShare})}</span>
						</div>
					</div>
				</div>

				<Divider className='bg-default-200' />

				{/* 要求列表 */}
				<div className='space-y-2'>
					<p className={`text-xs font-semibold mb-2 flex items-center gap-2 ${tier.id === 'community' ? 'text-primary-foreground' : 'text-primary-foreground'}`}>
						<Icon icon='mdi:check-circle-outline' className={`w-4 h-4 ${tier.id === 'community' ? 'text-cyan-600' : ''}`} />
						{tIdo('fields.requirements')}
					</p>
					{tier.requirements.map((req, index) => (
						<div key={index} className={`flex items-start gap-2 text-xs p-2 rounded-lg transition-colors ${tier.id === 'community' ? 'bg-white/60 dark:bg-content1/70 border border-cyan-200/30 hover:bg-white/80 dark:hover:bg-content1 text-primary-foreground' : 'bg-default-50/50 hover:bg-default-100/50 text-default-600'}`}>
							<Icon icon='mdi:check' className={`w-3 h-3 shrink-0 mt-0.5 ${tier.id === 'community' ? 'text-cyan-600' : 'text-success'}`} />
							<span className='leading-relaxed'>{req}</span>
						</div>
					))}
				</div>

				{/* 购买按钮 */}
				<Button
					isLoading={isLoading}
					isDisabled={isDisabled}
					color={tier.color}
					variant='solid'
					className={`w-full font-bold shadow-lg hover:shadow-xl transition-all ${tier.id === 'community' ? 'bg-linear-to-r from-cyan-500 to-sky-400 text-primary-foreground' : tier.id === 'regional' ? 'bg-linear-to-r from-purple-500 to-purple-400 text-primary-foreground' : tier.id === 'global' ? 'bg-warning text-warning-foreground hover:bg-warning/90' : ''}`}
					size='lg'
					onPress={() => onPurchase(tier.id)}
					startContent={<Icon icon='mdi:cart' className='w-5 h-5' />}>
					{insufficientBalance ? tTip('insufficient_balance') : showUpgradeLabel ? tIdo('labels.upgrade_purchase') : tIdo('buttons.buy_now')}
				</Button>
			</CardBody>
		</Card>
	);
}

// ===== 我的 IDO 视图组件 =====
function MyIDOView({userData, currentTierConfig, tierConfigs}: {userData: UserData; currentTierConfig: WhitelistTierConfig | null; tierConfigs: WhitelistTierConfig[]}) {
	const tIdo = useTranslations('ido');
	const idoPerformance = Number(userData?.idoPerformance ?? 0);

	// 表格头部配置
	const tableHead = useMemo(
		() => [
			{name: tIdo('fields.address') ?? '地址', uid: 'address', sortable: false},
			{name: tIdo('fields.donation') ?? '申购金额', uid: 'idoAmount', sortable: true},
			{name: tIdo('fields.level') ?? '等级', uid: 'level', sortable: true},
			{name: tIdo('fields.tier') ?? '等级名称', uid: 'tier', sortable: false}
		],
		[tIdo]
	);

	// 处理数据，添加 tier 字段用于显示
	const tableData = useMemo(() => {
		const referrals = userData?.referrals ?? [];
		return referrals.map(referral => {
			const referralTier = getTierByLevel(Number(referral.level ?? 0), tierConfigs);
			const referralTierConfig = referralTier ? tierConfigs.find(t => t.id === referralTier) : null;
			return {
				...referral,
				tier: referralTierConfig?.name ?? '-',
				idoAmount: `$${Number(referral.idoAmount ?? 0).toLocaleString()}`
			};
		});
	}, [userData?.referrals, tierConfigs]);

	return (
		<div className='mt-4 space-y-6'>
			{/* 已申购卡片提示 */}

			{currentTierConfig && (
				<Card className='border-2 border-success/40 bg-success/10 shadow-lg'>
					<CardHeader>
						<div className='flex items-center gap-3'>
							<div className='p-3 rounded-xl bg-success/20 border border-success/30'>
								<Icon icon='mdi:check-decagram' className='w-6 h-6 text-success' />
							</div>
							<div>
								<h3 className='text-lg font-bold text-success'>{tIdo('my.subscribed_tier') || '已申购'}</h3>
								<p className='text-sm text-success/80'>{currentTierConfig.name}</p>
							</div>
						</div>
					</CardHeader>
					<CardBody>
						<div className='space-y-3'>
							<div className='flex justify-between items-center p-3 rounded-lg bg-content1/50 border border-success/20'>
								<span className='text-sm font-medium'>{tIdo('fields.donation')}</span>
								<span className='font-bold text-lg'>${userData?.idoAmount ?? 0}</span>
							</div>
							<div className='flex justify-between items-center p-3 rounded-lg bg-content1/50 border border-success/20'>
								<span className='text-sm font-medium'>{tIdo('fields.token_amount')}</span>
								<span className='font-semibold'>${currentTierConfig.tokenAmount}</span>
							</div>
						</div>
					</CardBody>
				</Card>
			)}

			{/* 推广链接 */}
			<Card className='border-2 border-secondary/40 bg-secondary/10 shadow-lg'>
				<CardHeader>
					<div className='flex items-center gap-3'>
						<div className='p-3 rounded-xl bg-secondary/20 border border-secondary/30'>
							<Icon icon='mdi:link-variant' className='w-6 h-6 text-secondary' />
						</div>
						<div>
							<h3 className='text-lg font-bold text-secondary'>{tIdo('my.referral_link') || '推广链接'}</h3>
							<p className='text-sm text-secondary/80'>{tIdo('my.referral_link_desc') || '分享您的专属推广链接'}</p>
						</div>
					</div>
				</CardHeader>
				<CardBody>
					<Snippet variant='flat' symbol='Link:' className='flex-1' codeString={`${process.env.baseURL}/?tab=ido&slug=${userData.slug}`}>
						<span className='text-xs'>{obsTxt(`${process.env.baseURL}/?tab=ido&slug=${userData.slug}`, 11, 8)}</span>
					</Snippet>
				</CardBody>
			</Card>
			{/* IDO 业绩 */}
			<Card className='border border-primary/30 bg-content1/80 shadow-xl'>
				<CardHeader>
					<div className='flex items-center gap-3'>
						<div className='p-3 rounded-xl bg-primary/10 border border-primary/20'>
							<Icon icon='mdi:chart-line' className='w-6 h-6 text-primary' />
						</div>
						<div>
							<h3 className='text-lg font-bold'>{tIdo('my.ido_performance') || 'IDO 推荐业绩'}</h3>
							<p className='text-sm text-default-500'>{tIdo('my.ido_performance_desc') || '您推荐的用户申购总额'}</p>
						</div>
					</div>
				</CardHeader>
				<CardBody>
					<div className='p-6 rounded-lg bg-primary/10 border border-primary/20 text-center'>
						<p className='text-3xl font-bold text-primary mb-2'>${idoPerformance.toLocaleString()}</p>
						<p className='text-sm text-default-600'>{tIdo('my.total_referral_amount') || '累计推荐申购金额'}</p>
					</div>
				</CardBody>
			</Card>
			{/* 直接推荐列表 */}
			<Card className='border border-secondary/30 bg-content1/80 shadow-xl'>
				<CardHeader>
					<div className='flex items-center gap-3'>
						<div className='p-3 rounded-xl bg-secondary/10 border border-secondary/20'>
							<Icon icon='mdi:account-group' className='w-6 h-6 text-secondary' />
						</div>
						<div>
							<h3 className='text-lg font-bold'>{tIdo('my.direct_referrals') || '直接推荐'}</h3>
							<p className='text-sm text-default-500'>{tIdo('my.direct_referrals_desc') || '您直接推荐的用户列表'}</p>
						</div>
					</div>
				</CardHeader>
				<CardBody className='p-2 h-full min-h-[400px]'>
					<BaseTable table={{key: 'ido-referral-list', selectedKeys: new Set()}} tableHeader={{columns: tableHead}} tableBody={{isLoading: false}} data={tableData} pageSize={10} onPageChange={page => {}} />
				</CardBody>
			</Card>
		</div>
	);
}
