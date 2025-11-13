'use client';
import React, {useEffect, useState, useMemo} from 'react';

import {cn} from '@heroui/react';
import {Icon} from '@iconify/react';
import {useTranslations} from 'next-intl';

/**
 * 信息广播组件属性接口
 */
interface BroadcastProps {
	messages?: string[] /** 要广播的消息数组（可选） */;
	interval?: number /** 切换间隔时间（毫秒），默认3000ms */;
	icon?: string /** 图标名称，默认为铃铛图标 */;
	className?: string /** 自定义样式类名 */;
}

/**
 * 信息广播组件 - 自动循环播放消息列表
 * 如果不传入messages则使用内部默认配置
 * @param messages 消息数组（可选）
 * @param interval 切换间隔时间
 * @param className 自定义样式
 * @param icon 图标名称
 */
export const Broadcast = ({messages: externalMessages, interval = 3000, className, icon = 'solar:bell-bold-duotone'}: BroadcastProps) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isVisible, setIsVisible] = useState(true);
	const tNews = useTranslations('news');

	// 内部默认的消息配置
	const defaultMessages: string[] = useMemo(() => [tNews('v1'), tNews('v2'), tNews('v3')], [tNews]);

	// 使用外部传入的messages或内部默认的messages
	const messages = externalMessages ?? defaultMessages;

	useEffect(() => {
		if (messages.length <= 1) return;
		const timer = setInterval(() => {
			setIsVisible(false);
			setTimeout(() => {
				setCurrentIndex(prev => (prev + 1) % messages.length);
				setIsVisible(true);
			}, 300); // 300ms 淡出时间
		}, interval);

		return () => clearInterval(timer);
	}, [messages.length, interval]);

	if (!messages.length) return null;

	const currentMessage = messages[currentIndex];

	return (
		<div className={cn('w-full bg-background/80 backdrop-blur-xs rounded-md border border-primary-border/50', className)}>
			<div className='flex items-center px-4 py-2 gap-3'>
				{/* 图标 */}
				<Icon icon={icon} className='w-5 h-5 text-primary-foreground shrink-0' />

				{/* 消息容器 */}
				<div className='flex-1 overflow-hidden h-6 flex items-center relative'>
					<div className={cn('absolute inset-0 flex items-center transition-opacity duration-300 ease-in-out', isVisible ? 'opacity-100' : 'opacity-0')}>
						<div className='text-sm text-foreground whitespace-nowrap overflow-hidden text-ellipsis w-full'>{currentMessage}</div>
					</div>
				</div>

				{/* 消息计数器 */}
				{messages.length > 1 && (
					<div className='text-sm text-foreground/50 shrink-0 flex items-center'>
						{currentIndex + 1}/{messages.length}
					</div>
				)}
			</div>
		</div>
	);
};

Broadcast.displayName = 'Broadcast';
