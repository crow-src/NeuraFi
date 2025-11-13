'use client';

import {useState, useCallback, useMemo} from 'react';
import Image from 'next/image';
import {Input} from '@heroui/input';
import {Card, CardBody, CardHeader, Button, Textarea, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Switch, Slider, Checkbox, Divider as NextUIDivider} from '@heroui/react';
import {Select, SelectItem} from '@heroui/select';

import {Icon} from '@iconify/react';

// ===== 发布项目主视图 =====

export function LaunchView() {
	const [currentStep, setCurrentStep] = useState(1);
	const [projectData, setProjectData] = useState<ProjectData>({
		basicInfo: {
			name: '',
			description: '',
			category: '',
			website: '',
			twitter: '',
			discord: '',
			logo: ''
		},
		tokenInfo: {
			name: '',
			symbol: '',
			totalSupply: 0,
			decimals: 18,
			description: ''
		},
		blindBoxInfo: {
			price: 0,
			totalBoxes: 0,
			boxesPerTier: {},
			rewards: []
		},
		fundingInfo: {
			targetAmount: 0,
			minimumInvestment: 0,
			maximumInvestment: 0,
			vestingPeriod: 0,
			unlockSchedule: []
		},
		launchInfo: {
			startDate: '',
			endDate: '',
			whitelistRequired: false,
			kycRequired: false,
			termsAccepted: false
		}
	});

	const {isOpen, onOpen, onClose} = useDisclosure();

	const handleInputChange = (section: string, field: string, value: any) => {
		setProjectData(prev => ({
			...prev,
			[section]: {
				...prev[section as keyof ProjectData],
				[field]: value
			}
		}));
	};

	const handleNext = () => {
		if (currentStep < 5) {
			setCurrentStep(currentStep + 1);
		}
	};

	const handlePrevious = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		}
	};

	const handleSubmit = () => {
		onOpen();
	};

	const steps = [
		{id: 1, title: '基本信息', description: '项目基础信息'},
		{id: 2, title: '代币信息', description: '代币发行详情'},
		{id: 3, title: '盲盒设置', description: '盲盒奖励配置'},
		{id: 4, title: '募资计划', description: '资金募集设置'},
		{id: 5, title: '发布设置', description: '上线时间配置'}
	];

	return (
		<div className='h-full w-full flex flex-col p-6'>
			{/* 页面标题 */}
			<div className='mb-6 max-w-4xl mx-auto w-full flex-shrink-0'>
				<h1 className='text-3xl font-bold text-foreground mb-2'>发布新项目</h1>
				<p className='text-primary-foreground'>创建您的代币项目并通过盲盒进行募资</p>
			</div>

			{/* 步骤指示器 */}
			<Card className='mb-6 max-w-4xl mx-auto w-full flex-shrink-0'>
				<CardBody>
					<div className='flex items-center justify-between'>
						{steps.map((step, index) => (
							<div key={step.id} className='flex items-center'>
								<div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${currentStep >= step.id ? 'bg-primary border-primary text-primary-foreground' : 'border-default-300 text-default-400'}`}>{currentStep > step.id ? <Icon icon='mdi:check' className='w-5 h-5' /> : <span className='text-sm font-semibold'>{step.id}</span>}</div>
								<div className='ml-3'>
									<p className={`text-sm font-medium ${currentStep >= step.id ? 'text-foreground' : 'text-default-400'}`}>{step.title}</p>
									<p className='text-xs text-primary-foreground'>{step.description}</p>
								</div>
								{index < steps.length - 1 && <div className={`w-16 h-0.5 mx-4 ${currentStep > step.id ? 'bg-primary' : 'bg-default-300'}`} />}
							</div>
						))}
					</div>
				</CardBody>
			</Card>

			{/* 主要内容区域 - 可滚动 */}
			<div className='flex-1 max-w-4xl mx-auto w-full overflow-y-auto min-h-0'>
				{currentStep === 1 && <BasicInfoStep data={projectData.basicInfo} onChange={(field, value) => handleInputChange('basicInfo', field, value)} />}
				{currentStep === 2 && <TokenInfoStep data={projectData.tokenInfo} onChange={(field, value) => handleInputChange('tokenInfo', field, value)} />}
				{currentStep === 3 && <BlindBoxStep data={projectData.blindBoxInfo} onChange={(field, value) => handleInputChange('blindBoxInfo', field, value)} />}
				{currentStep === 4 && <FundingStep data={projectData.fundingInfo} onChange={(field, value) => handleInputChange('fundingInfo', field, value)} />}
				{currentStep === 5 && <LaunchStep data={projectData.launchInfo} onChange={(field, value) => handleInputChange('launchInfo', field, value)} />}
			</div>

			{/* 底部操作按钮 - 固定位置 */}
			<Card className='mt-6 max-w-4xl mx-auto w-full flex-shrink-0'>
				<CardBody>
					<div className='flex justify-between items-center'>
						<Button variant='ghost' onPress={handlePrevious} isDisabled={currentStep === 1} startContent={<Icon icon='mdi:chevron-left' className='w-4 h-4' />}>
							上一步
						</Button>

						<div className='flex gap-2'>
							<Button variant='ghost' onPress={() => setCurrentStep(1)}>
								重置
							</Button>
							{currentStep === 5 ? (
								<Button color='primary' onPress={handleSubmit} endContent={<Icon icon='mdi:rocket-launch' className='w-4 h-4' />}>
									发布项目
								</Button>
							) : (
								<Button color='primary' onPress={handleNext} endContent={<Icon icon='mdi:chevron-right' className='w-4 h-4' />}>
									下一步
								</Button>
							)}
						</div>
					</div>
				</CardBody>
			</Card>

			{/* 发布确认弹窗 */}
			<Modal isOpen={isOpen} onClose={onClose} size='2xl'>
				<ModalContent>
					<ModalHeader>确认发布项目</ModalHeader>
					<ModalBody>
						<div className='space-y-4'>
							<div className='text-center'>
								<Icon icon='mdi:rocket-launch' className='w-16 h-16 text-primary mx-auto mb-4' />
								<h3 className='text-xl font-semibold mb-2'>项目即将发布</h3>
								<p className='text-primary-foreground'>请确认所有信息无误后发布您的项目</p>
							</div>

							<Card>
								<CardBody>
									<h4 className='font-semibold mb-3'>项目概览</h4>
									<div className='grid grid-cols-2 gap-4 text-sm'>
										<div>
											<span className='text-primary-foreground'>项目名称:</span>
											<span className='ml-2 font-medium'>{projectData.basicInfo.name}</span>
										</div>
										<div>
											<span className='text-primary-foreground'>代币符号:</span>
											<span className='ml-2 font-medium'>{projectData.tokenInfo.symbol}</span>
										</div>
										<div>
											<span className='text-primary-foreground'>盲盒价格:</span>
											<span className='ml-2 font-medium'>${projectData.blindBoxInfo.price}</span>
										</div>
										<div>
											<span className='text-primary-foreground'>目标金额:</span>
											<span className='ml-2 font-medium'>${projectData.fundingInfo.targetAmount.toLocaleString()}</span>
										</div>
									</div>
								</CardBody>
							</Card>
						</div>
					</ModalBody>
					<ModalFooter>
						<Button variant='ghost' onPress={onClose}>
							取消
						</Button>
						<Button
							color='primary'
							onPress={() => {
								onClose();
								// 这里可以添加实际的发布逻辑
								console.log('项目发布:', projectData);
							}}>
							确认发布
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
}

// 基本信息步骤
function BasicInfoStep({data, onChange}: {data: BasicInfo; onChange: (field: string, value: any) => void}) {
	return (
		<Card>
			<CardHeader>
				<h2 className='text-xl font-semibold'>项目基本信息</h2>
				<p className='text-sm text-primary-foreground'>填写项目的基础信息，让投资者了解您的项目</p>
			</CardHeader>
			<CardBody className='space-y-6'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<Input label='项目名称' placeholder='输入项目名称' value={data.name} onChange={e => onChange('name', e.target.value)} startContent={<Icon icon='mdi:folder' className='w-4 h-4 text-default-400' />} isRequired />
					<Select label='项目分类' placeholder='选择项目分类' selectedKeys={data.category ? [data.category] : []} onSelectionChange={keys => onChange('category', Array.from(keys)[0])} startContent={<Icon icon='mdi:tag' className='w-4 h-4 text-default-400' />}>
						<SelectItem key='defi'>DeFi</SelectItem>
						<SelectItem key='nft'>NFT</SelectItem>
						<SelectItem key='gaming'>游戏</SelectItem>
						<SelectItem key='dao'>DAO</SelectItem>
						<SelectItem key='infrastructure'>基础设施</SelectItem>
						<SelectItem key='other'>其他</SelectItem>
					</Select>
				</div>

				<Textarea label='项目描述' placeholder='详细描述您的项目，包括愿景、目标、技术特点等' value={data.description} onChange={e => onChange('description', e.target.value)} minRows={4} isRequired />

				<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
					<Input label='官方网站' placeholder='https://example.com' value={data.website} onChange={e => onChange('website', e.target.value)} startContent={<Icon icon='mdi:web' className='w-4 h-4 text-default-400' />} />
					<Input label='Twitter' placeholder='@username' value={data.twitter} onChange={e => onChange('twitter', e.target.value)} startContent={<Icon icon='mdi:twitter' className='w-4 h-4 text-default-400' />} />
					<Input label='Discord' placeholder='Discord 邀请链接' value={data.discord} onChange={e => onChange('discord', e.target.value)} startContent={<Icon icon='mdi:discord' className='w-4 h-4 text-default-400' />} />
				</div>

				<div>
					<label className='block text-sm font-medium text-foreground mb-2'>项目 Logo</label>
					<div className='border-2 border-dashed border-default-300 rounded-lg p-6 text-center hover:border-primary transition-colors'>
						<Icon icon='mdi:image-plus' className='w-12 h-12 text-default-400 mx-auto mb-2' />
						<p className='text-sm text-primary-foreground'>点击上传项目 Logo</p>
						<p className='text-xs text-default-400 mt-1'>支持 PNG, JPG, SVG 格式，建议尺寸 200x200px</p>
					</div>
				</div>
			</CardBody>
		</Card>
	);
}

// 代币信息步骤
function TokenInfoStep({data, onChange}: {data: TokenInfo; onChange: (field: string, value: any) => void}) {
	return (
		<Card>
			<CardHeader>
				<h2 className='text-xl font-semibold'>代币信息</h2>
				<p className='text-sm text-primary-foreground'>配置您的代币发行参数</p>
			</CardHeader>
			<CardBody className='space-y-6'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<Input label='代币名称' placeholder='例如: MyToken' value={data.name} onChange={e => onChange('name', e.target.value)} startContent={<Icon icon='mdi:coin' className='w-4 h-4 text-default-400' />} isRequired />
					<Input label='代币符号' placeholder='例如: MTK' value={data.symbol} onChange={e => onChange('symbol', e.target.value)} startContent={<Icon icon='mdi:tag' className='w-4 h-4 text-default-400' />} isRequired />
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<Input label='总供应量' placeholder='1000000' type='number' value={data.totalSupply.toString()} onChange={e => onChange('totalSupply', parseInt(e.target.value) || 0)} startContent={<Icon icon='mdi:calculator' className='w-4 h-4 text-default-400' />} isRequired />
					<Input label='小数位数' placeholder='18' type='number' value={data.decimals.toString()} onChange={e => onChange('decimals', parseInt(e.target.value) || 18)} startContent={<Icon icon='mdi:decimal' className='w-4 h-4 text-default-400' />} isRequired />
				</div>

				<Textarea label='代币描述' placeholder='描述代币的用途、功能和经济模型' value={data.description} onChange={e => onChange('description', e.target.value)} minRows={3} />

				<Card className='bg-primary-50 border-primary-200'>
					<CardBody>
						<div className='flex items-start gap-3'>
							<Icon icon='mdi:information' className='w-5 h-5 text-primary mt-0.5' />
							<div>
								<h4 className='font-semibold text-primary mb-1'>代币分配说明</h4>
								<p className='text-sm text-primary-700'>代币将通过盲盒奖励的形式分发给投资者。不同稀有度的盲盒将获得不同数量的代币。 项目方可以设置代币的解锁时间表，确保项目的长期发展。</p>
							</div>
						</div>
					</CardBody>
				</Card>
			</CardBody>
		</Card>
	);
}

// 盲盒设置步骤
function BlindBoxStep({data, onChange}: {data: BlindBoxInfo; onChange: (field: string, value: any) => void}) {
	const [rewards, setRewards] = useState<Reward[]>(data.rewards || []);

	const addReward = () => {
		const newReward: Reward = {
			id: Date.now().toString(),
			tier: 'Common',
			probability: 0,
			tokenAmount: 0,
			description: '',
			image: ''
		};
		setRewards([...rewards, newReward]);
		onChange('rewards', [...rewards, newReward]);
	};

	const updateReward = (id: string, field: string, value: any) => {
		const updatedRewards = rewards.map(reward => (reward.id === id ? {...reward, [field]: value} : reward));
		setRewards(updatedRewards);
		onChange('rewards', updatedRewards);
	};

	const removeReward = (id: string) => {
		const updatedRewards = rewards.filter(reward => reward.id !== id);
		setRewards(updatedRewards);
		onChange('rewards', updatedRewards);
	};

	const handleImageUpload = (rewardId: string, event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			// 创建图片预览URL
			const imageUrl = URL.createObjectURL(file);
			updateReward(rewardId, 'image', imageUrl);
		}
	};

	return (
		<Card>
			<CardHeader>
				<h2 className='text-xl font-semibold'>盲盒设置</h2>
				<p className='text-sm text-primary-foreground'>配置盲盒的价格、数量和奖励机制</p>
			</CardHeader>
			<CardBody className='space-y-6'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<Input label='盲盒价格 (USD)' placeholder='10' type='number' value={data.price.toString()} onChange={e => onChange('price', parseFloat(e.target.value) || 0)} startContent={<Icon icon='mdi:currency-usd' className='w-4 h-4 text-default-400' />} isRequired />
					<Input label='盲盒总数量' placeholder='10000' type='number' value={data.totalBoxes.toString()} onChange={e => onChange('totalBoxes', parseInt(e.target.value) || 0)} startContent={<Icon icon='mdi:package-variant' className='w-4 h-4 text-default-400' />} isRequired />
				</div>

				<div>
					<h3 className='text-lg font-semibold mb-4'>奖励配置</h3>
					<div className='space-y-4'>
						{rewards.map((reward, index) => (
							<Card key={reward.id} className='border border-default-200'>
								<CardBody>
									<div className='flex items-center justify-between mb-4'>
										<h4 className='font-medium'>奖励 #{index + 1}</h4>
										<Button size='sm' variant='ghost' color='danger' onPress={() => removeReward(reward.id)} startContent={<Icon icon='mdi:delete' className='w-4 h-4' />}>
											删除
										</Button>
									</div>

									<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
										<Select label='稀有度' selectedKeys={[reward.tier]} onSelectionChange={keys => updateReward(reward.id, 'tier', Array.from(keys)[0])}>
											<SelectItem key='Common'>普通</SelectItem>
											<SelectItem key='Rare'>稀有</SelectItem>
											<SelectItem key='Epic'>史诗</SelectItem>
											<SelectItem key='Legendary'>传说</SelectItem>
										</Select>

										<Input label='概率 (%)' type='number' value={reward.probability.toString()} onChange={e => updateReward(reward.id, 'probability', parseFloat(e.target.value) || 0)} />

										<Input label='代币数量' type='number' value={reward.tokenAmount.toString()} onChange={e => updateReward(reward.id, 'tokenAmount', parseFloat(e.target.value) || 0)} />

										<Input label='描述' value={reward.description} onChange={e => updateReward(reward.id, 'description', e.target.value)} />
									</div>

									{/* 奖励图片上传 */}
									<div className='mt-4'>
										<label className='block text-sm font-medium text-foreground mb-2'>奖励图片</label>
										<div className='border-2 border-dashed border-default-300 rounded-lg p-4 text-center hover:border-primary transition-colors'>
											{reward.image ? (
												<div className='relative'>
													<Image src={reward.image} alt={`${reward.tier} 奖励图片`} width={96} height={96} className='w-24 h-24 object-cover rounded-lg mx-auto mb-2' />
													<div className='flex gap-2 justify-center'>
														<label className='cursor-pointer'>
															<input type='file' accept='image/*' onChange={e => handleImageUpload(reward.id, e)} className='hidden' />
															<Button size='sm' variant='bordered' startContent={<Icon icon='mdi:image-edit' className='w-3 h-3' />}>
																更换
															</Button>
														</label>
														<Button size='sm' variant='ghost' color='danger' onPress={() => updateReward(reward.id, 'image', '')} startContent={<Icon icon='mdi:close' className='w-3 h-3' />}>
															移除
														</Button>
													</div>
												</div>
											) : (
												<label className='cursor-pointer'>
													<input type='file' accept='image/*' onChange={e => handleImageUpload(reward.id, e)} className='hidden' />
													<div>
														<Icon icon='mdi:image-plus' className='w-8 h-8 text-default-400 mx-auto mb-2' />
														<p className='text-sm text-primary-foreground'>点击上传奖励图片</p>
														<p className='text-xs text-default-400 mt-1'>支持 PNG, JPG, SVG 格式，建议尺寸 200x200px</p>
													</div>
												</label>
											)}
										</div>
									</div>
								</CardBody>
							</Card>
						))}

						<Button variant='bordered' onPress={addReward} startContent={<Icon icon='mdi:plus' className='w-4 h-4' />} className='w-full border-dashed'>
							添加奖励
						</Button>
					</div>
				</div>

				<Card className='bg-warning-50 border-warning-200'>
					<CardBody>
						<div className='flex items-start gap-3'>
							<Icon icon='mdi:alert' className='w-5 h-5 text-warning mt-0.5' />
							<div>
								<h4 className='font-semibold text-warning mb-1'>概率设置提醒</h4>
								<p className='text-sm text-warning-700'>请确保所有奖励的概率总和不超过100%。建议设置一些空奖（概率为0）来增加开盒的趣味性。</p>
							</div>
						</div>
					</CardBody>
				</Card>
			</CardBody>
		</Card>
	);
}

// 募资计划步骤
function FundingStep({data, onChange}: {data: FundingInfo; onChange: (field: string, value: any) => void}) {
	return (
		<Card>
			<CardHeader>
				<h2 className='text-xl font-semibold'>募资计划</h2>
				<p className='text-sm text-primary-foreground'>设置资金募集的目标和限制</p>
			</CardHeader>
			<CardBody className='space-y-6'>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
					<Input label='目标金额 (USD)' placeholder='1000000' type='number' value={data.targetAmount.toString()} onChange={e => onChange('targetAmount', parseFloat(e.target.value) || 0)} startContent={<Icon icon='mdi:target' className='w-4 h-4 text-default-400' />} isRequired />
					<Input label='最小投资额 (USD)' placeholder='100' type='number' value={data.minimumInvestment.toString()} onChange={e => onChange('minimumInvestment', parseFloat(e.target.value) || 0)} startContent={<Icon icon='mdi:arrow-down' className='w-4 h-4 text-default-400' />} />
					<Input label='最大投资额 (USD)' placeholder='10000' type='number' value={data.maximumInvestment.toString()} onChange={e => onChange('maximumInvestment', parseFloat(e.target.value) || 0)} startContent={<Icon icon='mdi:arrow-up' className='w-4 h-4 text-default-400' />} />
				</div>

				<div>
					<label className='block text-sm font-medium text-foreground mb-2'>代币解锁周期 (月)</label>
					<Slider
						value={data.vestingPeriod}
						onChange={value => onChange('vestingPeriod', value)}
						minValue={0}
						maxValue={48}
						step={1}
						className='max-w-md'
						marks={[
							{value: 0, label: '0月'},
							{value: 12, label: '12月'},
							{value: 24, label: '24月'},
							{value: 36, label: '36月'},
							{value: 48, label: '48月'}
						]}
					/>
					<p className='text-sm text-primary-foreground mt-2'>
						当前设置: {data.vestingPeriod} 个月 ({data.vestingPeriod === 0 ? '立即解锁' : `${data.vestingPeriod}个月后开始解锁`})
					</p>
				</div>

				<div>
					<h3 className='text-lg font-semibold mb-4'>解锁时间表</h3>
					<Card className='bg-primary-50 border-primary-200'>
						<CardBody>
							<div className='space-y-2'>
								<div className='flex justify-between text-sm'>
									<span>立即解锁</span>
									<span className='font-medium'>20%</span>
								</div>
								<div className='flex justify-between text-sm'>
									<span>3个月后</span>
									<span className='font-medium'>20%</span>
								</div>
								<div className='flex justify-between text-sm'>
									<span>6个月后</span>
									<span className='font-medium'>20%</span>
								</div>
								<div className='flex justify-between text-sm'>
									<span>12个月后</span>
									<span className='font-medium'>20%</span>
								</div>
								<div className='flex justify-between text-sm'>
									<span>18个月后</span>
									<span className='font-medium'>20%</span>
								</div>
							</div>
						</CardBody>
					</Card>
				</div>

				<Card className='bg-success-50 border-success-200'>
					<CardBody>
						<div className='flex items-start gap-3'>
							<Icon icon='mdi:chart-line' className='w-5 h-5 text-success mt-0.5' />
							<div>
								<h4 className='font-semibold text-success mb-1'>募资进度</h4>
								<p className='text-sm text-success-700'>投资者购买盲盒的资金将直接进入项目资金池。当达到目标金额时，项目将自动启动， 代币将按照设定的时间表逐步解锁给投资者。</p>
							</div>
						</div>
					</CardBody>
				</Card>
			</CardBody>
		</Card>
	);
}

// 发布设置步骤
function LaunchStep({data, onChange}: {data: LaunchInfo; onChange: (field: string, value: any) => void}) {
	return (
		<Card>
			<CardHeader>
				<h2 className='text-xl font-semibold'>发布设置</h2>
				<p className='text-sm text-primary-foreground'>配置项目的发布时间和相关要求</p>
			</CardHeader>
			<CardBody className='space-y-6'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<Input label='开始时间' type='datetime-local' value={data.startDate} onChange={e => onChange('startDate', e.target.value)} startContent={<Icon icon='mdi:calendar-start' className='w-4 h-4 text-default-400' />} isRequired />
					<Input label='结束时间' type='datetime-local' value={data.endDate} onChange={e => onChange('endDate', e.target.value)} startContent={<Icon icon='mdi:calendar-end' className='w-4 h-4 text-default-400' />} isRequired />
				</div>

				<div className='space-y-4'>
					<h3 className='text-lg font-semibold'>参与要求</h3>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div className='flex items-center justify-between p-4 border border-default-200 rounded-lg'>
							<div>
								<h4 className='font-medium'>白名单要求</h4>
								<p className='text-sm text-primary-foreground'>只有白名单用户才能参与募资</p>
							</div>
							<Switch isSelected={data.whitelistRequired} onValueChange={value => onChange('whitelistRequired', value)} />
						</div>

						<div className='flex items-center justify-between p-4 border border-default-200 rounded-lg'>
							<div>
								<h4 className='font-medium'>KYC 认证</h4>
								<p className='text-sm text-primary-foreground'>参与者需要通过身份认证</p>
							</div>
							<Switch isSelected={data.kycRequired} onValueChange={value => onChange('kycRequired', value)} />
						</div>
					</div>
				</div>

				<div className='space-y-4'>
					<h3 className='text-lg font-semibold'>法律条款</h3>

					<Card className='bg-default-50 border-default-200'>
						<CardBody>
							<div className='space-y-3'>
								<div className='flex items-start gap-3'>
									<Checkbox isSelected={data.termsAccepted} onValueChange={value => onChange('termsAccepted', value)} />
									<div className='text-sm'>
										<p className='font-medium mb-1'>我同意以下条款：</p>
										<ul className='list-disc list-inside space-y-1 text-default-600'>
											<li>项目信息真实有效，不存在虚假宣传</li>
											<li>遵守相关法律法规，承担相应责任</li>
											<li>代币发行符合监管要求</li>
											<li>投资者风险自担，项目方不承担投资损失</li>
										</ul>
									</div>
								</div>
							</div>
						</CardBody>
					</Card>
				</div>

				<Card className='bg-danger-50 border-danger-200'>
					<CardBody>
						<div className='flex items-start gap-3'>
							<Icon icon='mdi:alert-circle' className='w-5 h-5 text-danger mt-0.5' />
							<div>
								<h4 className='font-semibold text-danger mb-1'>重要提醒</h4>
								<p className='text-sm text-danger-700'>项目发布后，所有设置将无法修改。请仔细检查所有信息确保准确无误。 代币发行涉及法律风险，请确保符合当地监管要求。</p>
							</div>
						</div>
					</CardBody>
				</Card>
			</CardBody>
		</Card>
	);
}

// 类型定义
interface ProjectData {
	basicInfo: BasicInfo;
	tokenInfo: TokenInfo;
	blindBoxInfo: BlindBoxInfo;
	fundingInfo: FundingInfo;
	launchInfo: LaunchInfo;
}

interface BasicInfo {
	name: string;
	description: string;
	category: string;
	website: string;
	twitter: string;
	discord: string;
	logo: string;
}

interface TokenInfo {
	name: string;
	symbol: string;
	totalSupply: number;
	decimals: number;
	description: string;
}

interface BlindBoxInfo {
	price: number;
	totalBoxes: number;
	boxesPerTier: Record<string, number>;
	rewards: Reward[];
}

interface Reward {
	id: string;
	tier: string;
	probability: number;
	tokenAmount: number;
	description: string;
	image: string;
}

interface FundingInfo {
	targetAmount: number;
	minimumInvestment: number;
	maximumInvestment: number;
	vestingPeriod: number;
	unlockSchedule: any[];
}

interface LaunchInfo {
	startDate: string;
	endDate: string;
	whitelistRequired: boolean;
	kycRequired: boolean;
	termsAccepted: boolean;
}
