// 'use client';
// import React, {useEffect, useCallback, useState, useMemo} from 'react';
// import {useSearchParams} from 'next/navigation';
// import {Card, CardBody, CardHeader, Button, Chip, Divider, InputOtp, Tabs, Tab} from '@heroui/react';
// import {Icon} from '@iconify/react';
// import {useAppKitAccount} from '@reown/appkit/react';
// import {parseUnits} from 'ethers';
// import {useTranslations} from 'next-intl';
// import {TabsClass, InputOtpClass} from '@/components';
// import {getAccountData, addIDOAmount, getAccountDataBySlug, getUserByInvitationCode, getDirectReferralsByAddressFromNeurafi, getAccountDataFromNeurafi} from '@/lib/api/db';
// import {useNeuraFiAccount} from '@/lib/hooks/evm/account';
// import {useERC20} from '@/lib/hooks/evm/common';

// // ===== 类型定义 =====
// type WhitelistTier = 'global' | 'regional' | 'community'; //全球 区域 社区

// interface WhitelistTierConfig {
// 	id: WhitelistTier;
// 	name: string; //名称
// 	description: string; //描述
// 	benefits?: string; // benefits: '享有 IDO 最高优先级，独享所有权益。'
// 	donationAmount: number; // donationAmount: 5000
// 	limit: number; //上限
// 	tokenAmount: number; // tokenAmount: 5000
// 	releaseMonths: number; // releaseMonths: 10
// 	feeShare: number; //手续费分享收益
// 	level: string; // 等级
// 	requirements: string[]; // 要求
// 	icon: string;
// 	color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
// }

// // ===== 募资视图 =====
// const DONATION_TOKEN = '0xc1f92e6a5878e25b1547b52461771ef40b4cf0fe'; //转移代币合约 测试:0xc1f92e6a5878e25b1547b52461771ef40b4cf0fe 正式:0x55d398326f99059fF775485246999027B3197955
// const DONATION_TOKEN_DECIMALS = 18;
// const TREASURY_ADDRESS = '0x1553fb4d5e0c3a8cbbf6e1571dcd6ae0678de84e'; //接收代币地址 测试: 0x1553fb4d5e0c3a8cbbf6e1571dcd6ae0678de84e     正式:0xA26765Fb7dE0ebF6637caA53A69C70a446c3b54c
// const TIER_PRIORITY: Record<WhitelistTier, number> = {community: 0, regional: 1, global: 2}; //社区 区域 全球

// // 根据 idoAmount 计算用户等级
// const getTierByAmount = (amount: number): WhitelistTier | null => {
// 	if (amount >= 5000) return 'global';
// 	if (amount >= 1000) return 'regional';
// 	if (amount >= 200) return 'community';
// 	return null;
// };

// export function IDOView() {
// 	const tIdo = useTranslations('ido');
// 	const searchParams = useSearchParams();
// 	const slug = searchParams.get('slug'); //获取链接中的slug 参数
// 	const {address, isConnected} = useAppKitAccount();
// 	const {loading, balance, balanceWei} = useERC20(DONATION_TOKEN, DONATION_TOKEN_DECIMALS);
// 	const {purchase} = useNeuraFiAccount({token: DONATION_TOKEN});

// 	const [pendingTier, setPendingTier] = React.useState<WhitelistTier | null>(null);
// 	const [userData, setUserData] = React.useState<{idoAmount: number} | null>(null);
// 	const [loadingUserData, setLoadingUserData] = React.useState(false);
// 	const walletBalanceWei = balanceWei ?? 0n;
// 	const [inviteCode, setInviteCode] = React.useState('');
// 	const [inviteAccepted, setInviteAccepted] = React.useState(false);
// 	const [inviteError, setInviteError] = React.useState(false);
// 	const [checkingInvite, setCheckingInvite] = React.useState(false);
// 	const [selectedTab, setSelectedTab] = React.useState('purchase');

