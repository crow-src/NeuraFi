'use client';

import React from 'react';
import {useSearchParams, useRouter} from 'next/navigation';
import {Avatar, Chip, Button, Tooltip} from '@heroui/react';
import {cn} from '@heroui/react';
import {Icon} from '@iconify/react';
import {useTranslations} from 'next-intl';
import {MAIN_CONFIG} from '@/config/main';

// 侧边栏项
export type SidebarItem = {
	key: string;
	title: string;
	icon?: string;
	href?: string;
	order?: number;
	className?: string;
	category?: string;
};

// 侧边栏分组
export type SidebarGroup = {
	title: string;
	items: SidebarItem[];
	order: number;
};

// 侧边栏属性
export type SidebarProps = {
	isCompact?: boolean;
	hideEndContent?: boolean;
	iconClassName?: string;
	className?: string;
};

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(({isCompact, iconClassName, className}, ref) => {
	const t = useTranslations('common');
	const searchParams = useSearchParams();
	const router = useRouter();
	const tab = searchParams.get('tab') ?? 'home';
	// 获取侧边栏分组
	const getSidebarGroups = (): SidebarGroup[] => {
		const allItems = MAIN_CONFIG.navItems.map(item => ({
			...item,
			title: t(item.key),
			category: item.category
		}));

		// 按分类分组
		const groupedItems = allItems.reduce(
			(acc, item) => {
				const category = item.category ?? 'main';
				if (!acc[category]) {
					acc[category] = [];
				}
				acc[category].push(item);
				return acc;
			},
			{} as Record<string, SidebarItem[]>
		);

		// 转换为分组格式并排序
		return Object.entries(groupedItems)
			.map(([categoryKey, items]) => ({
				title: categoryKey === 'main' ? 'Main' : categoryKey === 'market' ? 'Market' : 'User',
				items: items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
				order: (MAIN_CONFIG.navCategories as Record<string, {title: string; order: number}>)?.[categoryKey]?.order || 999
			}))
			.sort((a, b) => a.order - b.order);
	};

	const sidebarGroups = getSidebarGroups();

	const handleTabChange = (nextTab: string) => {
		if (nextTab !== tab) {
			const params = new URLSearchParams(Array.from(searchParams.entries()));
			params.set('tab', nextTab);
			router.push('?' + params.toString());
		}
	};

	return (
		<div ref={ref} className={cn('flex flex-col min-h-full bg-primary-background p-0 rounded-lg border-1 border-primary-border/30', className)}>
			{/* Logo 区域 */}
			<div className='flex items-center gap-3 px-4 py-4'>
				<Avatar src='/favicon.ico' className='w-5 h-5 bg-transparent' />
				{!isCompact && (
					<div className='flex items-center gap-2'>
						<h2 className='text-lg font-bold text-primary-foreground'>{MAIN_CONFIG.name}</h2>
						<Chip size='sm' className='text-xs text-primary-foreground'>
							BETA
						</Chip>
					</div>
				)}
			</div>

			{/* 分割线 */}
			<div className='mx-2 w-auto border-t border-primary-border/30 scale-y-[0.5]' />

			{/* 导航菜单 */}
			<nav className='flex flex-col items-start justify-start h-full py-1 px-2 gap-2'>
				{sidebarGroups.map((group, groupIndex) => (
					<div key={group.title} className='w-full'>
						{/* 分组标题 */}
						{!isCompact && group.title !== 'Main' && (
							<div className='px-3 py-2'>
								<span className='text-xs font-semibold text-primary-foreground uppercase'>{group.title}</span>
							</div>
						)}

						{/* 按钮列表 */}
						<div className='flex flex-col gap-2'>
							{group.items.map(item => {
								const isSelected = tab === item.key;

								return isCompact ? (
									<Tooltip key={item.key} content={item.title} placement='right'>
										<Button isIconOnly variant={isSelected ? 'flat' : 'light'} className={cn('w-11 h-11 min-w-11', isSelected ? 'border border-primary-border/30 bg-primary-background' : '')} onPress={() => handleTabChange(item.key)}>
											{item.icon && <Icon className='text-primary-foreground' icon={item.icon} width={24} />}
										</Button>
									</Tooltip>
								) : (
									<Button key={item.key} variant={isSelected ? 'flat' : 'light'} className={cn('w-full justify-start px-3 h-[44px] rounded-large', isSelected ? 'border border-primary-border/30 bg-primary-background' : '')} startContent={item.icon && <Icon className={cn('text-primary-foreground', iconClassName)} icon={item.icon} width={24} />} onPress={() => handleTabChange(item.key)}>
										<span className='text-small font-medium text-primary-foreground'>{item.title}</span>
									</Button>
								);
							})}
						</div>
						{/* 分组分割线 */}
						{groupIndex < sidebarGroups.length - 1 && <div className='my-2 mx-2 w-auto border-t border-primary-border/30 scale-y-[0.5]' />}
					</div>
				))}
			</nav>
		</div>
	);
});

Sidebar.displayName = 'Sidebar';
