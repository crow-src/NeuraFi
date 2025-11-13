'use client';

'use client';
import {useState, useEffect} from 'react';

import {useSearchParams, useRouter} from 'next/navigation';

import {Button, cn, ScrollShadow, Badge} from '@heroui/react';
import {Icon} from '@iconify/react';
import {useTranslations} from 'next-intl';
import {useWindowScroll} from 'react-use';

import {MAIN_CONFIG} from '@/config';

// 底部导航栏
export const BottomNavbar = () => {
	const t = useTranslations('common');
	const {y} = useWindowScroll();
	const [isScrolling, setIsScrolling] = useState(false); //是否滚动
	const searchParams = useSearchParams();
	const router = useRouter();
	const tab = searchParams.get('tab') ?? 'home'; //当前tab

	useEffect(() => {
		setIsScrolling(true);
		const timer = setTimeout(() => setIsScrolling(false), 200);
		return () => clearTimeout(timer);
	}, [y]);

	//切换tab
	const handleTabChange = (nextTab: string) => {
		if (nextTab !== tab) {
			// 使用 window.history 来避免页面刷新
			const params = new URLSearchParams(Array.from(searchParams.entries()));
			params.set('tab', nextTab);
			const newUrl = '?' + params.toString();

			// 使用 replaceState 来避免页面刷新
			window.history.replaceState(null, '', newUrl);

			// 手动触发 URL 变化事件，让 TabContent 响应
			window.dispatchEvent(new PopStateEvent('popstate'));
		}
	};

	return (
		<div className={`fixed bottom-0 left-0 w-full bg-background border-t border-primary-border hidden max-sm:block z-50 transition-opacity duration-200 ${isScrolling ? 'opacity-10' : 'opacity-100'}`}>
			<ScrollShadow orientation='horizontal' className='w-full' hideScrollBar>
				<div className='flex items-center h-16 px-2 gap-1 min-w-max'>
					{MAIN_CONFIG.navItems.map((item, index) => (
						<Badge key={item.key} content='' isDot color='success' placement='top-right' isInvisible={!item.new} showOutline={false}>
							<Button onPress={() => handleTabChange(item.key)} className='flex flex-col items-center justify-center gap-0.5 bg-transparent min-w-[60px] flex-shrink-0 px-2'>
								<div className='w-5 h-5 flex items-center justify-center'>
									<Icon icon={item.icon} className={`w-5 h-5 ${tab === item.key ? 'text-primary' : 'text-primary-foreground'}`} />
								</div>
								<span className={`text-xs whitespace-nowrap ${tab === item.key ? 'text-primary' : 'text-primary-foreground'}`}>{t(item.key)}</span>
							</Button>
						</Badge>
					))}
				</div>
			</ScrollShadow>
		</div>
	);
};

// 侧边导航栏
export const SideNavigation = ({className}: {className?: string}) => {
	const t = useTranslations('common');
	const searchParams = useSearchParams();
	const router = useRouter();
	const tab = searchParams.get('tab') ?? 'home';

	const handleTabChange = (nextTab: string) => {
		if (nextTab !== tab) {
			// 使用 window.history 来避免页面刷新
			const params = new URLSearchParams(Array.from(searchParams.entries()));
			params.set('tab', nextTab);
			const newUrl = '?' + params.toString();

			// 使用 replaceState 来避免页面刷新
			window.history.replaceState(null, '', newUrl);

			// 手动触发 URL 变化事件，让 TabContent 响应
			window.dispatchEvent(new PopStateEvent('popstate'));
		}
	};

	return (
		<div className={cn(`flex flex-col h-full bg-background p-0`, className)}>
			<div className='flex flex-col items-center justify-start h-full py-1 px-2 gap-2'>
				{MAIN_CONFIG.navItems.map((item, index) => (
					<Badge key={item.key} content='' isDot color='success' placement='top-right' isInvisible={!item.new} showOutline={false}>
						<Button
							size='sm'
							onPress={() => handleTabChange(item.key)}
							className={`
			  flex items-center justify-start gap-1 min-w-0 p-2 w-full
			  border border-primary-border/30 
			  data-[hover=true]:border-primary data-[focus=true]:border-primary data-[focus-visible=true]:border-primary data-[selected=true]:border-primary
			  ${tab === item.key ? 'bg-primary text-black' : 'bg-linear-to-br from-primary/20 to-primary-secondary/10 text-primary-foreground'}
			`}>
							<div className='w-4 h-4 flex items-center justify-center'>
								<Icon icon={item.icon} className={`w-4 h-4 ${tab === item.key ? 'text-black' : 'text-primary'}`} />
							</div>
							<span className={`text-xs ${tab === item.key ? 'text-black' : 'text-primary-foreground'}`}>{t(item.key)}</span>
						</Button>
					</Badge>
				))}
			</div>
		</div>
	);
};