// 	// 根据 idoAmount 计算当前等级
// 	const donatedTier = userData ? getTierByAmount(userData.idoAmount) : undefined;

// 	// 从数据库获取用户数据
// 	useEffect(() => {
// 		if (!address) return;
// 		const fetchUserData = async () => {
// 			setLoadingUserData(true);
// 			try {
// 				const result = await getAccountData({address});
// 				if (result.success && result.data) {
// 					setUserData({idoAmount: result.data.idoAmount ?? 0});
// 				} else {
// 					setUserData({idoAmount: 0});
// 				}
// 			} catch (error) {
// 				console.error('Failed to fetch user data', error);
// 				setUserData({idoAmount: 0});
// 			} finally {
// 				setLoadingUserData(false);
// 			}
// 		};
// 		fetchUserData();
// 	}, [address]);

// 	// 检查 slug 参数，如果有且数据库有账户则直接进入
// 	useEffect(() => {
// 		if (!slug || inviteAccepted) return;
// 		const checkSlug = async () => {
// 			setCheckingInvite(true);
// 			try {
// 				const result = await getAccountDataBySlug(slug);
// 				if (result.success && result.data) {
// 					setInviteAccepted(true);
// 					setInviteCode(slug);
// 				}
// 			} catch (error) {
// 				console.error('Failed to check slug', error);
// 			} finally {
// 				setCheckingInvite(false);
// 			}
// 		};
// 		checkSlug();
// 	}, [slug, inviteAccepted]);

// 	// 验证邀请码
// 	const inviteCompleted = inviteCode.length === 6;
// 	useEffect(() => {
// 		if (!inviteCompleted || inviteAccepted) return;
// 		const validateInviteCode = async () => {
// 			// 检查邀请码是否在数据库中有账户
// 			setCheckingInvite(true);
// 			setInviteError(false);
// 			try {
// 				const result = await getUserByInvitationCode(inviteCode);
// 				if (result.success && result.data) {
// 					setInviteAccepted(true);
// 					setInviteError(false);
// 				} else {
// 					setInviteError(true);
// 					setInviteAccepted(false);
// 				}
// 			} catch (error) {
// 				console.error('Failed to validate invite code', error);
// 				setInviteError(true);
// 				setInviteAccepted(false);
// 			} finally {
// 				setCheckingInvite(false);
// 			}
// 		};
// 		validateInviteCode();
// 	}, [inviteCode, inviteCompleted, inviteAccepted]);

// 	const tierConfigs = useMemo<WhitelistTierConfig[]>(
// 		() => [
// 			{
// 				id: 'global',
// 				name: tIdo('tiers.super.name'),
// 				description: tIdo('tiers.super.description'),
// 				benefits: tIdo('tiers.super.benefits'),
// 				donationAmount: 5000,
// 				limit: 100,
// 				tokenAmount: 5000,
// 				releaseMonths: 10,
// 				feeShare: 0.5,
// 				level: 'V4',
// 				requirements: [tIdo('tiers.super.requirements.r1'), tIdo('tiers.super.requirements.r3')],
// 				icon: 'mdi:crown',
// 				color: 'warning'
// 			},
// 			{
// 				id: 'regional',
// 				name: tIdo('tiers.regional.name'),
// 				description: tIdo('tiers.regional.description'),
// 				benefits: tIdo('tiers.regional.benefits'),
// 				donationAmount: 1000,
// 				limit: 1000,
// 				tokenAmount: 1000,
// 				releaseMonths: 5,
// 				feeShare: 0.5,
// 				level: 'V3',
// 				requirements: [tIdo('tiers.regional.requirements.r1'), tIdo('tiers.super.requirements.r3')],
// 				icon: 'mdi:star',
// 				color: 'secondary'
// 			}
// 		],
// 		[tIdo]
// 	);

