import QRCode from 'qrcode';

interface QrcodeOptions {
	text: string;
	size?: number;
	colorDark?: string;
	colorLight?: string;
	margin?: number;
	cornerRadius?: number;
	logoImage?: string;
	logoSize?: number;
	logoBackground?: string;
}

export const useQrcode = () => {
	const generateQrcode = async (options: QrcodeOptions): Promise<string> => {
		const {text, size = 400, colorDark = '#000000', colorLight = '#ffffff', margin = 20, cornerRadius = 20, logoImage, logoSize = size * 0.2, logoBackground = '#ffffff'} = options;

		try {
			// 生成二维码
			const qrBase64 = await QRCode.toDataURL(text, {
				width: size,
				margin: margin,
				color: {
					dark: colorDark,
					light: colorLight
				}
			});

			// 创建 canvas 来添加圆角和 Logo
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			if (!ctx) {
				throw new Error('Failed to get canvas context');
			}

			// 设置 canvas 大小
			canvas.width = size;
			canvas.height = size;

			// 创建圆角路径
			ctx.beginPath();
			ctx.moveTo(cornerRadius, 0);
			ctx.lineTo(size - cornerRadius, 0);
			ctx.quadraticCurveTo(size, 0, size, cornerRadius);
			ctx.lineTo(size, size - cornerRadius);
			ctx.quadraticCurveTo(size, size, size - cornerRadius, size);
			ctx.lineTo(cornerRadius, size);
			ctx.quadraticCurveTo(0, size, 0, size - cornerRadius);
			ctx.lineTo(0, cornerRadius);
			ctx.quadraticCurveTo(0, 0, cornerRadius, 0);
			ctx.closePath();

			// 创建裁剪区域
			ctx.clip();

			// 加载二维码图片
			const qrImg = new Image();
			await new Promise((resolve, reject) => {
				qrImg.onload = resolve;
				qrImg.onerror = reject;
				qrImg.src = qrBase64;
			});

			// 绘制二维码
			ctx.drawImage(qrImg, 0, 0, size, size);

			// 如果有 Logo，先挖空再绘制 Logo
			if (logoImage) {
				// 计算 Logo 位置（居中）
				const logoX = (size - logoSize) / 2;
				const logoY = (size - logoSize) / 2;

				// 1. 挖空二维码中心（方形）
				ctx.save();
				ctx.globalCompositeOperation = 'destination-out';
				ctx.fillRect(logoX, logoY, logoSize, logoSize);
				ctx.restore();

				// 2. 用黑色填充挖空区域
				ctx.fillStyle = '#000000';
				ctx.fillRect(logoX, logoY, logoSize, logoSize);

				// 3. 绘制 Logo（透明背景）
				const logoImg = new Image();
				await new Promise((resolve, reject) => {
					logoImg.onload = resolve;
					logoImg.onerror = reject;
					logoImg.src = logoImage;
				});
				ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
			}

			// 获取最终的 base64
			const base64 = canvas.toDataURL('image/png');
			return base64;
		} catch (error) {
			//console.error('Error generating QR code:', error);
			return '';
		}
	};

	return {generateQrcode};
};
