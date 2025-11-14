'use client';

import {useState, useCallback, useMemo} from 'react';
import Image from 'next/image';
import {Input} from '@heroui/input';
import {Card, CardBody, CardHeader, Button, Textarea, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Switch, Slider, Checkbox, Divider as NextUIDivider} from '@heroui/react';
import {Select, SelectItem} from '@heroui/select';
import {Icon} from '@iconify/react';
import {useTranslations} from 'next-intl';

const VESTING_MARKS = [0, 12, 24, 36, 48];
const UNLOCK_SCHEDULE_KEYS = ['immediate', 'after3', 'after6', 'after12', 'after18'] as const;
type UnlockScheduleKey = (typeof UNLOCK_SCHEDULE_KEYS)[number];
const LEGAL_ACK_KEYS = ['truthful', 'compliance', 'token', 'risk'] as const;
type LegalAckKey = (typeof LEGAL_ACK_KEYS)[number];

// ===== 发布项目主视图 =====

export function LaunchView() {
	const t = useTranslations('launch');
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

	const steps = useMemo(
		() => [
			{id: 1, title: t('steps.basic.title'), description: t('steps.basic.description')},
			{id: 2, title: t('steps.token.title'), description: t('steps.token.description')},
			{id: 3, title: t('steps.blindbox.title'), description: t('steps.blindbox.description')},
			{id: 4, title: t('steps.funding.title'), description: t('steps.funding.description')},
			{id: 5, title: t('steps.launch.title'), description: t('steps.launch.description')}
		],
		[t]
	);

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

	return (
		<div className='h-full w-full flex flex-col p-6'>
			{/* 页面标题 */}
			<div className='mb-6 max-w-4xl mx-auto w-full shrink-0'>
				<h1 className='text-3xl font-bold text-primary-foreground mb-2'>{t('hero.title')}</h1>
				<p className='text-primary-foreground'>{t('hero.subtitle')}</p>
			</div>

			{/* 步骤指示器 */}
			<Card className='mb-6 max-w-4xl mx-auto w-full shrink-0'>
				<CardBody>
					<div className='flex items-center justify-between'>
						{steps.map((step, index) => (
							<div key={step.id} className='flex items-center'>
								<div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${currentStep >= step.id ? 'bg-primary border-primary text-primary-foreground' : 'border-default-300 text-default-400'}`}>{currentStep > step.id ? <Icon icon='mdi:check' className='w-5 h-5' /> : <span className='text-sm font-semibold'>{step.id}</span>}</div>
								<div className='ml-3'>
									<p className={`text-sm font-medium ${currentStep >= step.id ? 'text-primary-foreground' : 'text-default-400'}`}>{step.title}</p>
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
			<Card className='mt-6 max-w-4xl mx-auto w-full shrink-0'>
				<CardBody>
					<div className='flex justify-between items-center'>
						<Button variant='ghost' onPress={handlePrevious} isDisabled={currentStep === 1} startContent={<Icon icon='mdi:chevron-left' className='w-4 h-4' />}>
							{t('buttons.previous')}
						</Button>

						<div className='flex gap-2'>
							<Button variant='ghost' onPress={() => setCurrentStep(1)}>
								{t('buttons.reset')}
							</Button>
							{currentStep === 5 ? (
								<Button color='primary' onPress={handleSubmit} endContent={<Icon icon='mdi:rocket-launch' className='w-4 h-4' />}>
									{t('buttons.publish')}
								</Button>
							) : (
								<Button color='primary' onPress={handleNext} endContent={<Icon icon='mdi:chevron-right' className='w-4 h-4' />}>
									{t('buttons.next')}
								</Button>
							)}
						</div>
					</div>
				</CardBody>
			</Card>

			{/* 发布确认弹窗 */}
			<Modal isOpen={isOpen} onClose={onClose} size='2xl'>
				<ModalContent>
					<ModalHeader>{t('modal.title')}</ModalHeader>
					<ModalBody>
						<div className='space-y-4'>
							<div className='text-center'>
								<Icon icon='mdi:rocket-launch' className='w-16 h-16 text-primary mx-auto mb-4' />
								<h3 className='text-xl font-semibold mb-2'>{t('modal.heading')}</h3>
								<p className='text-primary-foreground'>{t('modal.description')}</p>
							</div>

							<Card>
								<CardBody>
									<h4 className='font-semibold mb-3'>{t('modal.overview')}</h4>
									<div className='grid grid-cols-2 gap-4 text-sm'>
										<div>
											<span className='text-primary-foreground'>{t('modal.fields.name')}:</span>
											<span className='ml-2 font-medium'>{projectData.basicInfo.name}</span>
										</div>
										<div>
											<span className='text-primary-foreground'>{t('modal.fields.symbol')}:</span>
											<span className='ml-2 font-medium'>{projectData.tokenInfo.symbol}</span>
										</div>
										<div>
											<span className='text-primary-foreground'>{t('modal.fields.price')}:</span>
											<span className='ml-2 font-medium'>${projectData.blindBoxInfo.price}</span>
										</div>
										<div>
											<span className='text-primary-foreground'>{t('modal.fields.target')}:</span>
											<span className='ml-2 font-medium'>${projectData.fundingInfo.targetAmount.toLocaleString()}</span>
										</div>
									</div>
								</CardBody>
							</Card>
						</div>
					</ModalBody>
					<ModalFooter>
						<Button variant='ghost' onPress={onClose}>
							{t('modal.cancel')}
						</Button>
						<Button
							color='primary'
							onPress={() => {
								onClose();
								// 这里可以添加实际的发布逻辑
								console.log('项目发布:', projectData);
							}}>
							{t('modal.confirm')}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
}

// 基本信息步骤
function BasicInfoStep({data, onChange}: {data: BasicInfo; onChange: (field: string, value: any) => void}) {
	const t = useTranslations('launch');
	return (
		<Card>
			<CardHeader>
				<h2 className='text-xl font-semibold'>{t('basic.title')}</h2>
				<p className='text-sm text-primary-foreground'>{t('basic.description')}</p>
			</CardHeader>
			<CardBody className='space-y-6'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<Input label={t('basic.fields.name.label')} placeholder={t('basic.fields.name.placeholder')} value={data.name} onChange={e => onChange('name', e.target.value)} startContent={<Icon icon='mdi:folder' className='w-4 h-4 text-default-400' />} isRequired />
					<Select label={t('basic.fields.category.label')} placeholder={t('basic.fields.category.placeholder')} selectedKeys={data.category ? [data.category] : []} onSelectionChange={keys => onChange('category', Array.from(keys)[0] ?? '')} startContent={<Icon icon='mdi:tag' className='w-4 h-4 text-default-400' />}>
						<SelectItem key='defi'>{t('basic.fields.category.options.defi')}</SelectItem>
						<SelectItem key='nft'>{t('basic.fields.category.options.nft')}</SelectItem>
						<SelectItem key='gaming'>{t('basic.fields.category.options.gaming')}</SelectItem>
						<SelectItem key='dao'>{t('basic.fields.category.options.dao')}</SelectItem>
						<SelectItem key='infrastructure'>{t('basic.fields.category.options.infrastructure')}</SelectItem>
						<SelectItem key='other'>{t('basic.fields.category.options.other')}</SelectItem>
					</Select>
				</div>

				<Textarea label={t('basic.fields.description.label')} placeholder={t('basic.fields.description.placeholder')} value={data.description} onChange={e => onChange('description', e.target.value)} minRows={4} isRequired />

				<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
					<Input label={t('basic.fields.website.label')} placeholder={t('basic.fields.website.placeholder')} value={data.website} onChange={e => onChange('website', e.target.value)} startContent={<Icon icon='mdi:web' className='w-4 h-4 text-default-400' />} />
					<Input label={t('basic.fields.twitter.label')} placeholder={t('basic.fields.twitter.placeholder')} value={data.twitter} onChange={e => onChange('twitter', e.target.value)} startContent={<Icon icon='mdi:twitter' className='w-4 h-4 text-default-400' />} />
					<Input label={t('basic.fields.discord.label')} placeholder={t('basic.fields.discord.placeholder')} value={data.discord} onChange={e => onChange('discord', e.target.value)} startContent={<Icon icon='mdi:discord' className='w-4 h-4 text-default-400' />} />
				</div>

				<div>
					<label className='block text-sm font-medium text-primary-foreground mb-2'>{t('basic.logo.title')}</label>
					<div className='border-2 border-dashed border-default-300 rounded-lg p-6 text-center hover:border-primary transition-colors'>
						<Icon icon='mdi:image-plus' className='w-12 h-12 text-default-400 mx-auto mb-2' />
						<p className='text-sm text-primary-foreground'>{t('basic.logo.cta')}</p>
						<p className='text-xs text-default-400 mt-1'>{t('basic.logo.note')}</p>
					</div>
				</div>
			</CardBody>
		</Card>
	);
}

// 代币信息步骤
function TokenInfoStep({data, onChange}: {data: TokenInfo; onChange: (field: string, value: any) => void}) {
	const t = useTranslations('launch');
	return (
		<Card>
			<CardHeader>
				<h2 className='text-xl font-semibold'>{t('token.title')}</h2>
				<p className='text-sm text-primary-foreground'>{t('token.description')}</p>
			</CardHeader>
			<CardBody className='space-y-6'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<Input label={t('token.fields.name.label')} placeholder={t('token.fields.name.placeholder')} value={data.name} onChange={e => onChange('name', e.target.value)} startContent={<Icon icon='mdi:coin' className='w-4 h-4 text-default-400' />} isRequired />
					<Input label={t('token.fields.symbol.label')} placeholder={t('token.fields.symbol.placeholder')} value={data.symbol} onChange={e => onChange('symbol', e.target.value)} startContent={<Icon icon='mdi:tag' className='w-4 h-4 text-default-400' />} isRequired />
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<Input label={t('token.fields.totalSupply.label')} placeholder={t('token.fields.totalSupply.placeholder')} type='number' value={data.totalSupply.toString()} onChange={e => onChange('totalSupply', parseInt(e.target.value) || 0)} startContent={<Icon icon='mdi:calculator' className='w-4 h-4 text-default-400' />} isRequired />
					<Input label={t('token.fields.decimals.label')} placeholder={t('token.fields.decimals.placeholder')} type='number' value={data.decimals.toString()} onChange={e => onChange('decimals', parseInt(e.target.value) || 18)} startContent={<Icon icon='mdi:decimal' className='w-4 h-4 text-default-400' />} isRequired />
				</div>

				<Textarea label={t('token.fields.description.label')} placeholder={t('token.fields.description.placeholder')} value={data.description} onChange={e => onChange('description', e.target.value)} minRows={3} />

				<Card className='bg-primary-50 border-primary-200'>
					<CardBody>
						<div className='flex items-start gap-3'>
							<Icon icon='mdi:information' className='w-5 h-5 text-primary mt-0.5' />
							<div>
								<h4 className='font-semibold text-primary mb-1'>{t('token.info.title')}</h4>
								<p className='text-sm text-primary-700'>{t('token.info.content')}</p>
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
	const t = useTranslations('launch');
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
				<h2 className='text-xl font-semibold'>{t('blindbox.title')}</h2>
				<p className='text-sm text-primary-foreground'>{t('blindbox.description')}</p>
			</CardHeader>
			<CardBody className='space-y-6'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<Input label={t('blindbox.fields.price.label')} placeholder={t('blindbox.fields.price.placeholder')} type='number' value={data.price.toString()} onChange={e => onChange('price', parseFloat(e.target.value) || 0)} startContent={<Icon icon='mdi:currency-usd' className='w-4 h-4 text-default-400' />} isRequired />
					<Input label={t('blindbox.fields.totalBoxes.label')} placeholder={t('blindbox.fields.totalBoxes.placeholder')} type='number' value={data.totalBoxes.toString()} onChange={e => onChange('totalBoxes', parseInt(e.target.value) || 0)} startContent={<Icon icon='mdi:package-variant' className='w-4 h-4 text-default-400' />} isRequired />
				</div>

				<div>
					<h3 className='text-lg font-semibold mb-4'>{t('blindbox.rewards.title')}</h3>
					<div className='space-y-4'>
						{rewards.map((reward, index) => (
							<Card key={reward.id} className='border border-default-200'>
								<CardBody>
									<div className='flex items-center justify-between mb-4'>
										<h4 className='font-medium'>{t('blindbox.rewards.card_title', {index: index + 1})}</h4>
										<Button size='sm' variant='ghost' color='danger' onPress={() => removeReward(reward.id)} startContent={<Icon icon='mdi:delete' className='w-4 h-4' />}>
											{t('blindbox.rewards.delete')}
										</Button>
									</div>

									<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
										<Select label={t('blindbox.rewards.tier.label')} selectedKeys={[reward.tier]} onSelectionChange={keys => updateReward(reward.id, 'tier', Array.from(keys)[0] ?? reward.tier)}>
											<SelectItem key='Common'>{t('blindbox.rewards.tiers.common')}</SelectItem>
											<SelectItem key='Rare'>{t('blindbox.rewards.tiers.rare')}</SelectItem>
											<SelectItem key='Epic'>{t('blindbox.rewards.tiers.epic')}</SelectItem>
											<SelectItem key='Legendary'>{t('blindbox.rewards.tiers.legendary')}</SelectItem>
										</Select>

										<Input label={t('blindbox.rewards.fields.probability')} type='number' value={reward.probability.toString()} onChange={e => updateReward(reward.id, 'probability', parseFloat(e.target.value) || 0)} />

										<Input label={t('blindbox.rewards.fields.tokenAmount')} type='number' value={reward.tokenAmount.toString()} onChange={e => updateReward(reward.id, 'tokenAmount', parseFloat(e.target.value) || 0)} />

										<Input label={t('blindbox.rewards.fields.description')} value={reward.description} onChange={e => updateReward(reward.id, 'description', e.target.value)} />
									</div>

									{/* 奖励图片上传 */}
									<div className='mt-4'>
										<label className='block text-sm font-medium text-primary-foreground mb-2'>{t('blindbox.rewards.image.label')}</label>
										<div className='border-2 border-dashed border-default-300 rounded-lg p-4 text-center hover:border-primary transition-colors'>
											{reward.image ? (
												<div className='relative'>
													<Image src={reward.image} alt={t('blindbox.rewards.image.alt', {tier: t(`blindbox.rewards.tiers.${reward.tier.toLowerCase() as 'common' | 'rare' | 'epic' | 'legendary'}`)})} width={96} height={96} className='w-24 h-24 object-cover rounded-lg mx-auto mb-2' />
													<div className='flex gap-2 justify-center'>
														<label className='cursor-pointer'>
															<input type='file' accept='image/*' onChange={e => handleImageUpload(reward.id, e)} className='hidden' />
															<Button size='sm' variant='bordered' startContent={<Icon icon='mdi:image-edit' className='w-3 h-3' />}>
																{t('blindbox.rewards.image.change')}
															</Button>
														</label>
														<Button size='sm' variant='ghost' color='danger' onPress={() => updateReward(reward.id, 'image', '')} startContent={<Icon icon='mdi:close' className='w-3 h-3' />}>
															{t('blindbox.rewards.image.remove')}
														</Button>
													</div>
												</div>
											) : (
												<label className='cursor-pointer'>
													<input type='file' accept='image/*' onChange={e => handleImageUpload(reward.id, e)} className='hidden' />
													<div>
														<Icon icon='mdi:image-plus' className='w-8 h-8 text-default-400 mx-auto mb-2' />
														<p className='text-sm text-primary-foreground'>{t('blindbox.rewards.image.cta')}</p>
														<p className='text-xs text-default-400 mt-1'>{t('blindbox.rewards.image.note')}</p>
													</div>
												</label>
											)}
										</div>
									</div>
								</CardBody>
							</Card>
						))}

						<Button variant='bordered' onPress={addReward} startContent={<Icon icon='mdi:plus' className='w-4 h-4' />} className='w-full border-dashed'>
							{t('blindbox.rewards.add')}
						</Button>
					</div>
				</div>

				<Card className='bg-warning-50 border-warning-200'>
					<CardBody>
						<div className='flex items-start gap-3'>
							<Icon icon='mdi:alert' className='w-5 h-5 text-warning mt-0.5' />
							<div>
								<h4 className='font-semibold text-warning mb-1'>{t('blindbox.notice.title')}</h4>
								<p className='text-sm text-warning-700'>{t('blindbox.notice.content')}</p>
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
	const t = useTranslations('launch');
	const sliderMarks = useMemo(() => VESTING_MARKS.map(value => ({value, label: t('funding.vesting.mark', {value})})), [t]);
	const vestingDetail = data.vestingPeriod === 0 ? t('funding.vesting.detail_immediate') : t('funding.vesting.detail_delayed', {months: data.vestingPeriod});
	const unlockEntries = useMemo(() => UNLOCK_SCHEDULE_KEYS.map(key => ({key, label: t(`funding.schedule.items.${key}.label`), value: t(`funding.schedule.items.${key}.value`)})), [t]);
	return (
		<Card>
			<CardHeader>
				<h2 className='text-xl font-semibold'>{t('funding.title')}</h2>
				<p className='text-sm text-primary-foreground'>{t('funding.description')}</p>
			</CardHeader>
			<CardBody className='space-y-6'>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
					<Input label={t('funding.fields.target.label')} placeholder={t('funding.fields.target.placeholder')} type='number' value={data.targetAmount.toString()} onChange={e => onChange('targetAmount', parseFloat(e.target.value) || 0)} startContent={<Icon icon='mdi:target' className='w-4 h-4 text-default-400' />} isRequired />
					<Input label={t('funding.fields.minimum.label')} placeholder={t('funding.fields.minimum.placeholder')} type='number' value={data.minimumInvestment.toString()} onChange={e => onChange('minimumInvestment', parseFloat(e.target.value) || 0)} startContent={<Icon icon='mdi:arrow-down' className='w-4 h-4 text-default-400' />} />
					<Input label={t('funding.fields.maximum.label')} placeholder={t('funding.fields.maximum.placeholder')} type='number' value={data.maximumInvestment.toString()} onChange={e => onChange('maximumInvestment', parseFloat(e.target.value) || 0)} startContent={<Icon icon='mdi:arrow-up' className='w-4 h-4 text-default-400' />} />
				</div>

				<div>
					<label className='block text-sm font-medium text-primary-foreground mb-2'>{t('funding.vesting.label')}</label>
					<Slider value={data.vestingPeriod} onChange={value => onChange('vestingPeriod', value as number)} minValue={0} maxValue={48} step={1} className='max-w-md' marks={sliderMarks} />
					<p className='text-sm text-primary-foreground mt-2'>{t('funding.vesting.current', {months: data.vestingPeriod, detail: vestingDetail})}</p>
				</div>

				<div>
					<h3 className='text-lg font-semibold mb-4'>{t('funding.schedule.title')}</h3>
					<Card className='bg-primary-50 border-primary-200'>
						<CardBody>
							<div className='space-y-2'>
								{unlockEntries.map(entry => (
									<div key={entry.key} className='flex justify-between text-sm'>
										<span>{entry.label}</span>
										<span className='font-medium'>{entry.value}</span>
									</div>
								))}
							</div>
						</CardBody>
					</Card>
				</div>

				<Card className='bg-success-50 border-success-200'>
					<CardBody>
						<div className='flex items-start gap-3'>
							<Icon icon='mdi:chart-line' className='w-5 h-5 text-success mt-0.5' />
							<div>
								<h4 className='font-semibold text-success mb-1'>{t('funding.progress.title')}</h4>
								<p className='text-sm text-success-700'>{t('funding.progress.content')}</p>
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
	const t = useTranslations('launch');
	const legalItems = LEGAL_ACK_KEYS;
	return (
		<Card>
			<CardHeader>
				<h2 className='text-xl font-semibold'>{t('launchStep.title')}</h2>
				<p className='text-sm text-primary-foreground'>{t('launchStep.description')}</p>
			</CardHeader>
			<CardBody className='space-y-6'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<Input label={t('launchStep.fields.start')} type='datetime-local' value={data.startDate} onChange={e => onChange('startDate', e.target.value)} startContent={<Icon icon='mdi:calendar-start' className='w-4 h-4 text-default-400' />} isRequired />
					<Input label={t('launchStep.fields.end')} type='datetime-local' value={data.endDate} onChange={e => onChange('endDate', e.target.value)} startContent={<Icon icon='mdi:calendar-end' className='w-4 h-4 text-default-400' />} isRequired />
				</div>

				<div className='space-y-4'>
					<h3 className='text-lg font-semibold'>{t('launchStep.requirements.title')}</h3>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div className='flex items-center justify-between p-4 border border-default-200 rounded-lg'>
							<div>
								<h4 className='font-medium'>{t('launchStep.requirements.whitelist.title')}</h4>
								<p className='text-sm text-primary-foreground'>{t('launchStep.requirements.whitelist.description')}</p>
							</div>
							<Switch isSelected={data.whitelistRequired} onValueChange={value => onChange('whitelistRequired', value)} />
						</div>

						<div className='flex items-center justify-between p-4 border border-default-200 rounded-lg'>
							<div>
								<h4 className='font-medium'>{t('launchStep.requirements.kyc.title')}</h4>
								<p className='text-sm text-primary-foreground'>{t('launchStep.requirements.kyc.description')}</p>
							</div>
							<Switch isSelected={data.kycRequired} onValueChange={value => onChange('kycRequired', value)} />
						</div>
					</div>
				</div>

				<div className='space-y-4'>
					<h3 className='text-lg font-semibold'>{t('launchStep.legal.title')}</h3>

					<Card className='bg-default-50 border-default-200'>
						<CardBody>
							<div className='space-y-3'>
								<div className='flex items-start gap-3'>
									<Checkbox isSelected={data.termsAccepted} onValueChange={value => onChange('termsAccepted', value)} />
									<div className='text-sm'>
										<p className='font-medium mb-1'>{t('launchStep.legal.checkbox')}</p>
										<ul className='list-disc list-inside space-y-1 text-default-600'>
											{legalItems.map(item => (
												<li key={item}>{t(`launchStep.legal.items.${item}`)}</li>
											))}
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
								<h4 className='font-semibold text-danger mb-1'>{t('launchStep.alert.title')}</h4>
								<p className='text-sm text-danger-700'>{t('launchStep.alert.content')}</p>
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