// 	const getRequiredAmount = useCallback(
// 		(targetTier: WhitelistTier) => {
// 			const tierConfig = tierConfigs.find(t => t.id === targetTier);
// 			if (!tierConfig) return 0;
// 			const currentAmount = userData?.idoAmount ?? 0;
// 			const targetAmount = tierConfig.donationAmount;
// 			// 如果当前金额已经达到或超过目标金额，则不需要支付
// 			if (currentAmount >= targetAmount) return 0;
// 			// 否则需要支付差额
// 			return targetAmount - currentAmount;
// 		},
// 		[tierConfigs, userData]
// 	);

// 	// 处理申购
// 	const handlePurchase = async (tier: WhitelistTier) => {
// 		const tierConfig = tierConfigs.find(t => t.id === tier);
// 		if (!tierConfig) return;
// 		const targetRank = TIER_PRIORITY[tier]; // 检查是否可以升级：当前等级必须小于目标等级
// 		const requiredAmount = getRequiredAmount(tier);

// 		setPendingTier(tier);
// 		try {
// 			// 转账
// 			await transfer?.(TREASURY_ADDRESS, requiredAmount.toString());
// 			// 更新数据库中的 idoAmount，传入邀请码以绑定上线关系
// 			const level = targetRank; // 使用等级数字
// 			const result = await addIDOAmount(address ?? '', requiredAmount, level, inviteCode || undefined);
// 			if (result.success) {
// 				// 更新本地状态
// 				setUserData(prev => ({
// 					idoAmount: (prev?.idoAmount ?? 0) + requiredAmount
// 				}));
// 			} else {
// 				throw new Error('Failed to update IDO amount in database');
// 			}
// 		} catch (error) {
// 			console.error('Failed to donate', error);
// 		} finally {
// 			setPendingTier(null);
// 		}
// 	};

// 	return (
// 		<div className='h-full w-full flex flex-col p-4 overflow-y-auto custom-scrollbar relative'>
// 			{/* 背景装饰 */}
// 			<div className='absolute inset-0 overflow-hidden pointer-events-none'>
// 				<div className='absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl' />
// 				<div className='absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl' />
// 			</div>

// 			{/* 头部信息 */}
// 			<Card className='mb-6 relative overflow-hidden border-0 shadow-xl bg-linear-to-br from-content1 via-content1 to-default-100/50'>
// 				{/* 装饰性渐变条 */}
// 				<div className='absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary via-secondary to-warning' />
// 				<CardBody className='p-6'>
// 					<div className='flex flex-col md:flex-row gap-4 items-center justify-between relative z-10'>
// 						<div className='flex-1'>
// 							<div className='flex items-center gap-3 mb-3'>
// 								<div className='p-3 rounded-xl bg-content1 border border-primary-border shadow-md'>
// 									<Icon icon='mdi:rocket-launch' className='w-8 h-8 text-primary' />
// 								</div>
// 								<div>
// 									<h1 className='text-3xl font-bold text-primary mb-1 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text'>{tIdo('hero_title')}</h1>
// 									<p className='text-sm text-primary-foreground flex items-center gap-2'>
// 										<Icon icon='mdi:shield-check' className='w-4 h-4' />
// 										{tIdo('hero_subtitle')}
// 									</p>
// 								</div>
// 							</div>
// 						</div>
// 						{isConnected && address && (
// 							<Chip
// 								size='lg'
// 								variant='flat'
// 								color='primary'
// 								classNames={{
// 									base: 'bg-content1/80 border border-primary-border p-4',
// 									content: 'text-primary-foreground font-semibold'
// 								}}
// 								startContent={<Icon icon='mdi:wallet' className='w-6 h-6' />}>
// 								{balance ? Number.parseFloat(balance).toLocaleString(undefined, {maximumFractionDigits: 4}) : '0.0000'} USDT
// 							</Chip>
// 						)}
// 					</div>
// 				</CardBody>
// 			</Card>

