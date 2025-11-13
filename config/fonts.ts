import {Inter as FontSans, Quicksand as FontQuicksand, Silkscreen as FontSilkscreen} from 'next/font/google';

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

export const fontSans = FontSans({
	weight: ['400', '700'],
	subsets: ['latin'],
	variable: '--font-sans'
});
