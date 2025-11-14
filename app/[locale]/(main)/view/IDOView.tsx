'use client';
import React from 'react';
import {Card, CardBody, CardHeader, Button, Chip, Divider} from '@heroui/react';
import {Icon} from '@iconify/react';
import {useAppKitAccount} from '@reown/appkit/react';
import {useTranslations} from 'next-intl';

// ===== 类型定义 =====
type WhitelistTier = 'global' | 'regional' | 'community';

interface WhitelistTierConfig {
	id: WhitelistTier;
	name: string;
	description: string;
	benefits?: string;
	donationAmount: number;
	limit: number;
	tokenAmount: number;
	releaseMonths: number;
	feeShare: number;
	level: string;
	requirements: string[];
	icon: string;
	color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

// ===== 募资视图 =====
export function IDOView() {
	const tIdo = useTranslations('ido');
	const {address, isConnected} = useAppKitAccount();

	const tierConfigs = React.useMemo<WhitelistTierConfig[]>(
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
				level: 'V4',
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
				releaseMonths: 6,
				feeShare: 0.5,
				level: 'V3',
				requirements: [tIdo('tiers.regional.requirements.r1'), tIdo('tiers.community.requirements.r1')],
				icon: 'mdi:star',
				color: 'secondary'
			},
			{
				id: 'community',
				name: tIdo('tiers.community.name'),
				description: tIdo('tiers.community.description'),
				benefits: tIdo('tiers.community.benefits'),
				donationAmount: 200,
				limit: 3000,
				tokenAmount: 200,
				releaseMonths: 2,
				feeShare: 0,
				level: 'V2',
				requirements: [tIdo('tiers.community.requirements.r1'), tIdo('tiers.community.requirements.r2')],
				icon: 'mdi:account-group',
				color: 'primary'
			}
		],
		[tIdo]
	);

	const importantNotes = React.useMemo(() => [tIdo('notes.note1'), tIdo('notes.note2'), tIdo('notes.note3')], [tIdo]);

	// 处理购买
	const handlePurchase = (tier: WhitelistTier) => {
		if (!isConnected) {
			// TODO: 提示连接钱包
			console.info('Please connect wallet before purchasing');
		}
		const tierConfig = tierConfigs.find(t => t.id === tier);
		if (tierConfig) {
			console.info('Purchase requested', {tier: tierConfig.id, donation: tierConfig.donationAmount, address});
		}
	};

	return (
		<div className='h-full w-full flex flex-col p-6 pt-0 overflow-y-auto custom-scrollbar relative'>
			{/* 背景装饰 */}
			<div className='absolute inset-0 overflow-hidden pointer-events-none'>
				<div className='absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl' />
				<div className='absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl' />
			</div>

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
					</div>
				</CardBody>
			</Card>

			{/* 白名单级别卡片 */}
			<div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
				{tierConfigs.map(tier => (
					<TierCard key={tier.id} tier={tier} onPurchase={handlePurchase} />
				))}
			</div>

			{/* 重要提示 */}
			<Card className='border-2 border-warning/40 bg-linear-to-br from-warning/10 via-warning/5 to-transparent shadow-xl relative overflow-hidden'>
				{/* 装饰性背景 */}
				<div className='absolute top-0 right-0 w-64 h-64 bg-warning/5 rounded-full blur-3xl' />
				<CardHeader className='relative z-10'>
					<div className='flex items-center gap-3'>
						<div className='p-2 rounded-lg bg-warning/20 border border-warning/30'>
							<Icon icon='mdi:alert-circle' className='w-6 h-6 text-warning' />
						</div>
						<h3 className='font-bold text-lg text-warning'>{tIdo('notes.title')}</h3>
					</div>
				</CardHeader>
				<CardBody className='relative z-10'>
					<ul className='space-y-3 text-sm'>
						{importantNotes.map(note => (
							<li key={note} className='flex items-start gap-3 p-3 rounded-lg bg-warning/5 border border-warning/10 hover:bg-warning/10 transition-colors'>
								<div className='p-1 rounded-full bg-warning/20 mt-0.5'>
									<Icon icon='mdi:alert' className='w-4 h-4 text-warning' />
								</div>
								<span className='text-default-700 leading-relaxed'>{note}</span>
							</li>
						))}
					</ul>
				</CardBody>
			</Card>
		</div>
	);
}

// ===== 级别卡片组件 =====
interface TierCardProps {
	tier: WhitelistTierConfig;
	onPurchase: (tier: WhitelistTier) => void;
}