// 			<Tabs selectedKey={selectedTab} onSelectionChange={key => setSelectedTab(key as string)} className='w-full' classNames={{...TabsClass, tabList: 'gap-2 w-full', tab: 'w-full'}}>
// 				<Tab key='purchase' title={tIdo('tabs.purchase')}>
// 					<div className='mt-4'>
// 						{inviteAccepted ? (
// 							<Card className='mb-6 border border-success/40 bg-success/10 shadow-lg'>
// 								<CardBody className='flex items-center justify-between gap-4'>
// 									<div className='flex items-center gap-3'>
// 										<div className='p-3 rounded-xl bg-success/20 border border-success/30'>
// 											<Icon icon='mdi:shield-check' className='w-6 h-6 text-success' />
// 										</div>
// 										<div>
// 											<p className='text-base font-semibold text-success'>{tIdo('invite.title')}</p>
// 											<p className='text-sm text-default-700'>{tIdo('invite.success')}</p>
// 										</div>
// 									</div>
// 									<Chip color='success' variant='flat' className='font-mono tracking-widest font-semibold px-4'>
// 										{inviteCode}
// 									</Chip>
// 								</CardBody>
// 							</Card>
// 						) : (
// 							<Card className='mb-6 border border-primary/30 bg-content1/80 shadow-xl'>
// 								<CardBody className='space-y-4'>
// 									<div className='flex items-center gap-3'>
// 										<div className='p-3 rounded-xl bg-primary/10 border border-primary/20'>
// 											<Icon icon='mdi:key-variant' className='w-6 h-6 text-primary' />
// 										</div>
// 										<div>
// 											<p className='text-base font-semibold text-primary'>{tIdo('invite.title')}</p>
// 											<p className='text-sm text-default-500'>{tIdo('invite.description')}</p>
// 										</div>
// 									</div>
// 									<InputOtp value={inviteCode} onValueChange={setInviteCode} length={6} size='lg' variant='bordered' isInvalid={inviteError} aria-label={tIdo('invite.ariaLabel')} classNames={InputOtpClass} />
// 									<div className='text-sm'>
// 										{inviteError && <p className='text-danger font-medium'>{tIdo('invite.error')}</p>}
// 										{!inviteCompleted && !inviteAccepted && <p className='text-default-500'>{tIdo('invite.placeholder')}</p>}
// 									</div>
// 								</CardBody>
// 							</Card>
// 						)}

// 						{inviteAccepted && donatedTier && (
// 							<Card className='mb-6 border border-success/40 bg-success/10 shadow-md'>
// 								<CardBody className='flex items-center gap-3 text-success'>
// 									<div className='p-2 rounded-full bg-success/20'>
// 										<Icon icon='mdi:check-decagram' className='w-6 h-6' />
// 									</div>
// 									<div className='flex gap-2 items-center'>
// 										<p className='text-sm uppercase tracking-wide font-semibold'>{tIdo('labels.already_subscribed')}:</p>
// 										<p className='text-base font-bold'>{tIdo(`tiers.${donatedTier === 'global' ? 'super' : donatedTier === 'regional' ? 'regional' : 'community'}.name`)}</p>
// 									</div>
// 								</CardBody>
// 							</Card>
// 						)}

