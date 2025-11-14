'use client';

import {useState} from 'react';
import {Button, Chip, ScrollShadow} from '@heroui/react';
import {Icon} from '@iconify/react';
import {useTranslations} from 'next-intl';
import {button} from '@/components';

// 资金管理页面 - 交易记录
const FundsContent = () => {
	const t = useTranslations('user');

	// 生成随机交易记录数据
	const generateTransactionData = () => {
		const symbols = ['BTC', 'ETH', 'LINK', 'UNI', 'AAVE', 'USDC', 'USDT', t('term_deposit'), t('funding_account')];
		const types = ['buy', 'sell', 'deposit', 'funding'];
		const times = ['10:30', '09:15', '08:45', '07:20', 'Yesterday', '3 days ago', '1 week ago'];

		const getTypeConfig = (type: string) => {
			switch (type) {
				case 'buy':
					return {icon: 'mdi:arrow-up', color: 'success', suffix: t('buy')};
				case 'sell':
					return {icon: 'mdi:arrow-down', color: 'danger', suffix: t('sell')};
				case 'deposit':
					return {icon: 'mdi:plus', color: 'primary', suffix: ''};
				case 'funding':
					return {icon: 'mdi:plus', color: 'primary', suffix: ''};
				default:
					return {icon: 'mdi:plus', color: 'primary', suffix: ''};
			}
		};

		return Array.from({length: 15}, (_, index) => {
			const type = types[Math.floor(Math.random() * types.length)];
			const symbol = symbols[Math.floor(Math.random() * symbols.length)];
			const time = times[Math.floor(Math.random() * times.length)];
			const amount = type === 'sell' ? -(Math.random() * 5000 + 100) : Math.random() * 5000 + 100;
			const config = getTypeConfig(type);

			return {
				id: index + 1,
				type,
				symbol,
				amount: Math.round(amount * 100) / 100,
				time,
				icon: config.icon,
				color: config.color,
				suffix: config.suffix
			};
		});
	};

	// 交易记录数据
	//const transactionData = generateTransactionData();
	const transactionData: any[] = [];

	// 交易记录项组件
	const TransactionItem = ({transaction}: {transaction: (typeof transactionData)[0]}) => (
		<div className='flex justify-between items-center p-2 bg-content2/20 rounded'>
			<div className='flex items-center gap-2'>
				<Icon icon={transaction.icon} className={`w-4 h-4 text-${transaction.color}`} />
				<span className='text-sm'>
					{transaction.symbol}
					{transaction.suffix}
				</span>
			</div>
			<div className='text-right'>
				<div className={`text-sm font-medium text-${transaction.color}`}>
					{transaction.amount > 0 ? '+' : ''}${transaction.amount.toFixed(2)}
				</div>
				<div className='text-xs text-primary-foreground/60'>{transaction.time}</div>
			</div>
		</div>
	);

	return (
		<div className='h-full flex flex-col'>
			<div className='flex-1 p-4 flex flex-col'>
				<div className='space-y-4 flex-1 flex flex-col'>
					{/* 交易记录 - 布满剩余高度 */}
					<div className='space-y-2 flex-1 flex flex-col'>
						<h4 className='text-sm font-semibold text-primary-foreground/80'>{t('recent_transactions')}</h4>
						<div className='space-y-2 flex-1 overflow-y-auto'>
							{transactionData.map(transaction => (
								<TransactionItem key={transaction.id} transaction={transaction} />
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

// 资金风控页面 - 资金去向检测
const RiskContent = () => {
	const t = useTranslations('user');

	// 监控项组件
	const MonitoringItem = ({icon, color, name, status}: {icon: string; color: string; name: string; status: string}) => (
		<div className='flex justify-between items-center p-3 bg-content2/20 rounded-lg'>
			<div className='flex items-center gap-2'>
				<Icon icon={icon} className={`w-4 h-4 text-${color}`} />
				<span className='text-sm'>{name}</span>
			</div>
			<span className={`text-xs text-${color}`}>{status}</span>
		</div>
	);

	return (
		<div className='h-full flex flex-col'>
			<div className='flex-1 p-4'>
				<div className='space-y-4'>
					{/* 风险等级 */}
					<div className='p-4 bg-content2/30 rounded-lg'>
						<div className='flex justify-between items-center mb-2'>
							<span className='text-sm font-medium'>{t('current_risk_level')}</span>
							<Chip color='success' size='sm'>
								{t('normal')}
							</Chip>
						</div>
						<div className='w-full bg-content3/30 rounded-full h-2'>
							<div className='bg-green-400 h-2 rounded-full' style={{width: '10%'}}></div>
						</div>
					</div>

					{/* 资金去向监控 */}
					<div className='space-y-3'>
						<h4 className='text-sm font-semibold text-primary-foreground/80'>{t('fund_monitoring')}</h4>
						<div className='space-y-2'>
							<MonitoringItem icon='mdi:check-circle' color='success' name={t('trading_account')} status={t('normal')} />
							<MonitoringItem icon='mdi:alert-circle' color='warning' name={t('liquidity_pool')} status={t('monitoring')} />
							{/* <MonitoringItem icon='mdi:check-circle' color='success' name={t('funding_account')} status={t('safe')} /> */}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

// 用户中心页面
const UserCenterContent = () => {
	const t = useTranslations('user');

	// 设置项组件
	const SettingItem = ({label, value}: {label: string; value: string}) => (
		<div className='flex justify-between items-center'>
			<span className='text-sm'>{label}</span>
			<Button size='sm' variant='bordered'>
				{value}
			</Button>
		</div>
	);

	return (
		<div className='h-full flex flex-col'>
			<div className='flex-1 p-4'>
				<div className='space-y-4'>
					{/* 账户设置 */}
					<div className='space-y-3'>
						<SettingItem label={t('nickname')} value={t('modify')} />
						<SettingItem label={t('email')} value={t('bind')} />
						<SettingItem label='X' value={t('bind')} />
						<SettingItem label='Telegram' value={t('bind')} />
						<SettingItem label='Discord' value={t('bind')} />
						<SettingItem label='Google' value={t('bind')} />
					</div>
				</div>
			</div>
		</div>
	);
};

// 通知中心页面
const NoticeContent = () => {
	const t = useTranslations('user');

	// 通知项组件
	const NoticeItem = ({color, title, content, time}: {color: string; title: string; content: string; time: string}) => (
		<div className={`p-3 bg-content2/30 rounded-lg border-l-4 border-${color}`}>
			<div className='flex justify-between items-start'>
				<div className='flex-1'>
					<p className='text-sm font-medium'>{title}</p>
					<p className='text-xs text-primary-foreground/60 mt-1'>{content}</p>
				</div>
				<span className='text-xs text-primary-foreground/40'>{time}</span>
			</div>
		</div>
	);

	return (
		<div className='h-full flex flex-col'>
			<div className='flex-1 overflow-y-auto p-4'>
				<div className='space-y-4'>
					{/* 通知列表 */}
					<div className='space-y-2'>
						{/* <NoticeItem color='primary' title={t('system_maintenance')} content={t('maintenance_schedule')} time='2025-01-20 10:00' />
						<NoticeItem color='success' title={t('new_feature')} content={t('funding_feature')} time='2025-01-19 15:30' />
						<NoticeItem color='warning' title={t('security_alert')} content={t('abnormal_login')} time='2025-01-18 09:15' />
						<NoticeItem color='secondary' title={t('activity_notice')} content={t('invite_friends')} time='2025-01-17 14:20' /> */}
					</div>
				</div>
			</div>
		</div>
	);
};

// 偏好设置页面
const PrefsContent = () => {
	const t = useTranslations('user');

	// 设置项组件
	const SettingItem = ({label, value, isChip}: {label: string; value: string; isChip?: boolean}) => (
		<div className='flex justify-between items-center'>
			<span className='text-sm'>{label}</span>
			{isChip ? (
				<Chip color='success' size='sm'>
					{value}
				</Chip>
			) : (
				<Button size='sm' variant='bordered'>
					{value}
				</Button>
			)}
		</div>
	);

	return (
		<div className='h-full flex flex-col'>
			<div className='flex-1 p-4'>
				<div className='space-y-4'>
					<div className='space-y-4'>
						<div className='space-y-3'>
							<h4 className='text-sm font-semibold text-primary-foreground/80'>{t('basic_settings')}</h4>
							<SettingItem label={t('language_setting')} value={t('chinese')} />
							<SettingItem label={t('theme_mode')} value={t('auto')} />
							<SettingItem label={t('timezone_setting')} value='UTC+8' />
						</div>

						<div className='space-y-3'>
							<h4 className='text-sm font-semibold text-primary-foreground/80'>{t('trading_settings')}</h4>
							<SettingItem label={t('price_alerts')} value={t('enabled')} />
						</div>

						<div className='space-y-3'>
							<h4 className='text-sm font-semibold text-primary-foreground/80'>{t('security_settings')}</h4>
							<SettingItem label={t('two_factor_auth')} value={t('enabled_status')} isChip />
							<SettingItem label={t('login_protection')} value={t('enabled_status')} isChip />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

// 联系客服页面
const SupportContent = () => {
	const t = useTranslations('user');

	// FAQ项组件
	const FAQItem = ({question, answer}: {question: string; answer: string}) => (
		<div className='p-3 bg-content2/30 rounded-lg'>
			<p className='text-sm font-medium'>{question}</p>
			<p className='text-xs text-primary-foreground/60 mt-1'>{answer}</p>
		</div>
	);

	// 联系方式组件
	const ContactItem = ({icon, text}: {icon: string; text: string}) => (
		<div className='flex items-center gap-2 text-sm'>
			<Icon icon={icon} className='w-4 h-4 text-primary' />
			<span>{text}</span>
		</div>
	);

	return (
		<div className='h-full flex flex-col'>
			<div className='flex-1 p-4'>
				<div className='space-y-4'>
					{/* 联系方式 */}
					<div className='grid grid-cols-2 gap-4 mb-4'>
						<Button className={button({color: 'primary'})}>{t('online_service')}</Button>
						<Button className={button({color: 'primary'})}>{t('community_feedback')}</Button>
					</div>

					{/* 常见问题 */}
					<div className='space-y-3'>
						<h4 className='text-sm font-semibold text-primary-foreground/80'>{t('frequently_asked')}</h4>
						<div className='space-y-2'>
							<FAQItem question={t('how_to_deposit')} answer={t('deposit_methods')} />
							<FAQItem question={t('trading_fees')} answer={t('vip_discounts')} />
							<FAQItem question={t('how_to_funding')} answer={t('funding_mode')} />
						</div>
					</div>

					{/* 联系方式 */}
					<div className='space-y-3'>
						<h4 className='text-sm font-semibold text-primary-foreground/80'>{t('contact_methods')}</h4>
						<div className='space-y-2'>
							<ContactItem icon='mdi:twitter' text='https://x.com/NeuraFi679' />
							<ContactItem icon='mdi:telegram' text='https://t.me/@NeuraFi6791' />
							<ContactItem icon='mdi:discord' text='https://t.me/@NeuraFi6791' />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

// 关于我们页面
const AboutContent = () => {
	const t = useTranslations('user');

	// 信息项组件
	const InfoItem = ({label, value}: {label: string; value: string}) => (
		<div className='flex justify-between'>
			<span>{label}</span>
			<span className='text-primary-foreground/60'>{value}</span>
		</div>
	);

	// 法律条款组件
	const LegalItem = ({title}: {title: string}) => (
		<div className='flex justify-between items-center'>
			<span className='text-sm'>{title}</span>
			<Button size='sm' variant='bordered'>
				{t('view')}
			</Button>
		</div>
	);

	return (
		<div className='h-full flex flex-col'>
			<div className='flex-1 p-4'>
				<div className='space-y-4'>
					{/* 应用信息 */}
					<div className='p-4 bg-content2/30 rounded-lg mb-4'>
						<div className='space-y-2 text-sm'>
							<InfoItem label={t('version')} value='1.0.0' />
							<InfoItem label={t('build_time')} value='2025-08-18' />
							<InfoItem label={t('developer')} value='NeuraFi Team' />
						</div>
					</div>

					{/* 法律条款 */}
					<div className='space-y-3'>
						<LegalItem title={t('terms_of_service')} />
						<LegalItem title={t('privacy_policy')} />
						<LegalItem title={t('open_source_license')} />
					</div>
				</div>
			</div>
		</div>
	);
};

// ===== MenuList Component =====
export const MenuList = ({onMenuClick}: {onMenuClick: (key: string) => void}) => {
	const t = useTranslations('user');
	const [currentMenu, setCurrentMenu] = useState<string | null>(null);

	const menus = [
		{key: 'funds', label: t('funds'), icon: 'mdi:credit-card-outline'},
		{key: 'risk', label: t('risk_control'), icon: 'mdi:shield-check-outline'},
		{key: 'user-center', label: t('user_center'), icon: 'mdi:account-outline'},
		{key: 'notice', label: t('notifications'), icon: 'mdi:bell-outline'},
		{key: 'prefs', label: t('preferences'), icon: 'mdi:cog-outline'},
		{key: 'support', label: t('customer_service'), icon: 'mdi:headset'},
		{key: 'about', label: t('about'), icon: 'mdi:information-outline'}
	];

	const handleMenuClick = (key: string) => {
		setCurrentMenu(key);
		onMenuClick(key);
	};

	const handleBack = () => {
		setCurrentMenu(null);
	};

	// 获取当前菜单的标题
	const getCurrentMenuTitle = () => {
		const menu = menus.find(m => m.key === currentMenu);
		return menu ? menu.label : '';
	};

	// 渲染菜单内容
	const renderMenuContent = () => {
		switch (currentMenu) {
			case 'funds':
				return <FundsContent />;
			case 'risk':
				return <RiskContent />;
			case 'user-center':
				return <UserCenterContent />;
			case 'notice':
				return <NoticeContent />;
			case 'prefs':
				return <PrefsContent />;
			case 'support':
				return <SupportContent />;
			case 'about':
				return <AboutContent />;
			default:
				// 默认返回菜单列表
				return (
					<div className='h-full rounded-2xl overflow-hidden border border-content3/20 divide-y divide-content3/10 bg-content1/40'>
						{menus.map(m => (
							<button key={m.key} onClick={() => handleMenuClick(m.key)} className='w-full flex items-center justify-between px-4 py-4 hover:bg-content2/40 transition-colors'>
								<div className='flex items-center gap-3'>
									<Icon icon={m.icon} width={20} className='text-primary-foreground' />
									<span className='text-base'>{m.label}</span>
								</div>
								<Icon icon='mdi:chevron-right' width={22} className='text-primary-foreground-400' />
							</button>
						))}
					</div>
				);
		}
	};

	// 统一返回固定高度的容器
	return (
		<div className='w-full h-full'>
			{/* 内容区域 - 包裹圆角背景 */}
			<div className='flex flex-col h-full w-full rounded-2xl bg-content1/40 border border-content3/20 overflow-hidden'>
				{currentMenu && (
					<>
						<div className='flex items-center gap-3 mt-4 pl-2'>
							<Button isIconOnly variant='light' onPress={handleBack} aria-label={t('back')}>
								<Icon icon='mingcute:back-fill' className='text-primary' width={20} />
							</Button>
							<h3 className='text-lg font-semibold'>{getCurrentMenuTitle()}</h3>
						</div>
						{/* 分割线 - 使用容器包裹 */}
						<div className='px-4'>
							<div className='w-full h-px bg-primary-foreground/30' />
						</div>
					</>
				)}
				<ScrollShadow className='custom-scrollbar'>{renderMenuContent()}</ScrollShadow>
			</div>
		</div>
	);
};
