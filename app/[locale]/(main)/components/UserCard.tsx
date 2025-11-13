'use client';

import {useMemo, useState, useEffect} from 'react';
import {useSearchParams} from 'next/navigation';
import {cn, Card, CardHeader, CardBody, Button, Input, ScrollShadow, Spacer, Image} from '@heroui/react';
import {Icon} from '@iconify/react';
import {useTranslations} from 'next-intl';
import {TwitterShareButton, TwitterIcon, TelegramShareButton, TelegramIcon, WhatsappShareButton, WhatsappIcon, LineShareButton, LineIcon, FacebookShareButton, FacebookIcon, LinkedinShareButton, LinkedinIcon, RedditShareButton, RedditIcon, WeiboShareButton, WeiboIcon, EmailShareButton, EmailIcon, HatenaShareButton, HatenaIcon} from 'next-share';
import {useUserDataStore, useModalStore} from '@/app/store';
import {button} from '@/components';
import {InputClass} from '@/components/class';
import {CopyButton, Snippet} from '@/components/client/common';
import {useAvatarImage, useNeuraFiAccount, useTeam} from '@/lib/hooks';
import {useBrowserWallet} from '@/lib/hooks/wallet';
import {obsTxt, fmtMoney, pct} from '@/lib/utils';

//修改用户名 参数位一个方法
export const SetNameModal = ({onSetName, isLoading}: {onSetName: (name: string) => void; isLoading: boolean}) => {
	const tUser = useTranslations('user');
	const {userData} = useUserDataStore();
	const [nameInput, setNameInput] = useState<string>(userData.name);

	return (
		<div className='flex flex-col gap-4'>
			<Input classNames={InputClass} placeholder={tUser('enter_team_name')} defaultValue={''} onChange={e => setNameInput(e.target.value)} />
			<Button color='primary' className={cn(button(), 'mb-4')} isLoading={isLoading} onPress={() => onSetName(nameInput)}>
				{tUser('confirm_modify')}
			</Button>
		</div>
	);
};