// 						{inviteAccepted && (
// 							<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
// 								{tierConfigs.map(tier => {
// 									const currentTier = donatedTier;
// 									const currentRank = currentTier ? TIER_PRIORITY[currentTier] : -1;
// 									const targetRank = TIER_PRIORITY[tier.id];
// 									// 如果当前等级已经达到或超过目标等级，则禁用（不能降级或购买相同等级）
// 									const disabledByRank = currentRank >= targetRank;
// 									const isTierLoading = pendingTier === tier.id && loading;
// 									const requiredAmount = getRequiredAmount(tier.id);
// 									const requiredWei = requiredAmount > 0 ? parseUnits(requiredAmount.toString(), DONATION_TOKEN_DECIMALS) : 0n;
// 									// 检查余额是否不足：需要支付的金额 > 0 且 钱包余额 < 所需金额
// 									const needsPayment = requiredAmount > 0;
// 									const insufficientBalance = needsPayment && walletBalanceWei < requiredWei;
// 									const disabled = !isConnected || (loading && pendingTier !== tier.id) || disabledByRank || insufficientBalance || requiredAmount <= 0;
// 									// 显示升级标签：如果用户已有等级且目标等级更高
// 									const showUpgradeLabel = Boolean(currentTier) && currentRank < targetRank;
// 									return <TierCard key={tier.id} tier={tier} onPurchase={handlePurchase} isLoading={isTierLoading} isDisabled={disabled} showUpgradeLabel={showUpgradeLabel} insufficientBalance={insufficientBalance} />;
// 								})}
// 							</div>
// 						)}
// 					</div>
// 				</Tab>
// 				{isConnected && address && (
// 					<Tab key='my' title={tIdo('tabs.my') || '我的'}>
// 						<MyIDOView userData={userData} donatedTier={donatedTier ?? undefined} tierConfigs={tierConfigs} />
// 					</Tab>
// 				)}
// 			</Tabs>
// 		</div>
// 	);
// }

// // ===== 白名单级别卡片组件 =====
// interface TierCardProps {
// 	tier: WhitelistTierConfig; //配置
// 	onPurchase: (tier: WhitelistTier) => void; //申购
// 	isLoading: boolean;
// 	isDisabled: boolean;
// 	showUpgradeLabel: boolean; //是否显示升级标签
// 	insufficientBalance: boolean; //是否余额不足
// }

// function TierCard({tier, onPurchase, isLoading, isDisabled, showUpgradeLabel, insufficientBalance}: TierCardProps) {
// 	const tIdo = useTranslations('ido');
// 	const tTip = useTranslations('tip');

// 	// 颜色映射：根据 tier.id 获取主色和次色
// 	const colorMap: Record<WhitelistTier, {primary: string; secondary: string; iconColor: string}> = {
// 		global: {primary: 'warning', secondary: 'warning', iconColor: 'warning'},
// 		regional: {primary: 'purple-500', secondary: 'purple-400', iconColor: 'purple-500'},
// 		community: {primary: 'cyan-400', secondary: 'sky-300', iconColor: 'cyan-600'}
// 	};

// 	const colors = colorMap[tier.id] || {primary: 'default', secondary: 'default', iconColor: 'default'};

// 	// 使用模板字符串生成样式类名
// 	const styles = {
// 		gradient: `from-${colors.primary}/20 via-${colors.secondary}/10 to-transparent`,
// 		border: `border-${colors.primary}/40`,
// 		topBar: `from-${colors.primary} via-${colors.secondary}/50 to-transparent`,
// 		iconBg: `from-${colors.primary}/20 to-${colors.secondary}/10`,
// 		iconBorder: `border-${colors.primary}/30`,
// 		hoverGlow: `bg-${colors.primary}/5`,
// 		iconColor: `text-${colors.iconColor}`
// 	};

// 	return (
// 		<Card className={`group relative overflow-hidden transition-all duration-300 border-2 shadow-xl hover:shadow-2xl hover:scale-[1.02] ${styles.border} bg-linear-to-br ${styles.gradient} backdrop-blur-sm`}>
// 			{/* 装饰性背景光效 */}
// 			<div className={`absolute top-0 right-0 w-48 h-48 ${styles.hoverGlow} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
// 			{/* 顶部装饰条 */}
// 			<div className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${styles.topBar}`} />
// 			<CardHeader className='pb-3 relative z-10'>
// 				<div className='flex items-center justify-between w-full'>
// 					<div className='flex items-center gap-4'>
// 						<div className={`p-4 rounded-2xl bg-linear-to-br ${styles.iconBg} border ${styles.iconBorder} shadow-lg`}>
// 							<Icon icon={tier.icon} className={`w-8 h-8 ${styles.iconColor}`} />
// 						</div>
// 						<div>
// 							<h3 className='font-bold text-xl mb-1'>{tier.name}</h3>
// 							<Chip size='sm' color={tier.color} variant='flat' className='font-bold border border-current/30'>
// 								{tier.level}
// 							</Chip>
// 						</div>
// 					</div>
// 				</div>
// 			</CardHeader>
// 			<CardBody className='space-y-4 relative z-10'>
// 				<p className={`text-sm leading-relaxed ${tier.id === 'community' ? 'text-primary-foreground font-medium' : 'text-default-600'}`}>{tier.description}</p>
// 				{tier.benefits && <div className='p-3 rounded-lg bg-content1/60 border border-primary-border/60 text-sm text-primary-foreground'>{tier.benefits}</div>}

