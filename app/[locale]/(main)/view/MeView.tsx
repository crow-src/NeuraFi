'use client';

import {useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {Panel, PanelGroup, PanelResizeHandle} from 'react-resizable-panels';
import {useMedia} from 'react-use';
import {PROJECT_CONFIG} from '@/config/main';
import {MenuList, UserCard, ReferralDetail} from '../components';

// ===== Main Component =====
export function MeView() {
	const [showReferralDetail, setShowReferralDetail] = useState<boolean>(false); // 是否显示推广详情 是：大   否：小   是的情况下 在sm屏幕下的右侧区域显示完整的推广详情 不显示其它的  不是的情况下 显示MainTool
	const isMd = useMedia('(min-width: 768px)');

	const searchParams = useSearchParams();
	const token = searchParams.get('token') ?? PROJECT_CONFIG.stablecoin[0].address;

	// 右侧：主操作区域
	const MainTool = () => (
		<div className='flex flex-col gap-4 h-full'>
			{/* 资产卡片 */}
			<UserCard token={token} />
			{/* 团队推广卡片 小屏幕下显示*/}
			{!isMd && <ReferralDetail isSmall={true} onBack={() => setShowReferralDetail(true)} token={token} />}
			{/* 菜单列表 */}
			<MenuList onMenuClick={() => {}} />
		</div>
	);

	return isMd ? (
		<div className='h-[93vh] w-full mt-4'>
			<PanelGroup direction='horizontal' className='h-full w-full space-x-2'>
				<Panel defaultSize={70} minSize={30} maxSize={80} className='h-full'>
					<ReferralDetail isSmall={false} token={token} />
				</Panel>
				<PanelResizeHandle className='w-1 bg-primary/30 hover:bg-primary transition-colors cursor-col-resize rounded-lg' />
				<Panel defaultSize={30} minSize={10} maxSize={60} className='h-full'>
					{MainTool()}
				</Panel>
			</PanelGroup>
		</div>
	) : (
		<div className='flex flex-col gap-2 w-full mt-4 px-2'>{showReferralDetail ? <ReferralDetail isSmall={false} onBack={() => setShowReferralDetail(!showReferralDetail)} token={token} /> : MainTool()}</div>
	);
}
