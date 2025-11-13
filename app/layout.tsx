import '@/styles/globals.css';
import {Metadata} from 'next';

import {cn} from '@heroui/react';

import {Providers} from '@/app/providers';
import {MAIN_CONFIG} from '@/config';
import {fontQuicksand} from '@/config/fonts';
// import clsx from 'clsx';

export const metadata: Metadata = {
	title: {default: MAIN_CONFIG.name, template: `%s - ${MAIN_CONFIG.name}`},
	description: MAIN_CONFIG.description,
	icons: {
		icon: '/favicon.ico',
		shortcut: '/favicon-64x64.png',
		apple: '/apple-touch-icon.png'
	}
};

export default function RootLayout({children}: {children: React.ReactNode}) {
	return (
		<html lang='en' suppressHydrationWarning>
			<head />
			<body className={cn('min-h-screen bg-background font-sans antialiased custom-scrollbar', fontQuicksand.variable)}>
				<Providers themeProps={{attribute: 'class', defaultTheme: 'dark'}}>
					<main className=' grow p-0 mx-auto w-full'>{children}</main>
				</Providers>
			</body>
		</html>
	);
}
