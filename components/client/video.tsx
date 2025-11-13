'use client';

import {useState, useRef, useEffect} from 'react';
import {Button} from '@heroui/button';
import {Card, CardBody} from '@heroui/card';
import {Icon} from '@iconify/react';

interface VideoPlayerProps {
	videoSrc: string; //视频链接
	posterSrc: string; //封面图片
	className?: string;
	title?: string;
	description?: string; // 详细介绍
	isPlay?: boolean;
	autoplay?: boolean; // 自动播放选项
	muted?: boolean; // 静音选项
}

export function VideoPlayer({videoSrc, posterSrc, className = '', title, description, isPlay = false, autoplay = false, muted = true}: VideoPlayerProps) {
	const [isPlaying, setIsPlaying] = useState(isPlay);
	const [showControls, setShowControls] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const videoRef = useRef<HTMLVideoElement>(null);
	const mobileVideoRef = useRef<HTMLVideoElement>(null);

	// 尝试自动播放
	useEffect(() => {
		if (autoplay) {
			// 桌面端视频
			if (videoRef.current) {
				const playPromise = videoRef.current.play();
				if (playPromise !== undefined) {
					playPromise
						.then(() => {
							setIsPlaying(true);
						})
						.catch(error => {
							console.log('桌面端自动播放失败:', error);
							setIsPlaying(false);
						});
				}
			}
			// 移动端视频
			if (mobileVideoRef.current) {
				const playPromise = mobileVideoRef.current.play();
				if (playPromise !== undefined) {
					playPromise
						.then(() => {
							setIsPlaying(true);
						})
						.catch(error => {
							console.log('移动端自动播放失败:', error);
							setIsPlaying(false);
						});
				}
			}
		}
	}, [autoplay]);

	const handleLoadedData = () => {
		setIsLoading(false);
	};

	return (
		<Card className={`w-full h-full ${className}`}>
			<CardBody className='p-0 h-full'>
				<div className='w-full h-full'>
					{/* 小屏幕：使用 aspect-video */}
					<div className='block sm:hidden w-full'>
						<div className='relative w-full aspect-video rounded-lg overflow-hidden bg-background'>
							<video ref={mobileVideoRef} className='w-full h-full object-contain' poster={posterSrc} preload='auto' muted={muted} loop playsInline autoPlay={autoplay} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onEnded={() => setIsPlaying(false)} onLoadedData={handleLoadedData}>
								<source src={videoSrc} type='video/mp4' />
								您的浏览器不支持视频播放。
							</video>

							{/* 加载状态 */}
							{isLoading && (
								<div className='absolute inset-0 flex items-center justify-center bg-background/80 z-10'>
									<Icon icon='mdi:loading' className='w-8 h-8 text-foreground animate-spin' />
								</div>
							)}
						</div>

						{/* 标题区域 - 小屏幕在视频下方 */}
						{(title ?? description) && (
							<div className='p-4 bg-background rounded-b-lg mt-2'>
								{title && <h3 className='text-xl font-bold text-foreground mb-2'>{title}</h3>}
								{description && <p className='text-sm text-foreground/70 leading-relaxed'>{description}</p>}
							</div>
						)}
					</div>

					{/* 大屏幕：视频自适应高度，最多占 2/3 宽度 */}
					<div className='hidden sm:block w-full h-full rounded-lg'>
						<div className='relative w-full h-full bg-black rounded-lg overflow-hidden'>
							{/* 视频 - 填充整个容器 */}
							<video ref={videoRef} className='absolute inset-0 w-full h-full object-cover' poster={posterSrc} preload='metadata' muted={muted} loop onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onEnded={() => setIsPlaying(false)} onLoadedData={handleLoadedData}>
								<source src={videoSrc} type='video/mp4' />
								Error: Your browser does not support the video tag.
							</video>

							{/* 黑色渐变遮罩 - 从左到右渐变透明，覆盖在视频上 */}
							<div
								className='absolute inset-0 pointer-events-none z-10'
								style={{
									background: 'linear-gradient(to right, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.85) 15%, rgba(0, 0, 0, 0.7) 30%, rgba(0, 0, 0, 0.5) 45%, rgba(0, 0, 0, 0.3) 60%, rgba(0, 0, 0, 0.1) 75%, rgba(0, 0, 0, 0) 100%)'
								}}
							/>

							{/* 加载状态 */}
							{isLoading && (
								<div className='absolute inset-0 flex items-center justify-center bg-black/30 z-20'>
									<Icon icon='mdi:loading' className='w-8 h-8 text-white animate-spin' />
								</div>
							)}

							{(title ?? description) && (
								<div className='absolute inset-y-0 left-0 flex flex-col justify-center px-8 md:px-12 lg:px-16 max-w-xl z-30'>
									{title && <h2 className='text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 leading-tight drop-shadow-2xl'>{title}</h2>}
									{description && <p className='text-base md:text-lg lg:text-xl text-white/90 leading-relaxed drop-shadow-lg'>{description}</p>}
								</div>
							)}
						</div>
					</div>
				</div>
			</CardBody>
		</Card>
	);
}
