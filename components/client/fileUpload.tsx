'use client';
import React, { useState, useCallback, useEffect } from 'react';

import { Button, Image } from '@heroui/react';
import { Icon } from '@iconify/react';
import {useDropzone} from 'react-dropzone';

export const ImageUploader: React.FC = () => {
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const onDrop = useCallback((acceptedFiles: File[]) => {
		if (acceptedFiles && acceptedFiles.length > 0) {
			const file = acceptedFiles[0];
			const url = URL.createObjectURL(file);
			setImageUrl(url);
			console.log('选中的文件：', file);
		}
	}, []);

	const {getRootProps, getInputProps, open} = useDropzone({
		onDrop,
		accept: {'image/*': []},
		noClick: true, // 禁用默认点击行为
		noKeyboard: true // 禁用键盘事件
	});

	// 清理之前生成的 URL
	useEffect(() => {
		return () => {
			imageUrl && URL.revokeObjectURL(imageUrl);
		};
	}, [imageUrl]);

	return (
		<div className='flex flex-col items-center'>
			{/* 将按钮作为打开文件选择器的触发器 */}
			<div {...getRootProps()} className='w-full'>
				<input {...getInputProps()} />
				<Button isIconOnly onPress={open} className='p-0 m-0 bg-transparent'>
					{imageUrl ? <Image src={imageUrl} aria-label='token icon' width={32} /> : <Icon icon='fa6-regular:images' className='w-16 h-16 text-primary-foreground' />}
				</Button>
			</div>
		</div>
	);
};

ImageUploader.displayName = 'ImageUploader';
