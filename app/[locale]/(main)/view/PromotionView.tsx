'use client';
import {useMemo, useState} from 'react';
import {Tabs, Tab, Chip, Avatar, Card, CardBody, CardHeader, Button, Input, Progress, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from '@heroui/react';
import {Icon} from '@iconify/react';
import {useTranslations} from 'next-intl';
import {TabsClass} from '@/components/class';
// ===== Promotion View =====

type SummaryCardKey = 'totalEarnings' | 'referrals' | 'projects' | 'pendingRewards';

interface SummaryCardDefinition {
	key: SummaryCardKey;
	value: string;
	deltaValue?: string;
	deltaColor: 'text-success' | 'text-warning';
	icon: string;
	accent: string;
}

const SUMMARY_CARD_DEFINITIONS: SummaryCardDefinition[] = [
	{key: 'totalEarnings', value: '$12,450', deltaValue: '+15.2%', deltaColor: 'text-success', icon: 'mdi:currency-usd', accent: 'from-primary/20 to-secondary/20'},
	{key: 'referrals', value: '1,234', deltaValue: '+8.5%', deltaColor: 'text-success', icon: 'mdi:account-group', accent: 'from-success/20 to-primary/10'},
	{key: 'projects', value: '89', deltaValue: '+12.3%', deltaColor: 'text-success', icon: 'mdi:rocket-launch', accent: 'from-secondary/20 to-primary/10'},
	{key: 'pendingRewards', value: '$2,180', deltaColor: 'text-warning', icon: 'mdi:gift', accent: 'from-warning/20 to-secondary/10'}
];

type ActivityKey = 'signup' | 'projectBonus' | 'kycBonus';

interface OverviewActivityDefinition {
	key: ActivityKey;
	icon: string;
	amount: number;
}

const OVERVIEW_ACTIVITY_DEFINITIONS: OverviewActivityDefinition[] = [
	{key: 'signup', icon: 'mdi:account-plus', amount: 10},
	{key: 'projectBonus', icon: 'mdi:currency-usd', amount: 50},
	{key: 'kycBonus', icon: 'mdi:check-circle', amount: 20}
];

const PLATFORM_PROFILE = {level: 3, points: 2450, nextLevelPoints: 5000};

const PLATFORM_REWARD_DEFINITIONS = [
	{key: 'signup', amount: '$10'},
	{key: 'firstInvestment', amount: '$50'},
	{key: 'kyc', amount: '$20'}
] as const;

const PLATFORM_BENEFIT_KEYS = ['highCommission', 'exclusiveTools', 'prioritySupport'] as const;

type ProjectKey = 'basketball' | 'artGallery' | 'rwaGold';

interface ProjectDefinition {
	id: string;
	key: ProjectKey;
	logo: string;
	reward: number;
	promotedCount: number;
	totalEarnings: number;
	conversionRate: number;
	successfulReferrals: number;
}

const PROJECT_DEFINITIONS: ProjectDefinition[] = [
	{id: 'project-1', key: 'basketball', logo: '/images/token/erc-721/1.png', reward: 50, promotedCount: 23, totalEarnings: 1150, conversionRate: 15.2, successfulReferrals: 8},
	{id: 'project-2', key: 'artGallery', logo: '/images/token/erc-721/2.png', reward: 30, promotedCount: 15, totalEarnings: 450, conversionRate: 12.8, successfulReferrals: 5},
	{id: 'project-3', key: 'rwaGold', logo: '/images/token/erc-721/3.png', reward: 100, promotedCount: 8, totalEarnings: 800, conversionRate: 18.5, successfulReferrals: 6}
];

type RewardSummaryKey = 'total' | 'pending' | 'claimed';

interface RewardSummaryDefinition {
	key: RewardSummaryKey;
	value: string;
	icon: string;
	color: string;
}

const REWARD_SUMMARY_DEFINITIONS: RewardSummaryDefinition[] = [
	{key: 'total', value: '$12,450', icon: 'mdi:currency-usd', color: 'text-success'},
	{key: 'pending', value: '$2,180', icon: 'mdi:gift', color: 'text-warning'},
	{key: 'claimed', value: '156', icon: 'mdi:check-circle', color: 'text-primary'}
];

type RewardStatus = 'claimed' | 'pending';

interface RewardRecordDefinition {
	key: 'signup' | 'project' | 'kyc' | 'investment';
	icon: string;
	amount: number;
	date: string;
	status: RewardStatus;
}

const REWARD_RECORD_DEFINITIONS: RewardRecordDefinition[] = [
	{key: 'signup', icon: 'mdi:account-plus', amount: 10, date: '2024-01-20', status: 'claimed'},
	{key: 'project', icon: 'mdi:currency-usd', amount: 50, date: '2024-01-19', status: 'claimed'},
	{key: 'kyc', icon: 'mdi:check-circle', amount: 20, date: '2024-01-18', status: 'pending'},
	{key: 'investment', icon: 'mdi:rocket-launch', amount: 100, date: '2024-01-17', status: 'pending'}
];

interface RecentActivity {
	icon: string;
	amount: number;
	title: string;
	description: string;
	time: string;
}

interface OverviewData {
	recentActivities: RecentActivity[];
}

interface PlatformPromotionData {
	level: number;
	points: number;
	nextLevelPoints: number;
	levelName: string;
	rewards: {label: string; amount: string}[];
	benefits: string[];
}

interface PromotionProject extends ProjectDefinition {
	name: string;
	description: string;
	category: string;
}

interface RewardSummaryCard extends RewardSummaryDefinition {
	label: string;
}

interface RewardRecord extends RewardRecordDefinition {
	title: string;
	description: string;
	statusLabel: string;
}

interface RewardsData {
	summaryCards: RewardSummaryCard[];
	records: RewardRecord[];
}

export function PromotionView() {
	const t = useTranslations('promotion');
	const [selectedTab, setSelectedTab] = useState('overview');
	const [selectedProject, setSelectedProject] = useState<string | null>(null);
	const {isOpen, onOpen, onClose} = useDisclosure();

	const summaryCards = useMemo(
		() =>
			SUMMARY_CARD_DEFINITIONS.map(card => ({
				...card,
				label: t(`summary_cards.${card.key}.label`),
				delta: card.deltaValue ? t(`summary_cards.${card.key}.delta`, {value: card.deltaValue}) : t(`summary_cards.${card.key}.delta`)
			})),
		[t]
	);

	const overviewData = useMemo<OverviewData>(
		() => ({
			recentActivities: OVERVIEW_ACTIVITY_DEFINITIONS.map(item => ({
				icon: item.icon,
				amount: item.amount,
				title: t(`overview.activities.${item.key}.title`),
				description: t(`overview.activities.${item.key}.description`),
				time: t(`overview.activities.${item.key}.time`)
			}))
		}),
		[t]
	);

	const platformData = useMemo<PlatformPromotionData>(
		() => ({
			level: PLATFORM_PROFILE.level,
			points: PLATFORM_PROFILE.points,
			nextLevelPoints: PLATFORM_PROFILE.nextLevelPoints,
			levelName: t('platform.level.name'),
			rewards: PLATFORM_REWARD_DEFINITIONS.map(reward => ({
				label: t(`platform.rewards.${reward.key}`),
				amount: reward.amount
			})),
			benefits: PLATFORM_BENEFIT_KEYS.map(key => t(`platform.benefits.${key}`))
		}),
		[t]
	);

	const projects = useMemo<PromotionProject[]>(
		() =>
			PROJECT_DEFINITIONS.map(project => ({
				...project,
				name: t(`projects.items.${project.key}.name`),
				description: t(`projects.items.${project.key}.description`),
				category: t(`projects.items.${project.key}.category`)
			})),
		[t]
	);

	const rewardsData = useMemo<RewardsData>(
		() => ({
			summaryCards: REWARD_SUMMARY_DEFINITIONS.map(card => ({
				...card,
				label: t(`rewards.summary.${card.key}`)
			})),
			records: REWARD_RECORD_DEFINITIONS.map(record => ({
				...record,
				title: t(`rewards.records.${record.key}.title`),
				description: t(`rewards.records.${record.key}.description`),
				statusLabel: t(`rewards.status.${record.status}`)
			}))
		}),
		[t]
	);

	const selectedProjectData = useMemo(() => projects.find(project => project.id === selectedProject) ?? null, [projects, selectedProject]);

	const handleTabChange = (key: React.Key) => {
		setSelectedTab(key as string);
	};

	const handleProjectSelect = (projectId: string) => {
		setSelectedProject(projectId);
		onOpen();
	};

	const handleCloseModal = () => {
		onClose();
		setSelectedProject(null);
	};

	return (
		<div className='h-full w-full flex flex-col p-6 overflow-y-auto bg-linear-to-br from-background via-background/80 to-default-100/40'>
			<div className='mb-6'>
				<h1 className='text-3xl font-bold text-primary-foreground mb-2'>{t('hero.title')}</h1>
				<p className='text-primary-foreground'>{t('hero.subtitle')}</p>
			</div>

			<div className='grid grid-cols-1 gap-6 mb-6 md:grid-cols-4'>
				{summaryCards.map(card => (
					<Card key={card.key} className='rounded-2xl border border-default-200/50 bg-content1/80 shadow-lg backdrop-blur p-4'>
						<CardBody className='p-5'>
							<div className='flex items-center gap-4'>
								<div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br ${card.accent}`}>
									<Icon icon={card.icon} className='h-6 w-6 text-primary' />
								</div>
								<div className='flex-1'>
									<p className='text-xs font-semibold uppercase tracking-wide text-primary-foreground/70'>{card.label}</p>
									<div className='mt-2 flex items-baseline gap-2'>
										<span className='text-2xl font-bold text-primary-foreground'>{card.value}</span>
										<span className={`text-xs font-medium ${card.deltaColor}`}>{card.delta}</span>
									</div>
								</div>
							</div>
						</CardBody>
					</Card>
				))}
			</div>

			<Card className='mb-6 rounded-2xl border border-default-200/50 bg-content1/80 shadow-lg backdrop-blur'>
				<CardHeader>
					<h3 className='text-lg font-semibold'>{t('link.title')}</h3>
					<p className='text-sm text-primary-foreground'>{t('link.subtitle')}</p>
				</CardHeader>
				<CardBody>
					<div className='flex flex-col md:flex-row gap-4'>
						<div className='flex-1'>
							<Input
								label={t('link.input_label')}
								value='https://NeuraFi.com/ref/user123'
								readOnly
								variant='bordered'
								startContent={<Icon icon='mdi:link' className='w-4 h-4 text-primary-foreground' />}
								endContent={
									<Button size='sm' variant='bordered' startContent={<Icon icon='mdi:content-copy' className='w-4 h-4' />}>
										{t('buttons.copy')}
									</Button>
								}
							/>
						</div>
						<div className='flex gap-2'>
							<Button color='primary' startContent={<Icon icon='mdi:share' className='w-4 h-4' />}>
								{t('buttons.share')}
							</Button>
							<Button variant='bordered' startContent={<Icon icon='mdi:qrcode' className='w-4 h-4' />}>
								{t('buttons.qr')}
							</Button>
						</div>
					</div>
				</CardBody>
			</Card>

			<div className='w-full rounded-2xl border border-default-200/50 bg-content1/70 p-4 shadow-lg backdrop-blur'>
				<Tabs selectedKey={selectedTab} onSelectionChange={handleTabChange} variant='underlined' classNames={TabsClass}>
					<Tab key='overview' title={t('tabs.overview')}>
						<div className='py-4'>
							<OverviewTab data={overviewData} />
						</div>
					</Tab>
					<Tab key='platform' title={t('tabs.platform')}>
						<div className='py-4'>
							<PlatformPromotionTab data={platformData} />
						</div>
					</Tab>
					<Tab key='projects' title={t('tabs.projects')}>
						<div className='py-4'>
							<ProjectPromotionTab projects={projects} onProjectSelect={handleProjectSelect} />
						</div>
					</Tab>
					<Tab key='rewards' title={t('tabs.rewards')}>
						<div className='py-4'>
							<RewardsTab data={rewardsData} />
						</div>
					</Tab>
				</Tabs>
			</div>

			<Modal isOpen={isOpen && Boolean(selectedProjectData)} onClose={handleCloseModal} size='2xl'>
				<ModalContent>
					<ModalHeader>{t('modal.title')}</ModalHeader>
					<ModalBody>{selectedProjectData ? <ProjectDetailModal project={selectedProjectData} /> : null}</ModalBody>
					<ModalFooter>
						<Button variant='ghost' onPress={handleCloseModal}>
							{t('buttons.close')}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
}

// 概览标签页
function OverviewTab({data}: {data: OverviewData}) {
	const t = useTranslations('promotion');

	return (
		<div className='space-y-6'>
			<Card className='rounded-2xl border border-default-200/50 bg-content1/80 shadow-lg backdrop-blur'>
				<CardHeader>
					<h3 className='text-lg font-semibold'>{t('overview.chart.title')}</h3>
					<p className='text-sm text-primary-foreground'>{t('overview.chart.subtitle')}</p>
				</CardHeader>
				<CardBody>
					<div className='h-64 flex items-center justify-center bg-background rounded-lg'>
						<div className='text-center'>
							<Icon icon='mdi:chart-line' className='w-16 h-16 text-default-400 mx-auto mb-4' />
							<p className='text-default-600'>{t('overview.chart.placeholder')}</p>
							<p className='text-sm text-primary-foreground'>{t('overview.chart.description')}</p>
						</div>
					</div>
				</CardBody>
			</Card>

			<Card className='rounded-2xl border border-default-200/50 bg-content1/80 shadow-lg backdrop-blur'>
				<CardHeader>
					<h3 className='text-lg font-semibold'>{t('overview.activities.title')}</h3>
				</CardHeader>
				<CardBody>
					<div className='space-y-4'>
						{data.recentActivities.map((activity, index) => (
							<div key={index} className='flex items-center gap-4 p-3 bg-default-50 rounded-lg'>
								<div className='w-10 h-10 bg-primary rounded-full flex items-center justify-center'>
									<Icon icon={activity.icon} className='w-5 h-5 text-primary-foreground' />
								</div>
								<div className='flex-1'>
									<p className='font-medium'>{activity.title}</p>
									<p className='text-sm text-primary-foreground'>{activity.description}</p>
								</div>
								<div className='text-right'>
									<p className='font-semibold text-success'>+${activity.amount}</p>
									<p className='text-xs text-primary-foreground'>{activity.time}</p>
								</div>
							</div>
						))}
					</div>
				</CardBody>
			</Card>
		</div>
	);
}

// 平台推广标签页
function PlatformPromotionTab({data}: {data: PlatformPromotionData}) {
	const t = useTranslations('promotion');
	const remainingPoints = Math.max(data.nextLevelPoints - data.points, 0);

	return (
		<div className='space-y-6'>
			<Card className='rounded-2xl border border-default-200/50 bg-content1/80 shadow-lg backdrop-blur'>
				<CardHeader>
					<h3 className='text-lg font-semibold'>{t('platform.level.title')}</h3>
					<p className='text-sm text-primary-foreground'>{t('platform.level.subtitle')}</p>
				</CardHeader>
				<CardBody>
					<div className='flex items-center gap-6'>
						<div className='text-center'>
							<div className='w-20 h-20 bg-linear-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-2'>
								<Icon icon='mdi:crown' className='w-10 h-10 text-primary-foreground' />
							</div>
							<p className='font-semibold'>{data.levelName}</p>
							<p className='text-sm text-primary-foreground'>{t('platform.level.tier_label', {level: data.level})}</p>
						</div>
						<div className='flex-1'>
							<div className='flex justify-between text-sm mb-2'>
								<span>{t('platform.level.progress_label')}</span>
								<span>{t('platform.level.progress_value', {current: data.points.toLocaleString(), target: data.nextLevelPoints.toLocaleString()})}</span>
							</div>
							<Progress value={(data.points / data.nextLevelPoints) * 100} color='warning' className='w-full' />
							<p className='text-xs text-primary-foreground mt-2'>{t('platform.level.remaining', {value: remainingPoints.toLocaleString()})}</p>
						</div>
					</div>
				</CardBody>
			</Card>

			<Card className='rounded-2xl border border-default-200/50 bg-content1/80 shadow-lg backdrop-blur'>
				<CardHeader>
					<h3 className='text-lg font-semibold'>{t('platform.rewards_title')}</h3>
				</CardHeader>
				<CardBody>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div>
							<div className='space-y-2'>
								{data.rewards.map(reward => (
									<div key={reward.label} className='flex justify-between'>
										<span className='text-sm'>{reward.label}</span>
										<span className='font-medium'>{reward.amount}</span>
									</div>
								))}
							</div>
						</div>
						<div>
							<h4 className='font-semibold mb-3'>{t('platform.benefits_title')}</h4>
							<div className='space-y-2'>
								{data.benefits.map(benefit => (
									<div key={benefit} className='flex items-center gap-2'>
										<Icon icon='mdi:check' className='w-4 h-4 text-success' />
										<span className='text-sm'>{benefit}</span>
									</div>
								))}
							</div>
						</div>
					</div>
				</CardBody>
			</Card>
		</div>
	);
}

// 项目推广标签页
function ProjectPromotionTab({projects, onProjectSelect}: {projects: PromotionProject[]; onProjectSelect: (projectId: string) => void}) {
	const t = useTranslations('promotion');

	return (
		<div className='space-y-6'>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{projects.map(project => (
					<Card key={project.id} className='rounded-2xl border border-default-200/50 bg-content1/80 shadow-lg transition-shadow duration-300 hover:shadow-2xl'>
						<CardHeader className='pb-2'>
							<div className='flex items-center gap-3'>
								<Avatar src={project.logo} className='w-12 h-12' fallback={<Icon icon='mdi:folder' className='w-6 h-6' />} />
								<div>
									<h4 className='font-semibold'>{project.name}</h4>
									<Chip size='sm' color='primary' variant='flat'>
										{project.category}
									</Chip>
								</div>
							</div>
						</CardHeader>
						<CardBody className='pt-0'>
							<p className='text-sm text-default-600 mb-4 line-clamp-2'>{project.description}</p>

							<div className='space-y-2 mb-4'>
								<div className='flex justify-between text-sm'>
									<span className='text-default-600'>{t('projects.labels.reward')}</span>
									<span className='font-medium text-success'>${project.reward}</span>
								</div>
								<div className='flex justify-between text-sm'>
									<span className='text-default-600'>{t('projects.labels.promoted')}</span>
									<span className='font-medium'>{t('projects.labels.times', {count: project.promotedCount})}</span>
								</div>
								<div className='flex justify-between text-sm'>
									<span className='text-default-600'>{t('projects.labels.total_earnings')}</span>
									<span className='font-medium'>${project.totalEarnings}</span>
								</div>
							</div>

							<Button color='primary' variant='flat' size='sm' className='w-full' onPress={() => onProjectSelect(project.id)} startContent={<Icon icon='mdi:eye' className='w-4 h-4' />}>
								{t('buttons.view_details')}
							</Button>
						</CardBody>
					</Card>
				))}
			</div>
		</div>
	);
}

// 奖励记录标签页
function RewardsTab({data}: {data: RewardsData}) {
	const t = useTranslations('promotion');

	return (
		<div className='space-y-6'>
			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				{data.summaryCards.map(card => (
					<Card key={card.key} className='rounded-2xl border border-default-200/50 bg-content1/80 shadow-lg backdrop-blur'>
						<CardBody className='text-center'>
							<Icon icon={card.icon} className={`w-12 h-12 mx-auto mb-2 ${card.color}`} />
							<p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
							<p className='text-sm text-primary-foreground'>{card.label}</p>
						</CardBody>
					</Card>
				))}
			</div>

			<Card className='rounded-2xl border border-default-200/50 bg-content1/80 shadow-lg backdrop-blur'>
				<CardHeader>
					<h3 className='text-lg font-semibold'>{t('rewards.records_title')}</h3>
				</CardHeader>
				<CardBody>
					<div className='space-y-4'>
						{data.records.map(record => (
							<div key={record.key} className='flex items-center justify-between p-4 border border-default-200/60 rounded-lg'>
								<div className='flex items-center gap-4'>
									<div className='w-10 h-10 bg-success rounded-full flex items-center justify-center'>
										<Icon icon={record.icon} className='w-5 h-5 text-primary-foreground' />
									</div>
									<div>
										<p className='font-medium'>{record.title}</p>
										<p className='text-sm text-primary-foreground'>{record.description}</p>
									</div>
								</div>
								<div className='text-right'>
									<p className='font-semibold text-success'>+${record.amount}</p>
									<p className='text-xs text-primary-foreground'>{record.date}</p>
									<Chip size='sm' color={record.status === 'claimed' ? 'success' : 'warning'} variant='flat'>
										{record.statusLabel}
									</Chip>
								</div>
							</div>
						))}
					</div>
				</CardBody>
			</Card>
		</div>
	);
}

// 项目详情弹窗
function ProjectDetailModal({project}: {project: PromotionProject}) {
	const t = useTranslations('promotion');

	return (
		<div className='space-y-6'>
			<div className='flex items-center gap-4'>
				<Avatar src={project.logo} className='w-16 h-16' />
				<div>
					<h3 className='text-xl font-semibold'>{project.name}</h3>
					<p className='text-default-600'>{project.description}</p>
				</div>
			</div>

			<div className='grid grid-cols-2 gap-4'>
				<div className='text-center p-4 bg-primary-50 rounded-lg'>
					<p className='text-2xl font-bold text-primary'>${project.reward}</p>
					<p className='text-sm text-default-600'>{t('modal.stats.reward')}</p>
				</div>
				<div className='text-center p-4 bg-success-50 rounded-lg'>
					<p className='text-2xl font-bold text-success'>${project.totalEarnings}</p>
					<p className='text-sm text-default-600'>{t('modal.stats.total')}</p>
				</div>
			</div>

			<div>
				<h4 className='font-semibold mb-3'>{t('modal.link_title')}</h4>
				<Input
					value={`https://NeuraFi.com/project/${project.id}/ref/user123`}
					readOnly
					endContent={
						<Button size='sm' variant='bordered' startContent={<Icon icon='mdi:content-copy' className='w-4 h-4' />}>
							{t('buttons.copy')}
						</Button>
					}
				/>
			</div>

			<div>
				<h4 className='font-semibold mb-3'>{t('modal.stats_title')}</h4>
				<div className='grid grid-cols-3 gap-4 text-center'>
					<div>
						<p className='text-lg font-semibold'>{project.promotedCount}</p>
						<p className='text-sm text-default-600'>{t('modal.stats.promoted')}</p>
					</div>
					<div>
						<p className='text-lg font-semibold'>{project.conversionRate}%</p>
						<p className='text-sm text-default-600'>{t('modal.stats.conversion')}</p>
					</div>
					<div>
						<p className='text-lg font-semibold'>{project.successfulReferrals}</p>
						<p className='text-sm text-default-600'>{t('modal.stats.referrals')}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