// 				<Divider className='bg-default-200' />

// 				{/* 关键信息 - 使用卡片样式 */}
// 				<div className='space-y-3'>
// 					<div className={`flex justify-between items-center p-3 rounded-lg border transition-colors ${tier.id === 'community' ? 'bg-white/70 dark:bg-content1/80 border-cyan-300/40 hover:bg-white/90 dark:hover:bg-content1' : 'bg-content1/50 border-primary-border/50 hover:bg-content1'}`}>
// 						<div className='flex items-center gap-2'>
// 							<Icon icon='mdi:currency-usd' className={`w-4 h-4 ${tier.id === 'community' ? 'text-cyan-600' : 'text-default-400'}`} />
// 							<span className={`text-sm ${tier.id === 'community' ? 'text-primary-foreground font-medium' : 'text-primary-foreground'}`}>{tIdo('fields.donation')}</span>
// 						</div>
// 						<span className='font-bold text-xl text-primary-foreground'>${tier.donationAmount}</span>
// 					</div>
// 					<div className={`flex justify-between items-center p-3 rounded-lg border transition-colors ${tier.id === 'community' ? 'bg-white/70 dark:bg-content1/80 border-cyan-300/40 hover:bg-white/90 dark:hover:bg-content1' : 'bg-content1/50 border-primary-border/50 hover:bg-content1'}`}>
// 						<div className='flex items-center gap-2'>
// 							<Icon icon='mdi:coin' className={`w-4 h-4 ${tier.id === 'community' ? 'text-cyan-600' : 'text-default-400'}`} />
// 							<span className={`text-sm ${tier.id === 'community' ? 'text-primary-foreground font-medium' : 'text-primary-foreground'}`}>{tIdo('fields.token_amount')}</span>
// 						</div>
// 						<span className='font-semibold text-lg text-primary-foreground'>${tier.tokenAmount}</span>
// 					</div>
// 					<div className='grid grid-cols-2 gap-2'>
// 						<div className={`flex justify-between items-center p-2 rounded-lg ${tier.id === 'community' ? 'bg-white/60 dark:bg-content1/70 border border-cyan-200/30' : 'bg-content1/30'}`}>
// 							<span className={`text-xs ${tier.id === 'community' ? 'text-primary-foreground' : 'text-primary-foreground'}`}>{tIdo('fields.release_period')}</span>
// 							<span className='font-semibold text-sm text-primary-foreground'>{tIdo('fields.release_value', {value: tier.releaseMonths})}</span>
// 						</div>
// 						<div className={`flex justify-between items-center p-2 rounded-lg ${tier.id === 'community' ? 'bg-white/60 dark:bg-content1/70 border border-cyan-200/30' : 'bg-content1/30'}`}>
// 							<span className={`text-xs ${tier.id === 'community' ? 'text-primary-foreground' : 'text-primary-foreground'}`}>{tIdo('fields.fee_share')}</span>
// 							<span className='font-semibold text-sm text-primary-foreground'>{tIdo('fields.fee_value', {value: tier.feeShare})}</span>
// 						</div>
// 					</div>
// 				</div>