function TierCard({tier, onPurchase}: TierCardProps) {
	const tIdo = useTranslations('ido');
	const buyLabel = tIdo('buttons.buy_now');
	const donationLabel = tIdo('fields.donation');
	const tokenLabel = tIdo('fields.token_amount');
	const releaseLabel = tIdo('fields.release_period');
	const releaseValue = tIdo('fields.release_value', {value: tier.releaseMonths});
	const feeLabel = tIdo('fields.fee_share');
	const feeValue = tIdo('fields.fee_value', {value: tier.feeShare});
	const limitLabel = tIdo('fields.limit');
	const limitValue = tIdo('fields.limit_value', {value: tier.limit.toLocaleString()});
	const requirementsLabel = tIdo('fields.requirements');
	// 根据级别设置样式
	const getTierStyles = () => {
		switch (tier.id) {
			case 'global':
				return {
					gradient: 'from-warning/20 via-warning/10 to-transparent',
					border: 'border-warning/40',
					topBar: 'from-warning via-warning/50 to-transparent',
					iconBg: 'from-warning/20 to-warning/10',
					iconBorder: 'border-warning/30',
					hoverGlow: 'bg-warning/5',
					iconColor: 'text-warning'
				};
			case 'regional':
				return {
					gradient: 'from-purple-500/20 via-purple-400/10 to-transparent',
					border: 'border-purple-500/40',
					topBar: 'from-purple-500 via-purple-400/50 to-transparent',
					iconBg: 'from-purple-500/20 to-purple-400/10',
					iconBorder: 'border-purple-500/30',
					hoverGlow: 'bg-purple-500/5',
					iconColor: 'text-purple-500'
				};
			case 'community':
				return {
					gradient: 'from-cyan-400/20 via-sky-300/10 to-transparent',
					border: 'border-cyan-400/40',
					topBar: 'from-cyan-400 via-sky-300/50 to-transparent',
					iconBg: 'from-cyan-400/20 to-sky-300/10',
					iconBorder: 'border-cyan-400/30',
					hoverGlow: 'bg-cyan-400/5',
					iconColor: 'text-cyan-600'
				};
			default:
				return {
					gradient: 'from-default/20 via-default/10 to-transparent',
					border: 'border-default/40',
					topBar: 'from-default via-default/50 to-transparent',
					iconBg: 'from-default/20 to-default/10',
					iconBorder: 'border-default/30',
					hoverGlow: 'bg-default/5',
					iconColor: 'text-default'
				};
		}
	};

	const styles = getTierStyles();

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
								{tier.level}
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
							<span className={`text-sm ${tier.id === 'community' ? 'text-primary-foreground font-medium' : 'text-primary-foreground'}`}>{donationLabel}</span>
						</div>
						<span className='font-bold text-xl text-primary-foreground'>${tier.donationAmount}</span>
					</div>
					<div className={`flex justify-between items-center p-3 rounded-lg border transition-colors ${tier.id === 'community' ? 'bg-white/70 dark:bg-content1/80 border-cyan-300/40 hover:bg-white/90 dark:hover:bg-content1' : 'bg-content1/50 border-primary-border/50 hover:bg-content1'}`}>
						<div className='flex items-center gap-2'>
							<Icon icon='mdi:coin' className={`w-4 h-4 ${tier.id === 'community' ? 'text-cyan-600' : 'text-default-400'}`} />
							<span className={`text-sm ${tier.id === 'community' ? 'text-primary-foreground font-medium' : 'text-primary-foreground'}`}>{tokenLabel}</span>
						</div>
						<span className='font-semibold text-lg text-primary-foreground'>${tier.tokenAmount}</span>
					</div>
					<div className='grid grid-cols-2 gap-2'>
						<div className={`flex justify-between items-center p-2 rounded-lg ${tier.id === 'community' ? 'bg-white/60 dark:bg-content1/70 border border-cyan-200/30' : 'bg-content1/30'}`}>
							<span className={`text-xs ${tier.id === 'community' ? 'text-primary-foreground' : 'text-primary-foreground'}`}>{releaseLabel}</span>
							<span className='font-semibold text-sm text-primary-foreground'>{releaseValue}</span>
						</div>
						<div className={`flex justify-between items-center p-2 rounded-lg ${tier.id === 'community' ? 'bg-white/60 dark:bg-content1/70 border border-cyan-200/30' : 'bg-content1/30'}`}>
							<span className={`text-xs ${tier.id === 'community' ? 'text-primary-foreground' : 'text-primary-foreground'}`}>{feeLabel}</span>
							<span className='font-semibold text-sm text-primary-foreground'>{feeValue}</span>
						</div>
					</div>
					<div className={`flex justify-between items-center p-2 rounded-lg ${tier.id === 'community' ? 'bg-white/60 dark:bg-content1/70 border border-cyan-200/30' : 'bg-content1/30'}`}>
						<span className={`text-xs ${tier.id === 'community' ? 'text-primary-foreground' : 'text-primary-foreground'}`}>{limitLabel}</span>
						<span className='font-semibold text-sm text-primary-foreground'>{limitValue}</span>
					</div>
				</div>

				<Divider className='bg-default-200' />

				{/* 要求列表 */}
				<div className='space-y-2'>
					<p className={`text-xs font-semibold mb-2 flex items-center gap-2 ${tier.id === 'community' ? 'text-primary-foreground' : 'text-primary-foreground'}`}>
						<Icon icon='mdi:check-circle-outline' className={`w-4 h-4 ${tier.id === 'community' ? 'text-cyan-600' : ''}`} />
						{requirementsLabel}
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
					color={tier.color}
					variant='solid'
					className={`w-full font-bold shadow-lg hover:shadow-xl transition-all ${tier.id === 'community' ? 'bg-linear-to-r from-cyan-500 to-sky-400 text-primary-foreground' : tier.id === 'regional' ? 'bg-linear-to-r from-purple-500 to-purple-400 text-primary-foreground' : tier.id === 'global' ? 'bg-warning text-warning-foreground hover:bg-warning/90' : ''}`}
					size='lg'
					onPress={() => onPurchase(tier.id)}
					startContent={<Icon icon='mdi:cart' className='w-5 h-5' />}>
					{buyLabel}
				</Button>
			</CardBody>
		</Card>
	);
}
