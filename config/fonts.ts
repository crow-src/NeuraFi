import {Inter as FontSans, Quicksand as FontQuicksand, Silkscreen as FontSilkscreen, Geist_Sans} from 'next/font/google';

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

// Geist Sans 字体 - Vercel 开发的超细字体，比 Inter 更纤细精致
export const fontSans = Geist_Sans({
	weight: ['100', '200', '300', '400', '500', '600'],
	subsets: ['latin'],
	variable: '--font-sans',
	display: 'swap' // 优化字体加载性能
});

// Inter 字体 - 备用选项（如果不想用 Geist，可以切换回这个）
// export const fontSans = FontSans({
// 	weight: ['300', '400', '500', '600'],
// 	subsets: ['latin'],
// 	variable: '--font-sans',
// 	display: 'swap'
// });
