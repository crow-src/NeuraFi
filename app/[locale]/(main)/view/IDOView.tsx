'use client';
import React, {useState, useEffect, useMemo} from 'react';
import {useSearchParams} from 'next/navigation';
import {Card, CardBody, CardHeader, Button, Input, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Divider} from '@heroui/react';
import {Icon} from '@iconify/react';
import {useAppKitAccount} from '@reown/appkit/react';
import {useTranslations} from 'next-intl';

// ===== 类型定义 =====
type WhitelistTier = 'global' | 'regional' | 'community';

interface WhitelistTierConfig {
	id: WhitelistTier;
	name: string;
	description: string;
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

// ===== 白名单配置 =====
const whitelistTiers: WhitelistTierConfig[] = [
	{
		id: 'global',
		name: '全球大使',
		description: '顶级社区领袖，享受最高级别待遇',
		donationAmount: 5000,
		limit: 100,
		tokenAmount: 6000,
		releaseMonths: 12,
		feeShare: 0.5,
		level: 'V4',
		requirements: ['1000人以上顶级大社区', '必须线下考核沟通', '申请同意才能购买', '直接购买无效'],
		icon: 'mdi:crown',
		color: 'warning'
	},
	{
		id: 'regional',
		name: '区域大使',
		description: '区域社区负责人，享受高级别待遇',
		donationAmount: 1000,
		limit: 1000,
		tokenAmount: 1200,
		releaseMonths: 6,
		feeShare: 0.5,
		level: 'V3',
		requirements: ['200人以上社区长', '线下申请同意才能购买', '直接购买无效'],
		icon: 'mdi:star',
		color: 'secondary'
	},
	{
		id: 'community',
		name: '小社区',
		description: '社区成员，需要推荐码购买',
		donationAmount: 200,
		limit: 3000,
		tokenAmount: 200,
		releaseMonths: 2,
		feeShare: 0,
		level: 'V2',
		requirements: ['有全球大使或区域大使推荐码', '直接购买无效'],
		icon: 'mdi:account-group',
		color: 'primary' // 使用 primary，但样式会改为浅蓝色
	}
];

// ===== 募资视图 =====
export function IDOView() {
	const t = useTranslations('user');
	const searchParams = useSearchParams();
	const {address, isConnected} = useAppKitAccount();

	const [referralCode, setReferralCode] = useState('');
	const [isReferralBound, setIsReferralBound] = useState(false);
	const [boundReferrer, setBoundReferrer] = useState<string | null>(null);
	const [selectedTier, setSelectedTier] = useState<WhitelistTier | null>(null);
	const [purchaseAmount, setPurchaseAmount] = useState('');

	const {isOpen: isPurchaseOpen, onOpen: onPurchaseOpen, onClose: onPurchaseClose} = useDisclosure();
	const {isOpen: isReferralOpen, onOpen: onReferralOpen, onClose: onReferralClose} = useDisclosure();

	// 绑定推荐关系
	const handleBindReferral = (code: string) => {
		if (!code.trim()) return;
		// TODO: 调用API验证推荐码
		setIsReferralBound(true);
		setBoundReferrer(code);
		setReferralCode(code);
		onReferralClose();
	};

	// 从URL参数获取推荐码
	useEffect(() => {
		const refCode = searchParams.get('ref');
		if (refCode) {
			setReferralCode(refCode);
			handleBindReferral(refCode);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams]);

	// 处理购买
	const handlePurchase = (tier: WhitelistTier) => {
		if (!isConnected) {
			// TODO: 提示连接钱包
			return;
		}
		setSelectedTier(tier);
		const tierConfig = whitelistTiers.find(t => t.id === tier);
		setPurchaseAmount(tierConfig?.donationAmount.toString() ?? '');
		onPurchaseOpen();
	};

	// 确认购买
	const handleConfirmPurchase = () => {
		// TODO: 调用购买API
		// 提示：需要被同意才能购买，未通过会惩罚性扣款2%
		onPurchaseClose();
	};

	const selectedTierConfig = useMemo(() => {
		return selectedTier ? whitelistTiers.find(t => t.id === selectedTier) : null;
	}, [selectedTier]);

	return (
		<div className='h-full w-full flex flex-col p-6 pt-0 overflow-y-auto custom-scrollbar relative'>
			{/* 背景装饰 */}
			<div className='absolute inset-0 overflow-hidden pointer-events-none'>
				<div className='absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl' />
				<div className='absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl' />
			</div>

			{/* 头部信息 */}
			<Card className='mb-6 relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-content1 via-content1 to-default-100/50'>
				{/* 装饰性渐变条 */}
				<div className='absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-warning' />
				<CardBody className='p-6'>
					<div className='flex flex-col md:flex-row gap-4 items-center justify-between relative z-10'>
						<div className='flex-1'>
							<div className='flex items-center gap-3 mb-3'>
								<div className='p-3 rounded-xl bg-content1 border border-default-200 shadow-md'>
									<Icon icon='mdi:rocket-launch' className='w-8 h-8 text-primary' />
								</div>
								<div>
									<h1 className='text-3xl font-bold text-foreground mb-1 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text'>元智项目 IDO 白名单</h1>
									<p className='text-sm text-default-500 flex items-center gap-2'>
										<Icon icon='mdi:shield-check' className='w-4 h-4' />
										通过推荐关系绑定，参与项目早期募资
									</p>
								</div>
							</div>
						</div>
						{/* 推荐关系状态 */}
						<div className='flex items-center gap-3'>
							{isReferralBound ? (
								<Chip color='success' variant='flat' className='shadow-lg border border-success/30' startContent={<Icon icon='mdi:check-circle' className='w-4 h-4' />}>
									已绑定推荐关系
								</Chip>
							) : (
								<Button color='primary' variant='solid' className='shadow-lg bg-gradient-to-r from-primary to-secondary' onPress={onReferralOpen} startContent={<Icon icon='mdi:link-variant' className='w-4 h-4' />}>
									绑定推荐关系
								</Button>
							)}
						</div>
					</div>
					{boundReferrer && (
						<div className='mt-4 p-4 bg-gradient-to-r from-success/10 via-success/5 to-transparent rounded-xl border border-success/30 shadow-md relative overflow-hidden'>
							<div className='absolute top-0 right-0 w-32 h-32 bg-success/5 rounded-full blur-2xl' />
							<div className='flex items-center gap-3 text-sm relative z-10'>
								<div className='p-2 rounded-lg bg-success/20'>
									<Icon icon='mdi:information' className='w-5 h-5 text-success' />
								</div>
								<div>
									<p className='text-xs text-default-500 mb-1'>推荐码</p>
									<p className='font-mono font-bold text-success text-lg'>{boundReferrer}</p>
								</div>
							</div>
						</div>
					)}
				</CardBody>
			</Card>

			{/* 白名单级别卡片 */}
			<div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
				{whitelistTiers.map(tier => (
					<TierCard key={tier.id} tier={tier} onPurchase={handlePurchase} isReferralBound={isReferralBound} />
				))}
			</div>

			{/* 重要提示 */}
			<Card className='border-2 border-warning/40 bg-gradient-to-br from-warning/10 via-warning/5 to-transparent shadow-xl relative overflow-hidden'>
				{/* 装饰性背景 */}
				<div className='absolute top-0 right-0 w-64 h-64 bg-warning/5 rounded-full blur-3xl' />
				<CardHeader className='relative z-10'>
					<div className='flex items-center gap-3'>
						<div className='p-2 rounded-lg bg-warning/20 border border-warning/30'>
							<Icon icon='mdi:alert-circle' className='w-6 h-6 text-warning' />
						</div>
						<h3 className='font-bold text-lg text-warning'>重要提示</h3>
					</div>
				</CardHeader>
				<CardBody className='relative z-10'>
					<ul className='space-y-3 text-sm'>
						<li className='flex items-start gap-3 p-3 rounded-lg bg-warning/5 border border-warning/10 hover:bg-warning/10 transition-colors'>
							<div className='p-1 rounded-full bg-warning/20 mt-0.5'>
								<Icon icon='mdi:alert' className='w-4 h-4 text-warning' />
							</div>
							<span className='text-default-700 leading-relaxed'>购买前需要被同意才能购买，核对未通过乱购买的，将惩罚性扣款2%，余款原路退回</span>
						</li>
						<li className='flex items-start gap-3 p-3 rounded-lg bg-warning/5 border border-warning/10 hover:bg-warning/10 transition-colors'>
							<div className='p-1 rounded-full bg-warning/20 mt-0.5'>
								<Icon icon='mdi:file-document-edit' className='w-4 h-4 text-warning' />
							</div>
							<span className='text-default-700 leading-relaxed'>全球大使和区域大使需要线下申请，直接购买无效</span>
						</li>
						<li className='flex items-start gap-3 p-3 rounded-lg bg-warning/5 border border-warning/10 hover:bg-warning/10 transition-colors'>
							<div className='p-1 rounded-full bg-warning/20 mt-0.5'>
								<Icon icon='mdi:key-variant' className='w-4 h-4 text-warning' />
							</div>
							<span className='text-default-700 leading-relaxed'>小社区需要推荐码才能购买，请先绑定推荐关系</span>
						</li>
					</ul>
				</CardBody>
			</Card>

			{/* 绑定推荐关系弹窗 */}
			<Modal isOpen={isReferralOpen} onClose={onReferralClose} size='md'>
				<ModalContent>
					<ModalHeader>绑定推荐关系</ModalHeader>
					<ModalBody>
						<div className='space-y-4'>
							<p className='text-sm text-default-500'>请输入推荐码以绑定推荐关系</p>
							<Input placeholder='请输入推荐码' value={referralCode} onValueChange={setReferralCode} startContent={<Icon icon='mdi:key-variant' className='w-4 h-4 text-default-400' />} />
							<div className='p-3 bg-default-100 rounded-lg'>
								<p className='text-xs text-default-500'>绑定推荐关系后，您将可以参与小社区级别的IDO购买</p>
							</div>
						</div>
					</ModalBody>
					<ModalFooter>
						<Button variant='light' onPress={onReferralClose}>
							取消
						</Button>
						<Button color='primary' onPress={() => handleBindReferral(referralCode)}>
							确认绑定
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			{/* 购买确认弹窗 */}
			<Modal isOpen={isPurchaseOpen} onClose={onPurchaseClose} size='lg'>
				<ModalContent>
					<ModalHeader>确认购买</ModalHeader>
					<ModalBody>
						{selectedTierConfig && (
							<div className='space-y-4'>
								{/* 级别信息 */}
								<Card className='border-2' style={{borderColor: `var(--${selectedTierConfig.color})`}}>
									<CardBody>
										<div className='flex items-center gap-3 mb-3'>
											<Icon icon={selectedTierConfig.icon} className={`w-8 h-8 text-${selectedTierConfig.color}`} />
											<div>
												<h3 className='font-bold text-lg'>{selectedTierConfig.name}</h3>
												<Chip size='sm' color={selectedTierConfig.color} variant='flat'>
													{selectedTierConfig.level}
												</Chip>
											</div>
										</div>
										<Divider className='my-3' />
										<div className='grid grid-cols-2 gap-3 text-sm'>
											<div>
												<span className='text-default-500'>捐赠金额</span>
												<p className='font-semibold text-lg'>${selectedTierConfig.donationAmount} USDT</p>
											</div>
											<div>
												<span className='text-default-500'>获得筹码</span>
												<p className='font-semibold text-lg'>${selectedTierConfig.tokenAmount} USDT</p>
											</div>
											<div>
												<span className='text-default-500'>释放周期</span>
												<p className='font-semibold'>{selectedTierConfig.releaseMonths} 个月</p>
											</div>
											<div>
												<span className='text-default-500'>手续费分配</span>
												<p className='font-semibold'>{selectedTierConfig.feeShare}%</p>
											</div>
										</div>
									</CardBody>
								</Card>

								{/* 警告提示 */}
								<div className='p-4 bg-warning/10 border border-warning/30 rounded-lg'>
									<div className='flex items-start gap-2'>
										<Icon icon='mdi:alert-circle' className='w-5 h-5 text-warning flex-shrink-0 mt-0.5' />
										<div className='text-sm text-warning-600'>
											<p className='font-semibold mb-1'>重要提示：</p>
											<p>购买前需要被同意才能购买。如果核对未通过而乱购买，将惩罚性扣款2%，余款原路退回。</p>
										</div>
									</div>
								</div>

								{/* 要求说明 */}
								<div className='space-y-2'>
									<p className='text-sm font-semibold'>购买要求：</p>
									<ul className='space-y-1 text-sm text-default-600'>
										{selectedTierConfig.requirements.map((req, index) => (
											<li key={index} className='flex items-start gap-2'>
												<Icon icon='mdi:check-circle' className='w-4 h-4 text-success flex-shrink-0 mt-0.5' />
												<span>{req}</span>
											</li>
										))}
									</ul>
								</div>
							</div>
						)}
					</ModalBody>
					<ModalFooter>
						<Button variant='light' onPress={onPurchaseClose}>
							取消
						</Button>
						<Button color={selectedTierConfig?.color ?? 'primary'} onPress={handleConfirmPurchase} startContent={<Icon icon='mdi:wallet' className='w-4 h-4' />}>
							{isConnected ? '确认购买' : '连接钱包'}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
}

// ===== 级别卡片组件 =====
interface TierCardProps {
	tier: WhitelistTierConfig;
	onPurchase: (tier: WhitelistTier) => void;
	isReferralBound: boolean;
}

function TierCard({tier, onPurchase, isReferralBound}: TierCardProps) {
	const canPurchase = tier.id === 'community' ? isReferralBound : true; // 小社区需要推荐码，其他需要线下申请

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
		<Card className={`group relative overflow-hidden transition-all duration-300 border-2 shadow-xl hover:shadow-2xl hover:scale-[1.02] ${canPurchase ? styles.border : 'border-default-200 opacity-60'} bg-gradient-to-br ${styles.gradient} backdrop-blur-sm`}>
			{/* 装饰性背景光效 */}
			<div className={`absolute top-0 right-0 w-48 h-48 ${styles.hoverGlow} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
			{/* 顶部装饰条 */}
			<div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${styles.topBar}`} />

			<CardHeader className='pb-3 relative z-10'>
				<div className='flex items-center justify-between w-full'>
					<div className='flex items-center gap-4'>
						<div className={`p-4 rounded-2xl bg-gradient-to-br ${styles.iconBg} border ${styles.iconBorder} shadow-lg`}>
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
				<p className={`text-sm leading-relaxed ${tier.id === 'community' ? 'text-foreground font-medium' : 'text-default-600'}`}>{tier.description}</p>

				<Divider className='bg-default-200' />

				{/* 关键信息 - 使用卡片样式 */}
				<div className='space-y-3'>
					<div className={`flex justify-between items-center p-3 rounded-lg border transition-colors ${tier.id === 'community' ? 'bg-white/70 dark:bg-content1/80 border-cyan-300/40 hover:bg-white/90 dark:hover:bg-content1' : 'bg-content1/50 border-default-200/50 hover:bg-content1'}`}>
						<div className='flex items-center gap-2'>
							<Icon icon='mdi:currency-usd' className={`w-4 h-4 ${tier.id === 'community' ? 'text-cyan-600' : 'text-default-400'}`} />
							<span className={`text-sm ${tier.id === 'community' ? 'text-foreground font-medium' : 'text-default-500'}`}>捐赠金额</span>
						</div>
						<span className='font-bold text-xl text-foreground'>${tier.donationAmount}</span>
					</div>
					<div className={`flex justify-between items-center p-3 rounded-lg border transition-colors ${tier.id === 'community' ? 'bg-white/70 dark:bg-content1/80 border-cyan-300/40 hover:bg-white/90 dark:hover:bg-content1' : 'bg-content1/50 border-default-200/50 hover:bg-content1'}`}>
						<div className='flex items-center gap-2'>
							<Icon icon='mdi:coin' className={`w-4 h-4 ${tier.id === 'community' ? 'text-cyan-600' : 'text-default-400'}`} />
							<span className={`text-sm ${tier.id === 'community' ? 'text-foreground font-medium' : 'text-default-500'}`}>获得筹码</span>
						</div>
						<span className='font-semibold text-lg text-foreground'>${tier.tokenAmount}</span>
					</div>
					<div className='grid grid-cols-2 gap-2'>
						<div className={`flex justify-between items-center p-2 rounded-lg ${tier.id === 'community' ? 'bg-white/60 dark:bg-content1/70 border border-cyan-200/30' : 'bg-content1/30'}`}>
							<span className={`text-xs ${tier.id === 'community' ? 'text-foreground' : 'text-default-500'}`}>释放周期</span>
							<span className='font-semibold text-sm text-foreground'>{tier.releaseMonths} 个月</span>
						</div>
						<div className={`flex justify-between items-center p-2 rounded-lg ${tier.id === 'community' ? 'bg-white/60 dark:bg-content1/70 border border-cyan-200/30' : 'bg-content1/30'}`}>
							<span className={`text-xs ${tier.id === 'community' ? 'text-foreground' : 'text-default-500'}`}>手续费</span>
							<span className='font-semibold text-sm text-foreground'>{tier.feeShare}%</span>
						</div>
					</div>
					<div className={`flex justify-between items-center p-2 rounded-lg ${tier.id === 'community' ? 'bg-white/60 dark:bg-content1/70 border border-cyan-200/30' : 'bg-content1/30'}`}>
						<span className={`text-xs ${tier.id === 'community' ? 'text-foreground' : 'text-default-500'}`}>限额</span>
						<span className='font-semibold text-sm text-foreground'>{tier.limit.toLocaleString()} 名</span>
					</div>
				</div>

				<Divider className='bg-default-200' />

				{/* 要求列表 */}
				<div className='space-y-2'>
					<p className={`text-xs font-semibold mb-2 flex items-center gap-2 ${tier.id === 'community' ? 'text-foreground' : 'text-default-500'}`}>
						<Icon icon='mdi:check-circle-outline' className={`w-4 h-4 ${tier.id === 'community' ? 'text-cyan-600' : ''}`} />
						购买要求
					</p>
					{tier.requirements.map((req, index) => (
						<div key={index} className={`flex items-start gap-2 text-xs p-2 rounded-lg transition-colors ${tier.id === 'community' ? 'bg-white/60 dark:bg-content1/70 border border-cyan-200/30 hover:bg-white/80 dark:hover:bg-content1 text-foreground' : 'bg-default-50/50 hover:bg-default-100/50 text-default-600'}`}>
							<Icon icon='mdi:check' className={`w-3 h-3 flex-shrink-0 mt-0.5 ${tier.id === 'community' ? 'text-cyan-600' : 'text-success'}`} />
							<span className='leading-relaxed'>{req}</span>
						</div>
					))}
				</div>

				{/* 购买按钮 */}
				<Button
					color={tier.color}
					variant={canPurchase ? 'solid' : 'bordered'}
					className={`w-full font-bold shadow-lg hover:shadow-xl transition-all ${tier.id === 'community' && canPurchase ? 'bg-gradient-to-r from-cyan-500 to-sky-400 text-white' : tier.id === 'regional' && canPurchase ? 'bg-gradient-to-r from-purple-500 to-purple-400 text-white' : tier.id === 'global' && canPurchase ? 'bg-warning text-warning-foreground hover:bg-warning/90' : ''}`}
					size='lg'
					onPress={() => onPurchase(tier.id)}
					disabled={!canPurchase}
					startContent={<Icon icon='mdi:cart' className='w-5 h-5' />}>
					{canPurchase ? '立即购买' : tier.id === 'community' ? '需要推荐码' : '需要线下申请'}
				</Button>
			</CardBody>
		</Card>
	);
}