// 资产卡片组件
export const UserCard = ({isInvite = false, token}: {isInvite?: boolean; token: string}) => {
	const searchParams = useSearchParams();
	const slug = searchParams.get('slug'); //当前tab
	const {address} = useBrowserWallet();
	const t = useTranslations('common');
	const tUser = useTranslations('user');
	const [masked, setMasked] = useState<boolean>(false); // 是否隐藏资金
	const {showModal, closeModal} = useModalStore();
	const {isLoading, setName, userData, createAccountByReferrer} = useNeuraFiAccount({token: token});
	const {addressFromSlug} = useTeam({token: token});
	const [leaderAddress, setLeaderAddress] = useState<string>();

	// 你自己的推广链接
	const shareUrl = `https://NeuraFi.org/?tab=team&slug=${userData.slug}`;
	const shareTitle = tUser('share_title');
	const shareText = `https://NeuraFi.org/?tab=team&slug=${userData.slug}`;

	useEffect(() => {
		if (slug) {
			setLeaderAddress(addressFromSlug(slug)); //console.log('检测到slug', slug);
		}
	}, [slug, addressFromSlug]);

	const handleShare = () => {
		showModal({
			label: t('share'),
			body: <ShareModal url={shareUrl} title={shareTitle} text={shareText} />,
			footer: (
				<Button color='primary' className={button()} onPress={closeModal}>
					{t('close')}
				</Button>
			)
		});
	};
	// 用户画像
	const handleUserAvatar = () => {
		showModal({label: t('share'), body: <ImageModal />});
	};

	// 修改用户名
	const handleSetName = () => {
		showModal({label: tUser('modify_nickname'), body: <SetNameModal onSetName={setName} isLoading={isLoading} />});
	};
	//创建账户
	const handleCreateAccount = () => createAccountByReferrer(leaderAddress);

	//按钮配置
	const buttonConfig = [
		{icon: masked ? 'mdi:eye-off-outline' : 'mdi:eye-outline', ariaLabel: masked ? tUser('show_funds') : tUser('masked_funds'), onClick: () => setMasked(m => !m)},
		{icon: 'mdi:account-box-multiple', ariaLabel: tUser('share_profile'), onClick: handleUserAvatar},
		{icon: 'mdi:share-variant-outline', ariaLabel: tUser('share_link'), onClick: handleShare}
	];

	return (
		//取消滚动条 不显示
		<Card className='bg-linear-to-tr from-primary/60 to-primary text-black min-h-45 shadow-lg  overflow-hidden'>
			{userData.team ? (
				<>
					<CardHeader className='flex items-center justify-between pb-2 overflow-hidden'>
						<span className='text-sm/6 opacity-90 font-semibold'>{masked ? '••••' : obsTxt(address ?? '0x0000000000000000000000000000000000000000', 4, 4)}</span>
						<div className='flex items-center gap-2'>
							{buttonConfig.map(button => (
								<Button isIconOnly key={button.icon} size='sm' variant='light' className='text-black' onPress={button.onClick} aria-label={button.ariaLabel}>
									<Icon icon={button.icon} width={20} />
								</Button>
							))}
						</div>
					</CardHeader>
					<CardBody className='pt-0  overflow-hidden'>
						<div className='flex items-center justify-between w-full overflow-hidden'>
							<div className='flex items-center gap-3 w-full'>
								<div className='size-11 rounded-full bg-content3/40 flex items-center justify-center'>
									<Icon icon='fxemoji:dizzyface' width={28} className='flex-shrink-0' />
								</div>
								<div className='flex flex-col'>
									<div className='flex items-center gap-2 w-full'>
										<div className='font-semibold'>{userData.name}</div>
										<Button size='sm' isIconOnly variant='light' className='h-5 min-w-0 flex-shrink-0' onPress={() => handleSetName()}>
											<Icon icon='jam:write' className='w-3 h-3 flex-shrink-0 text-black' />
										</Button>
									</div>
									<div className='flex items-center gap-2 w-full'>
										<span className='text-xs text-primary-foreground-500 whitespace-nowrap'>{tUser('user_contract')}:</span>
										<span className='text-xs text-primary-foreground-500 whitespace-nowrap hidden md:block'>{masked ? '••••' : obsTxt(userData.account, 6, 6)}</span>
										<CopyButton text={userData.account} iconClass='text-black' />
									</div>
								</div>
							</div>
							<div className='flex flex-col items-end gap-1  w-full'>
								<p className='text-xs'>{tUser('dynamic_income')}</p>
								<p className='text-2xl font-bold tabular-nums w-full text-right'>{fmtMoney(userData.equity, masked)} $</p>
							</div>
						</div>
						<div className='mt-4 flex items-center justify-between'>
							<div className='flex flex-col items-start gap-1 text-sm w-full'>
								<p className='opacity-75'>{tUser('earned')}</p>
								<p className='mt-1 tabular-nums'>{fmtMoney(userData.interests, masked)}$</p>
							</div>
							<div className='flex flex-col items-center gap-1 text-sm w-full'>
								<p className='opacity-75'>{tUser('available_funds')}</p>
								<p className='mt-1 tabular-nums'>{fmtMoney(userData.activeFunds, masked)}$</p>
							</div>
							<div className='flex flex-col items-end gap-1 text-sm w-full'>
								<p className='opacity-75'>{tUser('risk_level')}</p>
								<p className='mt-1 tabular-nums'>{masked ? '••••' : pct(userData.riskRatio)}</p>
							</div>
						</div>
					</CardBody>
				</>
			) : (
				<CardBody className='flex flex-col items-center justify-center py-8 space-y-4 overflow-hidden'>
					<div className='flex flex-col items-center space-y-3'>
						<div className='w-16 h-16 rounded-full bg-content3/40 flex items-center justify-center'>
							<Icon icon='mdi:account-plus' className='w-8 h-8 text-primary' />
						</div>
						<div className='text-center'>
							<h3 className='text-lg font-semibold text-black mb-1'>{tUser('create_account')}</h3>
							<p className='text-sm text-black/70'>{tUser('connect_wallet')}</p>
						</div>
					</div>
					<Button color='primary' className='text-black' size='lg' isDisabled={!slug && !isInvite} startContent={<Icon icon='mdi:wallet' className='w-5 h-5  text-black' />} onPress={handleCreateAccount}>
						{tUser('create_account')}
					</Button>
				</CardBody>
			)}
		</Card>
	);
};

//分享
async function nativeShare(p: {url: string; title?: string; text?: string}) {
	if (typeof navigator !== 'undefined' && navigator.share) {
		try {
			await navigator.share(p);
			return true;
		} catch {
			// 用户取消或不支持文件分享等
		}
	}
	return false;
}

// ================== 推荐/分享模态 ==================

