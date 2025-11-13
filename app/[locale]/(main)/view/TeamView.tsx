'use client';
import React, {useState, useEffect} from 'react';
import {useSearchParams} from 'next/navigation';
import {Card, CardBody, Button, Avatar} from '@heroui/react';
import {Icon} from '@iconify/react';
import {useAppKitAccount} from '@reown/appkit/react';
import {useTranslations} from 'next-intl';
import {useUserDataStore} from '@/app/store';
import {button} from '@/components';
import {PROJECT_CONFIG} from '@/config/main';
import {useNeuraFiAccount, useTeam} from '@/lib/hooks';
import {obsTxt} from '@/lib/utils';

// ===== 团队视图 创建账户 =====
export function TeamView() {
	const t = useTranslations('user');
	const {address} = useAppKitAccount();
	const {userData} = useUserDataStore();
	const [leaderAddress, setLeaderAddress] = useState<string>();
	const [slugError, setSlugError] = useState<string>('');
	const searchParams = useSearchParams();
	const slug = searchParams.get('slug');
	const {createAccountByReferrer} = useNeuraFiAccount({token: PROJECT_CONFIG.stablecoin[0].address});
	const {addressFromSlug, isValidSlug} = useTeam({token: PROJECT_CONFIG.stablecoin[0].address});

	useEffect(() => {
		// 多种方法提取 slug
		let extractedSlug = null;
		let rawUrlString = '';

		if (typeof window !== 'undefined') {
			rawUrlString = window.location.href;

			// 方法1: 尝试从 searchParams 获取
			extractedSlug = searchParams.get('slug');
			if (extractedSlug) {
				console.log('方法1: searchParams 获取的 slug:', extractedSlug);
			}

			// 方法2: 如果 searchParams 获取不到，使用固定长度提取
			if (!extractedSlug) {
				// 查找 slug= 后面的 27 个字符
				const slugMatch = rawUrlString.match(/slug=([A-Za-z0-9+/=_-]{27})/i);
				if (slugMatch) {
					extractedSlug = slugMatch[1];
					console.log('方法2: 固定长度提取的 slug:', extractedSlug);
				}
			}

			// 方法3: 如果还是找不到，尝试更宽松的匹配
			if (!extractedSlug) {
				const looseMatch = rawUrlString.match(/slug=([A-Za-z0-9+/=_-]+)/i);
				if (looseMatch) {
					extractedSlug = looseMatch[1];
					console.log('方法3: 宽松匹配的 slug:', extractedSlug);
				}
			}
		}

		// 使用提取的 slug
		const currentSlug = extractedSlug ?? slug;

		if (currentSlug) {
			try {
				let processedSlug = currentSlug;

				// 1. 处理双重编码的 & 符号
				processedSlug = processedSlug
					.replace(/&amp%3B/g, '&')
					.replace(/&amp;/g, '&')
					.replace(/%26/g, '&');

				// 2. URL 解码
				try {
					processedSlug = decodeURIComponent(processedSlug);
				} catch (e) {
					//console.warn('URL 解码失败:', e);
				}

				// 3. HTML 实体解码
				processedSlug = processedSlug
					.replace(/&amp;/g, '&')
					.replace(/&lt;/g, '<')
					.replace(/&gt;/g, '>')
					.replace(/&quot;/g, '"')
					.replace(/&nbsp;/g, ' ');

				// 4. 移除跟踪参数
				processedSlug = processedSlug.split('&')[0].split('?')[0];

				// 5. 清理无效字符
				processedSlug = processedSlug.replace(/[^A-Za-z0-9+/=_-]/g, '');

				//console.log('最终处理后的 slug:', processedSlug, '长度:', processedSlug.length);

				if (processedSlug.length === 27 && isValidSlug(processedSlug)) {
					const address = addressFromSlug(processedSlug);
					setLeaderAddress(address);
					setSlugError('');
					//console.log('✅ 成功解析地址:', address);
				} else {
					const errorMsg = `invalid slug: length=${processedSlug.length}, valid=${isValidSlug(processedSlug)}`;
					setSlugError(errorMsg);
					console.error('❌', errorMsg);
				}
			} catch (error: any) {
				setSlugError(`error: ${error.message}`);
				//console.error('❌ 处理失败:', error);
			}
		} else {
			console.log('⚠️ slug');
		}
	}, [slug, searchParams, addressFromSlug, isValidSlug]);

	const handleCreateAccount = async () => {
		if (!slug && !leaderAddress) {
			return;
		}
		createAccountByReferrer(leaderAddress);
	};

	const hasValidSlug = Boolean(slug && leaderAddress);
	const hasWallet = Boolean(address);
	const hasAccount = Boolean(userData.slug);
	const canCreateAccount = hasWallet && !hasAccount && hasValidSlug;

	return (
		<div className='min-h-screen flex items-start md:items-center justify-center p-2 md:p-4'>
			<div className='w-full max-w-md space-y-3 pt-4 md:pt-0'>
				{/* 原有卡片 */}
				<Card className='bg-primary-background border-primary-border shadow-2xl hover:shadow-3xl transition-all duration-500'>
					<CardBody className='p-6 text-center space-y-6'>
						{/* 推荐人信息 */}
						<div className='space-y-4'>
							{/* 头像区域 */}
							<div className='flex items-center justify-center gap-3'>
								<Avatar src={'/favicon.png'} name={userData?.slug} size='lg' className='bg-primary-ground shadow-xl' />
								<div className='flex flex-col items-start'>
									<h2 className='text-xl font-bold text-primary-foreground font-heading'>NeuraFi</h2>
									<p className='text-xs text-primary-foreground/60'>{t('decentralized_financial_platform')}</p>
								</div>
							</div>

							{/* 推荐人地址或提示 */}
							{hasValidSlug ? (
								<div className='bg-primary-ground px-4 py-2 rounded-2xl border border-primary-border'>
									<p className='text-small text-primary-foreground font-mono font-medium'>{leaderAddress ? obsTxt(leaderAddress, 4, 4) : t('unknown_address')}</p>
								</div>
							) : (
								<div className='text-center p-3 bg-warning-50 rounded-lg border border-warning-200'>
									<div className='flex items-center justify-center gap-2 mb-1'>
										<Icon icon='mdi:alert-circle' className='w-4 h-4 text-warning-600' />
										<span className='text-sm font-medium text-warning-800'>{t('no_referral_link_title')}</span>
									</div>
									<p className='text-xs text-warning-700'>{t('no_referral_link_desc')}</p>
									{slugError && <div className='mt-2 p-2 bg-red-100 rounded text-xs text-red-600'>{slugError}</div>}
								</div>
							)}
						</div>

						{/* 推荐关系说明 */}
						{hasAccount ? (
							<div className='text-center p-3 bg-success-50 rounded-lg border border-success-200'>
								<div className='flex items-center justify-center gap-2 mb-1'>
									<Icon icon='mdi:check-circle' className='w-4 h-4 text-success-600' />
									<span className='text-sm font-medium text-success-800'>{t('account_created')}</span>
								</div>
								<p className='text-xs text-success-700'>{t('account_created_desc')}</p>
							</div>
						) : (
							<div className='bg-primary-ground rounded-2xl p-6 border border-primary-border space-y-3'>
								<div className='flex items-center justify-center gap-2'>
									<div className='w-8 h-8 bg-primary rounded-full flex items-center justify-center'>
										<Icon icon='mdi:link-variant' className='w-5 h-5 text-primary-foreground' />
									</div>
									<span className='text-lg font-bold text-primary-foreground font-heading'>{t('create_account')}</span>
								</div>

								<p className='text-primary-foreground/80 text-xs leading-relaxed'>{t('referral_relationship_desc')}</p>
								<div className='space-y-2'>
									{[
										{icon: 'mdi:wallet', text: t('connect_wallet')},
										{icon: 'mdi:link', text: t('sign_confirm')}
									].map((step, index) => (
										<div key={index} className='flex items-center gap-3 p-2 bg-primary-background rounded-lg '>
											<div className='w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-black'>{index + 1}</div>
											<div className='flex items-center gap-2 flex-1'>
												<Icon icon={step.icon} className='w-4 h-4 text-primary' />
												<span className='text-xs text-primary-foreground/80 font-medium'>{step.text}</span>
											</div>
										</div>
									))}
								</div>

								<div className='flex items-center justify-center gap-2 p-2'>
									<Icon icon='mdi:gift' className='w-4 h-4 text-primary' />
									<span className='text-xs text-primary-foreground/80 font-medium'>{t('enjoy_rewards')}</span>
								</div>

								{/* 创建账户按钮 */}
								<Button color='primary' size='md' className={button()} onPress={handleCreateAccount} isDisabled={!canCreateAccount || !leaderAddress}>
									{t('create_account')}
								</Button>
							</div>
						)}
					</CardBody>
				</Card>

				{/* 底部说明 */}
				<div className='text-center space-y-2 pb-4'>
					<p className='text-tiny text-primary-foreground/60 leading-relaxed'>{t('terms_agreement')}</p>
					<div className='flex justify-center gap-4 text-tiny text-primary-foreground/60'>
						<span className='flex items-center gap-1 px-2 py-1 bg-primary-ground rounded-full border border-primary-border'>
							<Icon icon='mdi:shield-check' className='w-3 h-3' />
							{t('secure_reliable')}
						</span>
						<span className='flex items-center gap-1 px-2 py-1 bg-primary-ground rounded-full border border-primary-border'>
							<Icon icon='mdi:clock' className='w-3 h-3' />
							{t('instant_effect')}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
