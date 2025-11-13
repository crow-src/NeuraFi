'use client';
import React, {useEffect, useRef} from 'react';
import {User, Skeleton, ScrollShadow} from '@heroui/react';
import {cn} from '@heroui/react';
import {UserClass, SkeletonClass} from '@/components';

/**
 * Token数据项接口
 */
export interface ScrollListItem {
	name: string;
	description: string;
	icon?: string;
	href?: string;
}

/**
 * 滚动列表组件属性接口
 */
interface ScrollListProps {
	data: ScrollListItem[] /** Token数据数组 */;
	speed?: number /** 滚动速度（毫秒），默认30ms */;
	className?: string;
}

/**
 * 顶部滚动列表组件 - 水平滚动展示Token列表
 * 自动循环滚动显示Token信息
 * @param data Token数据数组
 * @param speed 滚动速度
 */
export const ScrollList = ({data, speed = 30, className}: ScrollListProps) => {
	const scrollRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const scrollContainer = scrollRef.current;
		if (!scrollContainer) return;

		const scroll = () => {
			if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
				scrollContainer.scrollLeft = 0;
			} else {
				scrollContainer.scrollLeft += 1;
			}
		};

		const timer = setInterval(scroll, speed);
		return () => clearInterval(timer);
	}, [speed]);

	return (
		<div className='w-full'>
			<Skeleton classNames={SkeletonClass} isLoaded={data.length > 0} className='w-full'>
				<ScrollShadow ref={scrollRef} className={cn('w-full h-10 overflow-hidden motion-preset-blur-up-lg', className)} size={80} orientation='horizontal' hideScrollBar>
					<div className='flex gap-2 animate-scroll'>
						<div className='flex gap-2 min-w-max'>
							{[...data, ...data].map((token, index) => (
								<User
									key={`${token.name}-${index}`}
									name={token.name}
									classNames={UserClass}
									description={token.description}
									avatarProps={{
										radius: 'sm',
										fallback: true,
										src: token.icon,
										name: token.name?.charAt(0),
										className: token.name ? 'w-10 h-10' : 'w-8 h-8',
										classNames: {
											base: 'bg-transparent font-black',
											icon: 'text-black'
										}
									}}
								/>
							))}
						</div>
					</div>
				</ScrollShadow>
			</Skeleton>
		</div>
	);
};

ScrollList.displayName = 'ScrollList';
