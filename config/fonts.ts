import {Inter as FontSans, Quicksand as FontQuicksand, Silkscreen as FontSilkscreen, Roboto} from 'next/font/google';

export const fontQuicksand = FontQuicksand({
	weight: ['400', '500', '700'],
	subsets: ['latin'],
	variable: '--font-quicksand'
});

export const fontSilkscreen = FontSilkscreen({
	weight: ['400', '700'],
	subsets: ['latin'],
	variable: '--font-silkscreen'
});

// Inter 字体 - 使用最细的字重，类似苹果 San Francisco
// 注意：Inter 在 Google Fonts 中最细是 100（Thin），但实际可用的是 300（Light）
export const fontSans = FontSans({
	weight: ['100', '200', '300', '400', '500', '600'],
	subsets: ['latin'],
	variable: '--font-sans',
	display: 'swap' // 优化字体加载性能
});

// Roboto 字体 - 备用选项，提供 100（Thin）和 300（Light）字重
// export const fontSans = Roboto({
// 	weight: ['100', '300', '400', '500', '700'],
// 	subsets: ['latin'],
// 	variable: '--font-sans',
// 	display: 'swap'
// });
