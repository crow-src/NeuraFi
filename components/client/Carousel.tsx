'use client';
import React, {useEffect, useRef, useState, useCallback} from 'react';

import {Image, Button, Card, CardBody} from '@heroui/react';
import {cn} from '@heroui/react';
import {Icon} from '@iconify/react';

/**
 * 轮播图片接口
 */
interface CarouselImage {
	url: string;
	description?: string;
}

/**
 * 轮播图组件属性接口
 */
interface CarouselProps {
	images: CarouselImage[] /** 图片数组 */;
	autoPlay?: boolean /** 是否自动播放，默认true */;
	interval?: number /** 播放间隔（毫秒），默认3000ms */;
	className?: string /** 自定义样式类名 */;
}

/**
 * 轮播图组件 - 支持自动播放和手动控制的图片轮播
 * 提供上一张/下一张按钮、指示器和鼠标悬停暂停功能
 * @param images 图片数组
 * @param autoPlay 是否自动播放
 * @param interval 播放间隔
 * @param className 自定义样式
 */
export const Carousel = ({images, autoPlay = true, interval = 3000, className}: CarouselProps) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isPlaying, setIsPlaying] = useState(autoPlay);
	const timerRef = useRef<NodeJS.Timeout>();
	const containerRef = useRef<HTMLDivElement>(null);

	const nextSlide = useCallback(() => {
		setCurrentIndex(prev => (prev + 1) % images.length);
	}, [images.length]);

	const prevSlide = useCallback(() => {
		setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
	}, [images.length]);

	useEffect(() => {
		isPlaying && (timerRef.current = setInterval(nextSlide, interval));
		return () => timerRef.current && clearInterval(timerRef.current);
	}, [isPlaying, interval, nextSlide]);

	const handleMouseEnter = () => autoPlay && setIsPlaying(false);
	const handleMouseLeave = () => autoPlay && setIsPlaying(true);

	return (
		<Card className={cn('w-full relative group', className)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
			<CardBody className='p-0 overflow-hidden'>
				<div className='relative w-full h-full'>
					{/* 图片容器 */}
					<div ref={containerRef} className='flex transition-transform duration-500 ease-in-out' style={{width: `${images.length * 100}%`, transform: `translateX(-${(currentIndex * 100) / images.length}%)`}}>
						{images.map((image, index) => (
							<div key={index} className='relative w-full' style={{width: `${100 / images.length}%`}}>
								<Image src={image.url} alt={image.description ?? `Slide ${index + 1}`} className='w-full aspect-video object-cover' removeWrapper />
								{image.description && (
									<div className='absolute bottom-0 left-0 right-0 p-4 bg-black/50 text-white'>
										<p className='text-sm'>{image.description}</p>
									</div>
								)}
							</div>
						))}
					</div>

					{/* 控制按钮 */}
					<div className='absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity'>
						<Button isIconOnly className='bg-black/50 text-primary-foreground hover:bg-black/70' onClick={prevSlide}>
							<Icon icon='solar:arrow-left-linear' className='w-6 h-6' />
						</Button>
						<Button isIconOnly className='bg-black/50 text-primary-foreground hover:bg-black/70' onClick={nextSlide}>
							<Icon icon='solar:arrow-right-linear' className='w-6 h-6' />
						</Button>
					</div>

					{/* 指示器 */}
					<div className='absolute bottom-4 left-0 right-0 flex justify-center gap-2'>
						{images.map((_, index) => (
							<button key={index} className={cn('w-2 h-2 rounded-full transition-all', currentIndex === index ? 'bg-primary w-4' : 'bg-primary/50')} onClick={() => setCurrentIndex(index)} />
						))}
					</div>
				</div>
			</CardBody>
		</Card>
	);
};
Carousel.displayName = 'Carousel';

// 多图片横向轮播图组件
interface HorizontalCarouselProps {
	images: Array<{url: string; title?: string; description?: string}>;
	showCount?: number; // 一次显示几张图片
	autoPlay?: boolean;
	interval?: number;
	className?: string;
	showControls?: boolean; // 是否显示控制按钮
	showIndicators?: boolean; // 是否显示指示器
}