const ShareModal = ({url, title, text}: {url: string; title: string; text?: string}) => {
	const t = useTranslations('common');
	const onNativeShare = async () => await nativeShare({url, title, text});

	return (
		<div className='flex flex-col gap-4'>
			{/* 复制链接 */}
			<Snippet variant='flat' symbol='Link:' className='flex-1' codeString={url}>
				<span className='text-xs'>{obsTxt(url, 11, 8)}</span>
			</Snippet>

			<div className='flex items-center justify-between'>
				<p>{t('share')}</p>
				<Button isIconOnly size='sm' className='bg-transparent' onPress={onNativeShare}>
					<Icon icon='weui:more-filled' className='w-6 h-6 flex-shrink-0 text-green-400' />
				</Button>
			</div>
			{/* 方案 B：直链回退（用 next-share 自带的图标按钮） */}
			<ScrollShadow orientation='horizontal' className='w-full custom-scrollbar flex items-center gap-3' hideScrollBar>
				{/* 原有的两个按钮 */}
				<TwitterShareButton url={url} title={text}>
					<TwitterIcon size={36} round />
				</TwitterShareButton>

				<TelegramShareButton url={url} title={text}>
					<TelegramIcon size={36} round />
				</TelegramShareButton>

				{/* 新增：Line（日本常用） */}
				<LineShareButton url={url} title={text}>
					<LineIcon size={36} round />
				</LineShareButton>

				{/* 新增：WhatsApp（全球常用） */}
				<WhatsappShareButton url={url} title={text} separator=' — '>
					<WhatsappIcon size={36} round />
				</WhatsappShareButton>

				{/* 新增：Facebook（支持 quote / 单一 hashtag） */}
				<FacebookShareButton url={url} quote={text}>
					<FacebookIcon size={36} round />
				</FacebookShareButton>

				{/* 新增：LinkedIn（读取 OG 标签为主） */}
				<LinkedinShareButton url={url}>
					<LinkedinIcon size={36} round />
				</LinkedinShareButton>

				{/* 新增：Reddit（title + url） */}
				<RedditShareButton url={url} title={text}>
					<RedditIcon size={36} round />
				</RedditShareButton>

				{/* 新增：Weibo（可选 image 参数；没有也能用） */}
				<WeiboShareButton url={url} title={text}>
					<WeiboIcon size={36} round />
				</WeiboShareButton>

				{/* 新增：Email（主题/正文） */}
				<EmailShareButton url={url} subject={title ?? 'Check this out'} body={text ? `${text} ${url}` : url}>
					<EmailIcon size={36} round />
				</EmailShareButton>

				{/* 新增：Hatena（日本常见书签站） */}
				<HatenaShareButton url={url} title={text}>
					<HatenaIcon size={36} round />
				</HatenaShareButton>
			</ScrollShadow>
		</div>
	);
};

//用户画像下载
const ImageModal = () => {
	const t = useTranslations('common');
	const tUser = useTranslations('user');
	const {userData} = useUserDataStore();
	const {imageUrl, isLoading, generateAvatarImage, downloadImage, isClient} = useAvatarImage();
	const [isMobile, setIsMobile] = useState(true); //是否为移动端

	// 客户端检测
	useEffect(() => {
		setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
	}, []);

	// 等待 isClient 和 userData 都准备好后再生成图片
	useEffect(() => {
		if (isClient && userData?.address) {
			//console.log('开始生成图片，userData:', userData);
			generateAvatarImage({data: userData});
		}
	}, [isClient, userData?.address]); // 只依赖这两个关键状态

	const handleDownload = async () => {
		const success = await downloadImage();
		if (success && isMobile) {
			//console.log('图片保存操作已触发');
		}
	};

	return (
		<div className='flex flex-col gap-4'>
			<div className='mt-4 flex flex-col gap-4'>
				{isLoading ? (
					<div className='flex items-center justify-center w-full'>
						<Icon icon='svg-spinners:blocks-wave' width={24} className='text-primary w-[64px] h-[64px]' />
					</div>
				) : (
					<>
						{imageUrl ? (
							<div className='relative'>
								<Image src={imageUrl} alt={tUser('user_profile')} className='w-full rounded-lg' />
							</div>
						) : (
							<div className='flex items-center justify-center w-full h-64 bg-gray-100 rounded-lg'>
								<div className='text-center'>
									<Icon icon='mdi:image-off' className='w-12 h-12 text-gray-400 mx-auto mb-2' />
									<p className='text-sm text-gray-500'>{tUser('image_generation_failed')}</p>
									{/* <p className='text-xs text-gray-400 mt-1'>isClient: {isClient.toString()}</p> */}
									{/* <p className='text-xs text-gray-400 mt-1'>userData: {userData ? tUser('has_data') : tUser('no_data')}</p> */}
									{/* <p className='text-xs text-gray-400 mt-1'>address: {userData?.address || tUser('no_address')}</p> */}
								</div>
							</div>
						)}
						{/* 移动端显示详细提示 */}
						{isMobile && imageUrl && (
							<div className='flex flex-col items-center gap-3 p-4 bg-[#033438] rounded-lg border border-primary-border'>
								<div className='flex items-center gap-2'>
									<Icon icon='mdi:hand-tap' className='w-6 h-6 text-primary' />
									<span className='text-sm font-medium text-primary-foreground'>{tUser('save_image_method')}</span>
								</div>
								<div className='text-xs text-primary-foreground/70 text-center space-y-1'>
									<p>{tUser('method_1')}</p>
									<p>{tUser('method_2')}</p>
								</div>
							</div>
						)}
					</>
				)}
				<Spacer y={4} />
			</div>
			{/* 只在有图片时显示下载按钮 */}
			{imageUrl && (
				<Button color='primary' className={cn(button(), 'mb-4')} onPress={handleDownload} startContent={<Icon icon='mdi:content-save' width={18} />}>
					{t('save')}
				</Button>
			)}
		</div>
	);
};