// 				<Divider className='bg-default-200' />

// 				{/* 要求列表 */}
// 				<div className='space-y-2'>
// 					<p className={`text-xs font-semibold mb-2 flex items-center gap-2 ${tier.id === 'community' ? 'text-primary-foreground' : 'text-primary-foreground'}`}>
// 						<Icon icon='mdi:check-circle-outline' className={`w-4 h-4 ${tier.id === 'community' ? 'text-cyan-600' : ''}`} />
// 						{tIdo('fields.requirements')}
// 					</p>
// 					{tier.requirements.map((req, index) => (
// 						<div key={index} className={`flex items-start gap-2 text-xs p-2 rounded-lg transition-colors ${tier.id === 'community' ? 'bg-white/60 dark:bg-content1/70 border border-cyan-200/30 hover:bg-white/80 dark:hover:bg-content1 text-primary-foreground' : 'bg-default-50/50 hover:bg-default-100/50 text-default-600'}`}>
// 							<Icon icon='mdi:check' className={`w-3 h-3 shrink-0 mt-0.5 ${tier.id === 'community' ? 'text-cyan-600' : 'text-success'}`} />
// 							<span className='leading-relaxed'>{req}</span>
// 						</div>
// 					))}
// 				</div>

// 				{/* 购买按钮 */}
// 				<Button
// 					isLoading={isLoading}
// 					isDisabled={isDisabled}
// 					color={tier.color}
// 					variant='solid'
// 					className={`w-full font-bold shadow-lg hover:shadow-xl transition-all ${tier.id === 'community' ? 'bg-linear-to-r from-cyan-500 to-sky-400 text-primary-foreground' : tier.id === 'regional' ? 'bg-linear-to-r from-purple-500 to-purple-400 text-primary-foreground' : tier.id === 'global' ? 'bg-warning text-warning-foreground hover:bg-warning/90' : ''}`}
// 					size='lg'
// 					onPress={() => onPurchase(tier.id)}
// 					startContent={<Icon icon='mdi:cart' className='w-5 h-5' />}>
// 					{insufficientBalance ? tTip('insufficient_balance') : showUpgradeLabel ? tIdo('labels.upgrade_purchase') : tIdo('buttons.buy_now')}
// 				</Button>
// 			</CardBody>
// 		</Card>
// 	);
// }

// // ===== 我的 IDO 视图组件 =====
// function MyIDOView({userData, donatedTier, tierConfigs}: {userData: {idoAmount: number} | null; donatedTier: WhitelistTier | undefined; tierConfigs: WhitelistTierConfig[]}) {
// 	const tIdo = useTranslations('ido');
// 	const {address, isConnected} = useAppKitAccount();

// 	const [referrals, setReferrals] = useState<any[]>([]);
// 	const [loadingReferrals, setLoadingReferrals] = useState(false);
// 	const [userFullData, setUserFullData] = useState<any>(null);

// 	// 获取用户完整数据（包括 ido_performance）
// 	useEffect(() => {
// 		if (!address || !isConnected) return;
// 		const fetchUserFullData = async () => {
// 			try {
// 				// 从 neurafi_account 表获取数据
// 				const result = await getAccountDataFromNeurafi(address);
// 				if (result.success && result.data) {
// 					setUserFullData(result.data);
// 				}
// 			} catch (error) {
// 				console.error('Failed to fetch user full data', error);
// 			}
// 		};
// 		fetchUserFullData();
// 	}, [address, isConnected]);

// 	// 获取直接下线列表
// 	useEffect(() => {
// 		if (!address || !isConnected) return;
// 		const fetchReferrals = async () => {
// 			setLoadingReferrals(true);
// 			try {
// 				const result = await getDirectReferralsByAddressFromNeurafi(address);
// 				if (result.success && result.data) {
// 					setReferrals(result.data);
// 				}
// 			} catch (error) {
// 				console.error('Failed to fetch referrals', error);
// 			} finally {
// 				setLoadingReferrals(false);
// 			}
// 		};
// 		fetchReferrals();
// 	}, [address, isConnected]);