export const HorizontalCarousel = ({images, showCount = 3, autoPlay = true, interval = 3000, className, showControls = true, showIndicators = true}: HorizontalCarouselProps) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isPlaying, setIsPlaying] = useState(autoPlay);
	const timerRef = useRef<NodeJS.Timeout>();
	const containerRef = useRef<HTMLDivElement>(null);

	// 计算最大可滚动索引
	const maxIndex = Math.max(0, images.length - showCount);

	const nextSlide = useCallback(() => {
		setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
	}, [maxIndex]);

	const prevSlide = useCallback(() => {
		setCurrentIndex(prev => Math.max(prev - 1, 0));
	}, []);

	useEffect(() => {
		if (isPlaying && maxIndex > 0) {
			timerRef.current = setInterval(() => {
				setCurrentIndex(prev => {
					if (prev >= maxIndex) {
						return 0; // 回到开始
					}
					return prev + 1;
				});
			}, interval);
		}
		return () => timerRef.current && clearInterval(timerRef.current);
	}, [isPlaying, interval, maxIndex]);

	const handleMouseEnter = () => autoPlay && setIsPlaying(false);
	const handleMouseLeave = () => autoPlay && setIsPlaying(true);

	// 如果没有足够的图片，直接显示所有图片
	if (images.length <= showCount) {
		return (
			<Card className={cn('w-full', className)}>
				<CardBody className='p-4'>
					<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
						{images.map((image, index) => (
							<div key={index} className='flex flex-col gap-2'>
								<Image src={image.url} alt={image.title ?? `Image ${index + 1}`} className='w-full aspect-square object-cover rounded-lg' removeWrapper />
								{image.title && <h3 className='font-semibold text-foreground text-sm whitespace-nowrap overflow-hidden text-ellipsis'>{image.title}</h3>}
								{image.description && <p className='text-foreground/70 text-xs line-clamp-2'>{image.description}</p>}
							</div>
						))}
					</div>
				</CardBody>
			</Card>
		);
	}

	return (
		<Card className={cn('w-full relative group custom-scrollbar', className)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
			<CardBody className='p-4 custom-scrollbar'>
				<div className='relative w-full'>
					{/* 图片容器 */}
					<div ref={containerRef} className='flex gap-4 transition-transform duration-500 ease-in-out' style={{transform: `translateX(-${currentIndex * (100 / showCount)}%)`}}>
						{images.map((image, index) => (
							<div key={index} className='shrink-0 flex flex-col gap-2' style={{width: `calc((100% - ${(showCount - 1) * 1}rem) / ${showCount})`}}>
								<Image src={image.url} alt={image.title ?? `Image ${index + 1}`} className='w-full aspect-square object-cover rounded-lg' removeWrapper />
								{image.title && <h3 className='font-semibold text-foreground text-sm whitespace-nowrap overflow-hidden text-ellipsis'>{image.title}</h3>}
								{image.description && <p className='text-foreground/70 text-xs line-clamp-2'>{image.description}</p>}
							</div>
						))}
					</div>
					{/* 控制按钮 */}
					{showControls && maxIndex > 0 && (
						<div className='absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
							<Button isIconOnly className='bg-black/50 text-primary-foreground hover:bg-black/70 pointer-events-auto' onClick={prevSlide} isDisabled={currentIndex === 0}>
								<Icon icon='solar:arrow-left-linear' className='w-5 h-5' />
							</Button>
							<Button isIconOnly className='bg-black/50 text-primary-foreground hover:bg-black/70 pointer-events-auto' onClick={nextSlide} isDisabled={currentIndex === maxIndex}>
								<Icon icon='solar:arrow-right-linear' className='w-5 h-5' />
							</Button>
						</div>
					)}
				</div>
			</CardBody>
		</Card>
	);
};

Carousel.displayName = 'Carousel';
HorizontalCarousel.displayName = 'HorizontalCarousel';
