'use client';
import {useState} from 'react';
import {Tabs, Tab, Chip, Avatar, Card, CardBody, CardHeader, Button, Input, Progress, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from '@heroui/react';
import {Icon} from '@iconify/react';
import {TabsClass} from '@/components/class';
// ===== 推荐数据 主视图 =====

export function PromotionView() {
	const [selectedTab, setSelectedTab] = useState('overview');
	const [selectedProject, setSelectedProject] = useState<string | null>(null);
	const {isOpen, onOpen, onClose} = useDisclosure();

	const handleTabChange = (key: React.Key) => {
		setSelectedTab(key as string);
	};

	const handleProjectSelect = (projectId: string) => {
		setSelectedProject(projectId);
		onOpen();
	};

	// 获取推广数据
	const getPromotionData = (category: string) => {
		switch (category) {
			case 'overview':
				return overviewData;
			case 'platform':
				return platformPromotionData;
			case 'projects':
				return projectPromotionData;
			case 'rewards':
				return rewardsData;
			default:
				return overviewData;
		}
	};

	const currentData = getPromotionData(selectedTab);

	return (
		<div className='h-full w-full flex flex-col p-6 overflow-y-auto'>
			{/* 页面标题 */}
			<div className='mb-6'>
				<h1 className='text-3xl font-bold text-foreground mb-2'>推广中心</h1>
				<p className='text-primary-foreground'>通过推广获得丰厚奖励，分享平台和项目给更多用户</p>
			</div>

			{/* 推广概览卡片 */}
			<div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-6'>
				<Card className='bg-gradient-to-r from-blue-500/50 to-blue-600/50 text-white'>
					<CardBody className='p-6'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-blue-100 text-sm'>总推广收益</p>
								<p className='text-2xl font-bold'>$12,450</p>
								<p className='text-blue-200 text-xs'>+15.2% 本月</p>
							</div>
							<Icon icon='mdi:currency-usd' className='w-8 h-8 text-blue-200' />
						</div>
					</CardBody>
				</Card>

				<Card className='bg-gradient-to-r from-green-500/50 to-green-600/50 text-white'>
					<CardBody className='p-6'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-green-100 text-sm'>推荐用户</p>
								<p className='text-2xl font-bold'>1,234</p>
								<p className='text-green-200 text-xs'>+8.5% 本月</p>
							</div>
							<Icon icon='mdi:account-group' className='w-8 h-8 text-green-200' />
						</div>
					</CardBody>
				</Card>

				<Card className='bg-gradient-to-r from-purple-500/50 to-purple-600/50 text-white'>
					<CardBody className='p-6'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-purple-100 text-sm'>项目推广</p>
								<p className='text-2xl font-bold'>89</p>
								<p className='text-purple-200 text-xs'>+12.3% 本月</p>
							</div>
							<Icon icon='mdi:rocket-launch' className='w-8 h-8 text-purple-200' />
						</div>
					</CardBody>
				</Card>

				<Card className='bg-gradient-to-r from-orange-500/50 to-orange-600/50 text-white'>
					<CardBody className='p-6'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-orange-100 text-sm'>待领取奖励</p>
								<p className='text-2xl font-bold'>$2,180</p>
								<p className='text-orange-200 text-xs'>立即领取</p>
							</div>
							<Icon icon='mdi:gift' className='w-8 h-8 text-orange-200' />
						</div>
					</CardBody>
				</Card>
			</div>

			{/* 推广链接生成 */}
			<Card className='mb-6'>
				<CardHeader>
					<h3 className='text-lg font-semibold'>推广链接</h3>
					<p className='text-sm text-primary-foreground'>生成您的专属推广链接，分享给朋友获得奖励</p>
				</CardHeader>
				<CardBody>
					<div className='flex flex-col md:flex-row gap-4'>
						<div className='flex-1'>
							<Input
								label='平台推广链接'
								value='https://NeuraFi.com/ref/user123'
								readOnly
								startContent={<Icon icon='mdi:link' className='w-4 h-4 text-default-400' />}
								endContent={
									<Button size='sm' variant='bordered' startContent={<Icon icon='mdi:content-copy' className='w-4 h-4' />}>
										复制
									</Button>
								}
							/>
						</div>
						<div className='flex gap-2'>
							<Button color='primary' startContent={<Icon icon='mdi:share' className='w-4 h-4' />}>
								分享
							</Button>
							<Button variant='bordered' startContent={<Icon icon='mdi:qrcode' className='w-4 h-4' />}>
								二维码
							</Button>
						</div>
					</div>
				</CardBody>
			</Card>

			{/* 分类标签页 */}
			<div className='w-full'>
				<Tabs selectedKey={selectedTab} onSelectionChange={handleTabChange} variant='underlined' classNames={TabsClass}>
					<Tab key='overview' title='概览'>
						<div className='py-4'>
							<OverviewTab data={currentData} />
						</div>
					</Tab>
					<Tab key='platform' title='平台推广'>
						<div className='py-4'>
							<PlatformPromotionTab data={currentData} />
						</div>
					</Tab>
					<Tab key='projects' title='项目推广'>
						<div className='py-4'>
							<ProjectPromotionTab data={currentData} onProjectSelect={handleProjectSelect} />
						</div>
					</Tab>
					<Tab key='rewards' title='奖励记录'>
						<div className='py-4'>
							<RewardsTab data={currentData} />
						</div>
					</Tab>
				</Tabs>
			</div>
		</div>
	);
}

// 概览标签页
function OverviewTab({data}: {data: any}) {
	return (
		<div className='space-y-6'>
			{/* 推广统计图表 */}
			<Card>
				<CardHeader>
					<h3 className='text-lg font-semibold'>推广趋势</h3>
					<p className='text-sm text-primary-foreground'>最近30天的推广数据</p>
				</CardHeader>
				<CardBody>
					<div className='h-64 flex items-center justify-center bg-background rounded-lg'>
						<div className='text-center'>
							<Icon icon='mdi:chart-line' className='w-16 h-16 text-default-400 mx-auto mb-4' />
							<p className='text-default-600'>推广趋势图表</p>
							<p className='text-sm text-primary-foreground'>显示每日推广收益和用户增长</p>
						</div>
					</div>
				</CardBody>
			</Card>

			{/* 最近活动 */}
			<Card>
				<CardHeader>
					<h3 className='text-lg font-semibold'>最近活动</h3>
				</CardHeader>
				<CardBody>
					<div className='space-y-4'>
						{data.recentActivities?.map((activity: any, index: number) => (
							<div key={index} className='flex items-center gap-4 p-3 bg-default-50 rounded-lg'>
								<div className='w-10 h-10 bg-primary rounded-full flex items-center justify-center'>
									<Icon icon={activity.icon} className='w-5 h-5 text-white' />
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
function PlatformPromotionTab({data}: {data: any}) {
	return (
		<div className='space-y-6'>
			{/* 推广等级 */}
			<Card>
				<CardHeader>
					<h3 className='text-lg font-semibold'>推广等级</h3>
					<p className='text-sm text-primary-foreground'>根据推广效果获得不同等级和奖励</p>
				</CardHeader>
				<CardBody>
					<div className='flex items-center gap-6'>
						<div className='text-center'>
							<div className='w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-2'>
								<Icon icon='mdi:crown' className='w-10 h-10 text-white' />
							</div>
							<p className='font-semibold'>黄金推广者</p>
							<p className='text-sm text-primary-foreground'>等级 3</p>
						</div>
						<div className='flex-1'>
							<div className='flex justify-between text-sm mb-2'>
								<span>推广进度</span>
								<span>2,450 / 5,000 积分</span>
							</div>
							<Progress value={49} color='warning' className='w-full' />
							<p className='text-xs text-primary-foreground mt-2'>距离下一等级还需 2,550 积分</p>
						</div>
					</div>
				</CardBody>
			</Card>

			{/* 推广规则 */}
			<Card>
				<CardHeader>
					<h3 className='text-lg font-semibold'>推广规则</h3>
				</CardHeader>
				<CardBody>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div>
							<h4 className='font-semibold mb-3'>平台推广奖励</h4>
							<div className='space-y-2'>
								<div className='flex justify-between'>
									<span className='text-sm'>新用户注册</span>
									<span className='font-medium'>$10</span>
								</div>
								<div className='flex justify-between'>
									<span className='text-sm'>用户首次投资</span>
									<span className='font-medium'>$50</span>
								</div>
								<div className='flex justify-between'>
									<span className='text-sm'>用户完成KYC</span>
									<span className='font-medium'>$20</span>
								</div>
							</div>
						</div>
						<div>
							<h4 className='font-semibold mb-3'>等级特权</h4>
							<div className='space-y-2'>
								<div className='flex items-center gap-2'>
									<Icon icon='mdi:check' className='w-4 h-4 text-success' />
									<span className='text-sm'>更高推广佣金</span>
								</div>
								<div className='flex items-center gap-2'>
									<Icon icon='mdi:check' className='w-4 h-4 text-success' />
									<span className='text-sm'>专属推广工具</span>
								</div>
								<div className='flex items-center gap-2'>
									<Icon icon='mdi:check' className='w-4 h-4 text-success' />
									<span className='text-sm'>优先客服支持</span>
								</div>
							</div>
						</div>
					</div>
				</CardBody>
			</Card>
		</div>
	);
}

// 项目推广标签页
function ProjectPromotionTab({data, onProjectSelect}: {data: any; onProjectSelect: (projectId: string) => void}) {
	return (
		<div className='space-y-6'>
			{/* 项目推广列表 */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{data.projects?.map((project: any) => (
					<Card key={project.id} className='hover:shadow-lg transition-shadow duration-300'>
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
									<span className='text-default-600'>推广奖励:</span>
									<span className='font-medium text-success'>${project.reward}</span>
								</div>
								<div className='flex justify-between text-sm'>
									<span className='text-default-600'>已推广:</span>
									<span className='font-medium'>{project.promotedCount} 次</span>
								</div>
								<div className='flex justify-between text-sm'>
									<span className='text-default-600'>总收益:</span>
									<span className='font-medium'>${project.totalEarnings}</span>
								</div>
							</div>

							<Button color='primary' variant='flat' size='sm' className='w-full' onPress={() => onProjectSelect(project.id)} startContent={<Icon icon='mdi:eye' className='w-4 h-4' />}>
								查看详情
							</Button>
						</CardBody>
					</Card>
				))}
			</div>
		</div>
	);
}

// 奖励记录标签页
function RewardsTab({data}: {data: any}) {
	return (
		<div className='space-y-6'>
			{/* 奖励统计 */}
			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				<Card>
					<CardBody className='text-center'>
						<Icon icon='mdi:currency-usd' className='w-12 h-12 text-success mx-auto mb-2' />
						<p className='text-2xl font-bold text-success'>$12,450</p>
						<p className='text-sm text-primary-foreground'>总奖励</p>
					</CardBody>
				</Card>
				<Card>
					<CardBody className='text-center'>
						<Icon icon='mdi:gift' className='w-12 h-12 text-warning mx-auto mb-2' />
						<p className='text-2xl font-bold text-warning'>$2,180</p>
						<p className='text-sm text-primary-foreground'>待领取</p>
					</CardBody>
				</Card>
				<Card>
					<CardBody className='text-center'>
						<Icon icon='mdi:check-circle' className='w-12 h-12 text-primary mx-auto mb-2' />
						<p className='text-2xl font-bold text-primary'>156</p>
						<p className='text-sm text-primary-foreground'>已领取</p>
					</CardBody>
				</Card>
			</div>

			{/* 奖励记录列表 */}
			<Card>
				<CardHeader>
					<h3 className='text-lg font-semibold'>奖励记录</h3>
				</CardHeader>
				<CardBody>
					<div className='space-y-4'>
						{data.rewards?.map((reward: any, index: number) => (
							<div key={index} className='flex items-center justify-between p-4 border border-default-200 rounded-lg'>
								<div className='flex items-center gap-4'>
									<div className='w-10 h-10 bg-success rounded-full flex items-center justify-center'>
										<Icon icon={reward.icon} className='w-5 h-5 text-white' />
									</div>
									<div>
										<p className='font-medium'>{reward.title}</p>
										<p className='text-sm text-primary-foreground'>{reward.description}</p>
									</div>
								</div>
								<div className='text-right'>
									<p className='font-semibold text-success'>+${reward.amount}</p>
									<p className='text-xs text-primary-foreground'>{reward.date}</p>
									<Chip size='sm' color={reward.status === 'claimed' ? 'success' : 'warning'} variant='flat'>
										{reward.status === 'claimed' ? '已领取' : '待领取'}
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
function ProjectDetailModal({projectId}: {projectId: string}) {
	const project = projectPromotionData.find(p => p.id === projectId);
	if (!project) return null;

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
					<p className='text-sm text-default-600'>单次推广奖励</p>
				</div>
				<div className='text-center p-4 bg-success-50 rounded-lg'>
					<p className='text-2xl font-bold text-success'>${project.totalEarnings}</p>
					<p className='text-sm text-default-600'>总收益</p>
				</div>
			</div>

			<div>
				<h4 className='font-semibold mb-3'>推广链接</h4>
				<Input
					value={`https://NeuraFi.com/project/${project.id}/ref/user123`}
					readOnly
					endContent={
						<Button size='sm' variant='bordered' startContent={<Icon icon='mdi:content-copy' className='w-4 h-4' />}>
							复制
						</Button>
					}
				/>
			</div>

			<div>
				<h4 className='font-semibold mb-3'>推广统计</h4>
				<div className='grid grid-cols-3 gap-4 text-center'>
					<div>
						<p className='text-lg font-semibold'>{project.promotedCount}</p>
						<p className='text-sm text-default-600'>推广次数</p>
					</div>
					<div>
						<p className='text-lg font-semibold'>{project.conversionRate}%</p>
						<p className='text-sm text-default-600'>转化率</p>
					</div>
					<div>
						<p className='text-lg font-semibold'>{project.successfulReferrals}</p>
						<p className='text-sm text-default-600'>成功推荐</p>
					</div>
				</div>
			</div>
		</div>
	);
}

// 测试数据
const overviewData = {
	recentActivities: [
		{
			icon: 'mdi:account-plus',
			title: '新用户注册',
			description: '用户通过您的链接注册',
			amount: 10,
			time: '2小时前'
		},
		{
			icon: 'mdi:currency-usd',
			title: '项目推广奖励',
			description: 'Basketball Legends 项目推广',
			amount: 50,
			time: '5小时前'
		},
		{
			icon: 'mdi:check-circle',
			title: 'KYC完成奖励',
			description: '推荐用户完成身份认证',
			amount: 20,
			time: '1天前'
		}
	]
};

const platformPromotionData = {
	level: 3,
	levelName: '黄金推广者',
	points: 2450,
	nextLevelPoints: 5000,
	benefits: ['更高推广佣金', '专属推广工具', '优先客服支持']
};

const projectPromotionData = [
	{
		id: 'project-1',
		name: 'Basketball Legends',
		description: '经典篮球明星卡收藏项目',
		logo: '/images/token/erc-721/1.png',
		category: '体育',
		reward: 50,
		promotedCount: 23,
		totalEarnings: 1150,
		conversionRate: 15.2,
		successfulReferrals: 8
	},
	{
		id: 'project-2',
		name: 'Digital Art Gallery',
		description: '数字艺术收藏品项目',
		logo: '/images/token/erc-721/2.png',
		category: '艺术',
		reward: 30,
		promotedCount: 15,
		totalEarnings: 450,
		conversionRate: 12.8,
		successfulReferrals: 5
	},
	{
		id: 'project-3',
		name: 'RWA Gold Tokens',
		description: '实物黄金支持的代币项目',
		logo: '/images/token/erc-721/3.png',
		category: 'RWA',
		reward: 100,
		promotedCount: 8,
		totalEarnings: 800,
		conversionRate: 18.5,
		successfulReferrals: 6
	}
];

const rewardsData = {
	rewards: [
		{
			icon: 'mdi:account-plus',
			title: '新用户注册奖励',
			description: '用户通过您的链接注册',
			amount: 10,
			date: '2024-01-20',
			status: 'claimed'
		},
		{
			icon: 'mdi:currency-usd',
			title: '项目推广奖励',
			description: 'Basketball Legends 项目推广',
			amount: 50,
			date: '2024-01-19',
			status: 'claimed'
		},
		{
			icon: 'mdi:check-circle',
			title: 'KYC完成奖励',
			description: '推荐用户完成身份认证',
			amount: 20,
			date: '2024-01-18',
			status: 'pending'
		},
		{
			icon: 'mdi:rocket-launch',
			title: '项目投资奖励',
			description: '推荐用户完成首次投资',
			amount: 100,
			date: '2024-01-17',
			status: 'pending'
		}
	]
};
