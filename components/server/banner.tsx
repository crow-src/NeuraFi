import React, { forwardRef, Children, HTMLAttributes, cloneElement } from 'react';

import { cn, ScrollShadow, ScrollShadowProps } from '@heroui/react';

interface ScrollingBannerProps extends HTMLAttributes<HTMLDivElement> {
	isReverse?: boolean;
	showShadow?: boolean;
	shouldPauseOnHover?: boolean;
	isVertical?: boolean;
	gap?: string;
	duration?: number; // in seconds
}

export const ScrollingBanner = forwardRef<HTMLDivElement, ScrollingBannerProps>(({className, isReverse, isVertical = false, gap = '1rem', showShadow = true, shouldPauseOnHover = true, duration = 40, children, ...props}, ref) => {
	const shadowProps: ScrollShadowProps = {isEnabled: showShadow, offset: -20, size: 300, orientation: isVertical ? 'vertical' : 'horizontal', visibility: 'both'};
	return (
		<ScrollShadow
			{...props}
			{...shadowProps}
			ref={ref}
			className={cn('flex', {'w-full': !isVertical, 'overflow-y-hidden': isVertical, 'overflow-x-hidden': !isVertical, 'max-h-[calc(100vh-200px)]': isVertical}, className)}
			style={{
				// @ts-ignore
				'--gap': gap,
				'--duration': `${duration}s`
			}}>
			<div
				className={cn('flex w-max items-stretch gap-(--gap)', {
					'flex-col': isVertical,
					'h-full': isVertical,
					'animate-scrolling-banner': !isVertical,
					'animate-scrolling-banner-vertical': isVertical,
					'[animation-direction:reverse]': isReverse,
					'hover:[animation-play-state:paused]': shouldPauseOnHover
				})}>
				{Children.map(children, child => cloneElement(child as any))}
			</div>
		</ScrollShadow>
	);
});

ScrollingBanner.displayName = 'ScrollingBanner';
