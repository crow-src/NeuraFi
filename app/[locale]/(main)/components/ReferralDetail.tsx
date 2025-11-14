'use client';

//import {useMemo, useState} from 'react';
import {cn, Card, CardBody, Button} from '@heroui/react';
import {Icon} from '@iconify/react';
import {useTranslations} from 'next-intl';
import {useModalStore} from '@/app/store';
import {CopyButton} from '@/components/client/common';
import {BaseTable} from '@/components/client/table';
import {useTeam} from '@/lib/hooks/evm';
import {obsTxt, copyText, fixDec} from '@/lib/utils';
import {button} from '@components/primitives';
import {SetNameModal} from './UserCard';

// ===== 推广信息 Component =====
export const ReferralDetail = ({isSmall, onBack, token}: {isSmall: boolean; onBack?: () => void; token: string}) => {
	const t = useTranslations('user');
	const {showModal, closeModal} = useModalStore();
	const {setName, data: teamData, claimReferralBonus, claimLevelBonus, isLoading} = useTeam({token});

	// 如果没有 slug，直接返回 null 隐藏组件
	if (!teamData) {
		return null;
	}
	// 表格头部配置
	const tableHead = [
		{name: 'address', uid: 'address', sortable: false},
		{name: 'referrals', uid: 'referrals', sortable: true}
	];

	// 修改名称
	const handleSetName = () => {
		showModal({
			label: t('modify_team_name'),
			body: <SetNameModal onSetName={setName} isLoading={isLoading} />
		});
	};

	//显示为小卡片
	if (isSmall) {
		return (
			<Card className='bg-gradient-to-br from-secondary/20 to-secondary/10 border-secondary/30'>
				<CardBody className='p-4'>
					<div className='flex items-center justify-between mb-3'>
						<div className='flex items-center gap-2'>
							<Icon icon='mdi:account-group' className='w-5 h-5 text-secondary' />
							<span className='font-semibold'>{t('team_promotion')}</span>
						</div>
						<Button size='sm' variant='bordered' color='secondary' onPress={onBack}>
							{t('view')}
						</Button>
					</div>
					<div className='grid grid-cols-3 gap-3 text-sm'>
						<div className='text-center flex flex-col justify-between min-h-[2.5rem]'>
							{/* 团队名称 不能被压缩 */}
							<div className='text-sm font-bold text-success truncate'>{teamData?.name === '' ? 'Null' : teamData?.name}</div>
							<div className='text-xs text-primary-foreground/60'>{t('team_name')}</div>
						</div>
						{/* //直接推荐 */}
						<div className='text-center flex flex-col justify-between min-h-[2.5rem]'>
							<div className='text-lg font-bold text-secondary'>{teamData?.referrals?.length ?? 0}</div>
							<div className='text-xs text-primary-foreground/60'>{t('direct_referrals')}</div>
						</div>
						{/* 业绩 */}
						<div className='text-center flex flex-col justify-between min-h-[2.5rem]'>
							<div className='text-lg font-bold text-warning'>{teamData?.level ?? 0}</div>
							<div className='text-xs text-primary-foreground/60'>{t('my_level')}</div>
						</div>
					</div>
				</CardBody>
			</Card>
		);
	}

	//显示为完整数据
	return (
		<div className='mx-auto w-full flex flex-col gap-4 h-full'>
			{/* 返回按钮（仅在小屏显示）*/}
			{!isSmall && onBack && (
				<div className='flex items-center gap-3'>
					<Button isIconOnly variant='light' onPress={onBack} aria-label={t('back')}>
						<Icon icon='mingcute:back-fill' className='text-primary' width={20} />
					</Button>
					<div>
						<h2 className='text-xl font-semibold'>{t('team_promotion_details')}</h2>
						<p className='text-sm text-primary-foreground/60'>{t('view_promotion_data')}</p>
					</div>
				</div>
			)}

			{/* 推广统计 */}
			<div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
				<Card className='p-4 text-center items-center'>
					<span className='whitespace-nowrap text-lg font-bold text-warning'>{teamData?.name === '' ? 'Null' : teamData?.name}</span>
					<div className='flex items-center gap-1'>
						<span className='text-sm text-primary-foreground/60'>{t('team_name')}</span>
						{teamData?.address === teamData?.leader && (
							<Button size='sm' isIconOnly variant='light' className=' min-w-0' onPress={handleSetName}>
								<Icon icon='jam:write' className='w-4 h-4 shrink-0 text-primary' />
							</Button>
						)}
					</div>
				</Card>

				<Card className='p-4 text-center'>
					<span className='text-2xl font-bold text-primary'>{teamData?.teamSize ?? 0}</span>
					<span className='text-sm text-primary-foreground/60'>{t('team_members')}</span>
				</Card>
				<Card className='p-4 text-center'>
					<span className='text-2xl font-bold text-success'>{fixDec(teamData?.levelBonus ?? 0, 2)}</span>
					<span className='text-sm text-primary-foreground/60'>{t('team_reward')}</span>
					<span className='text-sm text-primary-foreground/60'>{t('earned') + ': ' + fixDec(teamData?.levelBonusClaimed ?? 0, 4)}</span>
					{Number(teamData?.levelBonus) > 0 && (
						<Button className={button()} isLoading={isLoading} onPress={() => claimLevelBonus()}>
							{t('claim')}
						</Button>
					)}
				</Card>
				<Card className='p-4 text-center'>
					<span className='text-2xl font-bold text-secondary'>{fixDec(teamData?.referralBonus ?? 0, 4)}</span>
					<span className='text-sm text-primary-foreground/60'>{t('team_reward_desc')}</span>
					<span className='text-sm text-primary-foreground/60'>{t('earned') + ': ' + fixDec(teamData?.referralBonusClaimed ?? 0, 4)}</span>
					{Number(teamData?.referralBonus) > 0 && (
						<Button className={button()} isLoading={isLoading} onPress={() => claimReferralBonus()}>
							{t('claim')}
						</Button>
					)}
				</Card>
				<Card className='p-4 text-center'>
					<span className='text-2xl font-bold text-primary'>{teamData?.level ?? 0}</span>
					<span className='text-sm text-primary-foreground/60'>{t('my_level')}</span>
				</Card>

				<Card className='p-4 text-center'>
					<span className='text-2xl font-bold text-primary'>{fixDec(teamData?.performance ?? 0, 4)}</span>
					<span className='text-sm text-primary-foreground/60'>{t('team_performance')}</span>
				</Card>
			</div>

			<div className='flex  flex-col gap-3 md:flex-row'>
				<Card className='p-4 w-full'>
					<div className='flex items-center gap-2 justify-between'>
						<div className='flex items-center gap-2'>
							<Icon icon='mdi:account-star' className='w-5 h-5 text-primary' />
							<span className='text-sm font-semibold'>{t('team_contract')}</span>
						</div>
						<div className='flex items-center gap-2'>
							<span className='text-xs text-primary-foreground/60'>{obsTxt(teamData?.address, 6, 6)}</span>
							<CopyButton text={teamData?.address ?? ''} iconClass='text-primary' />
						</div>
					</div>
				</Card>
				{/* 推荐我的用户信息 */}
				{teamData?.leader !== teamData?.address && (
					<Card className='p-4 w-full'>
						<div className='flex items-center gap-2 justify-between'>
							<div className='flex items-center gap-2'>
								<Icon icon='mdi:account-star' className='w-5 h-5 text-primary' />
								<span className='text-sm font-semibold'>{t('my_referrer')}</span>
							</div>
							<div className='flex items-center gap-2'>
								{/* <span className='font-semibold'>{teamData?.leader ?? 'User'}</span> */}
								<span className='text-xs text-primary-foreground/60'>{obsTxt(teamData?.leader, 6, 6)}</span>
							</div>
						</div>
					</Card>
				)}
			</div>

			{/* 推广用户列表 - 使用 BaseTable */}
			<Card className='p-2 h-full min-h-[400px]'>
				<div className='flex items-center gap-2'>
					<Icon icon='mdi:account-group' className='w-5 h-5 text-secondary' />
					<span className='text-lg font-semibold'>
						{t('direct_referrals') + ':'}
						{teamData?.referrals?.length ?? 0}
					</span>
				</div>
				<BaseTable
					table={{
						key: 'referral-user-list',
						selectedKeys: new Set()
						// onSelectionChange: keys => {
						// 	console.log('Selected users:', keys);
						// }
					}}
					tableHeader={{columns: tableHead}}
					tableBody={{isLoading: false}}
					data={teamData?.referrals ?? []}
					pageSize={10}
					onPageChange={page => () => {}}
				/>
			</Card>
		</div>
	);
};
