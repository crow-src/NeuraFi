'use client';
import React, {useState, useEffect, useRef} from 'react';
import {useSearchParams} from 'next/navigation';
import {Icon} from '@iconify/react';
import {useMountedState} from 'react-use';

// 同步导入关键页面组件
import BlindBoxPage from '../page/BlindBoxPage';
import CollectionPage from '../page/CollectionPage';
import HomePage from '../page/HomePage'; //首页
import LaunchPage from '../page/LaunchPage';
import MarketPage from '../page/MarketPage';
import MePage from '../page/MePage'; //
import PromotionPage from '../page/PromotionPage';
import RankPage from '../page/RankPage';
import SwapPage from '../page/SwapPage'; //
import TeamPage from '../page/TeamPage';

const tabKeys = ['home', 'quotes', 'rank', 'trading', 'me', 'team', 'invite', 'manage', 'box', 'market', 'launch', 'collection', 'promotion', 'help'] as const;
type TabKey = (typeof tabKeys)[number];
type TabComponent = React.ComponentType<Record<string, unknown>>;

// 动态导入的页面
const tabImportMap: Partial<Record<TabKey, () => Promise<{default: TabComponent}>>> = {
	quotes: () => import('../page/QuotesPage'),
	help: () => import('../page/HelpPage')
};

// 同步导入的页面组件映射
const tabComponentMap: Partial<Record<TabKey, TabComponent>> = {
	home: HomePage,
	trading: SwapPage,
	me: MePage,
	team: TeamPage,
	box: BlindBoxPage,
	market: MarketPage,
	rank: RankPage,
	launch: LaunchPage,
	collection: CollectionPage,
	promotion: PromotionPage
};

export const TabContent = () => {
	const searchParams = useSearchParams();
	const tab = (searchParams.get('tab') as TabKey) || 'home';
	const [status, setStatus] = useState<'loading' | 'ready' | 'notFound'>('loading');
	const [Component, setComponent] = useState<TabComponent | null>(null);
	const tabCache = useRef<Partial<Record<TabKey, TabComponent>>>({});
	const isMounted = useMountedState(); // 是否已挂载

	// 防止移动端滚动偏移
	useEffect(() => {
		// 检测是否为触摸设备（手机/平板）
		const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
		const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || isTouchDevice;

		if (!isMobile) return; //非移动端不处理

		const preventZoom = (e: TouchEvent) => e.touches.length > 1 && e.preventDefault(); // 禁用触摸缩放
		const preventHorizontalScroll = (e: WheelEvent) => Math.abs(e.deltaX) > Math.abs(e.deltaY) && e.preventDefault(); // 禁用水平滚动

		// 禁用橡皮筋效果
		const preventOverscroll = (e: TouchEvent) => {
			const target = e.target as Element;
			target.scrollTop === 0 && e.touches[0].clientY > e.touches[0].clientY && e.preventDefault();
		};

		// 添加事件监听器
		document.addEventListener('touchstart', preventZoom, {passive: false});
		document.addEventListener('touchmove', preventOverscroll, {passive: false});
		document.addEventListener('wheel', preventHorizontalScroll, {passive: false});

		// 设置视口元标签
		const viewport = document.querySelector('meta[name="viewport"]');
		viewport && viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');

		// 清理函数
		return () => {
			document.removeEventListener('touchstart', preventZoom);
			document.removeEventListener('touchmove', preventOverscroll);
			document.removeEventListener('wheel', preventHorizontalScroll);
		};
	}, []);

	// 加载页面
	useEffect(() => {
		let isActive = true; //是否激活
		const cached = tabCache.current[tab];
		if (cached) {
			setComponent(() => cached);
			setStatus('ready');
			return () => (isActive = false);
		}

		const staticComponent = tabComponentMap[tab];
		if (staticComponent) {
			tabCache.current[tab] = staticComponent;
			setComponent(() => staticComponent);
			setStatus('ready');
			return () => (isActive = false);
		}

		const importer = tabImportMap[tab];
		if (!importer) {
			setComponent(null);
			setStatus('notFound');
			return () => (isActive = false);
		}

		setStatus('loading');
		setComponent(null);
		// 加载页面
		importer?.()
			.then(mod => {
				if (!isActive) return;
				const LoadedComponent = mod.default;
				tabCache.current[tab] = LoadedComponent;
				setComponent(() => LoadedComponent);
				setStatus('ready');
			})
			.catch(() => {
				if (!isActive) return;
				setComponent(null);
				setStatus('notFound');
			})
			.finally(() => {
				if (!isActive) return;
				if (!tabCache.current[tab]) setStatus('notFound');
			});

		return () => {
			isActive = false;
		};
	}, [tab]);

	const effectiveStatus = !isMounted() ? 'loading' : status;

	const content = (() => {
		switch (effectiveStatus) {
			case 'loading':
				return <Placeholder variant='loading' />;
			case 'notFound':
				return <Placeholder variant='notFound' />;
			case 'ready':
			default:
				return Component ? <Component /> : <Placeholder variant='notFound' />;
		}
	})();

	return <div className='w-full h-full touch-pan-y'>{content}</div>;
};

TabContent.displayName = 'TabContent';

/**
 * 加载中组件
 */
const Placeholder = ({variant = 'loading'}: {variant?: 'loading' | 'notFound'}) => {
	const content =
		variant === 'notFound'
			? {
					icon: 'mdi:alert-circle-outline',
					title: 'Page Not Found',
					description: 'Please check the link is correct or try again later.'
				}
			: {
					icon: 'svg-spinners:bars-scale-middle',
					title: 'Loading...',
					description: 'Please wait while we load the content.'
				};

	return (
		<div className='flex flex-col items-center justify-center gap-4 text-center w-full h-screen border-dashed border border-primary-border/30 md:h-[90vh] rounded-md p-6'>
			<Icon icon={content.icon} className='w-12 h-12 text-primary' />
			<div className='space-y-2'>
				<p className='text-lg font-semibold text-primary-foreground'>{content.title}</p>
				<p className='text-sm text-primary-foreground'>{content.description}</p>
			</div>
		</div>
	);
};