// 	const currentTierConfig = donatedTier ? tierConfigs.find(t => t.id === donatedTier) : null;
// 	const idoPerformance = Number(userFullData?.ido_performance ?? 0);

// 	return (
// 		<div className='mt-4 space-y-6'>
// 			{/* 已申购卡片 */}
// 			{currentTierConfig && (
// 				<Card className='border-2 border-success/40 bg-success/10 shadow-lg'>
// 					<CardHeader>
// 						<div className='flex items-center gap-3'>
// 							<div className='p-3 rounded-xl bg-success/20 border border-success/30'>
// 								<Icon icon='mdi:check-decagram' className='w-6 h-6 text-success' />
// 							</div>
// 							<div>
// 								<h3 className='text-lg font-bold text-success'>{tIdo('my.subscribed_tier') || '已申购'}</h3>
// 								<p className='text-sm text-success/80'>{currentTierConfig.name}</p>
// 							</div>
// 						</div>
// 					</CardHeader>
// 					<CardBody>
// 						<div className='space-y-3'>
// 							<div className='flex justify-between items-center p-3 rounded-lg bg-content1/50 border border-success/20'>
// 								<span className='text-sm font-medium'>{tIdo('fields.donation')}</span>
// 								<span className='font-bold text-lg'>${userData?.idoAmount ?? 0}</span>
// 							</div>
// 							<div className='flex justify-between items-center p-3 rounded-lg bg-content1/50 border border-success/20'>
// 								<span className='text-sm font-medium'>{tIdo('fields.token_amount')}</span>
// 								<span className='font-semibold'>${currentTierConfig.tokenAmount}</span>
// 							</div>
// 						</div>
// 					</CardBody>
// 				</Card>
// 			)}

// 			{/* IDO 业绩 */}
// 			<Card className='border border-primary/30 bg-content1/80 shadow-xl'>
// 				<CardHeader>
// 					<div className='flex items-center gap-3'>
// 						<div className='p-3 rounded-xl bg-primary/10 border border-primary/20'>
// 							<Icon icon='mdi:chart-line' className='w-6 h-6 text-primary' />
// 						</div>
// 						<div>
// 							<h3 className='text-lg font-bold'>{tIdo('my.ido_performance') || 'IDO 推荐业绩'}</h3>
// 							<p className='text-sm text-default-500'>{tIdo('my.ido_performance_desc') || '您推荐的用户申购总额'}</p>
// 						</div>
// 					</div>
// 				</CardHeader>
// 				<CardBody>
// 					<div className='p-6 rounded-lg bg-primary/10 border border-primary/20 text-center'>
// 						<p className='text-3xl font-bold text-primary mb-2'>${idoPerformance.toLocaleString()}</p>
// 						<p className='text-sm text-default-600'>{tIdo('my.total_referral_amount') || '累计推荐申购金额'}</p>
// 					</div>
// 				</CardBody>
// 			</Card>

// 			{/* 直接推荐列表 */}
// 			<Card className='border border-secondary/30 bg-content1/80 shadow-xl'>
// 				<CardHeader>
// 					<div className='flex items-center gap-3'>
// 						<div className='p-3 rounded-xl bg-secondary/10 border border-secondary/20'>
// 							<Icon icon='mdi:account-group' className='w-6 h-6 text-secondary' />
// 						</div>
// 						<div>
// 							<h3 className='text-lg font-bold'>{tIdo('my.direct_referrals') || '直接推荐'}</h3>
// 							<p className='text-sm text-default-500'>{tIdo('my.direct_referrals_desc') || '您直接推荐的用户列表'}</p>
// 						</div>
// 					</div>
// 				</CardHeader>
// 				<CardBody></CardBody>
// 			</Card>
// 		</div>
// 	);
// }
