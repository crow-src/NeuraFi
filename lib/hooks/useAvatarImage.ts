import {useState, useEffect} from 'react';
import {saveAs} from 'file-saver';
import {UserData} from '@/app/store';
// import {obsTxt, fixDec} from '@/lib';
import {useQrcode} from './useQrcode';

export const useAvatarImage = () => {
	const [imageUrl, setImageUrl] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isClient, setIsClient] = useState(false);
	const {generateQrcode} = useQrcode();

	// 检测是否在客户端
	useEffect(() => {
		setIsClient(true);
	}, []);

	// 等待图片加载完成
	const waitImage = (img: HTMLImageElement) =>
		new Promise<void>((resolve, reject) => {
			img.onload = () => resolve();
			img.onerror = reject;
		});

	// 移除 useCallback，直接定义函数
	const generateAvatarImage = async ({data}: {data: UserData}): Promise<string> => {
		if (!data?.address || !isClient) return '';

		setIsLoading(true);
		try {
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			if (!ctx) {
				setIsLoading(false);
				return '';
			}

			canvas.width = 1080;
			canvas.height = 1080;

			// 设置画布背景
			ctx.fillStyle = '#cfcfcf';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// 生成随机数字 1-10
			const randomNumber = Math.floor(Math.random() * 10) + 1;

			// 背景图
			const img = new Image();
			img.crossOrigin = 'anonymous';
			// img.src = '/ui/base.png';
			img.src = `/ui/base-${randomNumber}.png`;

			await waitImage(img);
			ctx.drawImage(img, 0, 0, 1080, 1080);

			// 文本
			// ctx.fillStyle = '#fcc535';
			// ctx.textAlign = 'center';
			// ctx.textBaseline = 'middle';
			// ctx.font = 'bold 24px Arial';
			// ctx.fillText(obsTxt(data.address, 6, 6, '*'), 120, 680);

			// ctx.font = '64px Arial';
			// ctx.fillText('840', 180, 1000);
			// ctx.fillText(data.performance?.toString() ?? '0', 820, 1000);

			// 二维码
			const inviteUrl = `https://Agon.top/?tab=team&slug=${data.slug}`;
			const qrCodeUrl = await generateQrcode({
				text: inviteUrl,
				size: 200,
				colorDark: '#09ff9f', // 二维码的黑色部分改为白色
				colorLight: '#101010', // 背景设为透明
				margin: 3,
				logoImage: '/favicon-128x128.png'
			});

			if (qrCodeUrl) {
				const qrImg = new Image();
				qrImg.crossOrigin = 'anonymous';
				qrImg.src = qrCodeUrl;
				await waitImage(qrImg);
				ctx.drawImage(qrImg, randomNumber > 5 ? 52 : 700, randomNumber > 5 ? 705 : 705, 320, 320); //randomNumber   x y
			}

			const url = canvas.toDataURL('image/png', 1.0);
			setImageUrl(url);
			setIsLoading(false);
			return url;
		} catch (err) {
			console.error('error:', err);
			setIsLoading(false);
			return '';
		}
	};

	const downloadImage = async (): Promise<boolean> => {
		if (!imageUrl || !isClient) return false;

		try {
			const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

			if (isMobile) {
				// 移动端：使用 file-saver 库
				try {
					const response = await fetch(imageUrl);
					const blob = await response.blob();
					saveAs(blob, `profile_${Date.now()}.png`);
					return true;
				} catch (error) {
					//console.error('移动端保存失败:', error);
					window.open(imageUrl, '_blank');
					return true;
				}
			} else {
				// 电脑端：直接下载
				const link = document.createElement('a');
				link.href = imageUrl;
				link.download = `profile_${Date.now()}.png`;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				return true;
			}
		} catch (error) {
			//console.error('下载图片失败:', error);
			return false;
		}
	};

	return {imageUrl, isLoading, generateAvatarImage, downloadImage, isClient};
};
