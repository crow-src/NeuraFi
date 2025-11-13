'use client';

import React from 'react';
import {useRouter} from 'next/navigation';
import {ToastProvider} from '@heroui/react';
import {HeroUIProvider} from '@heroui/system';
import {AppKitProvider} from '@reown/appkit/react';
import {ThemeProvider as NextThemesProvider} from 'next-themes';
import {ThemeProviderProps} from 'next-themes/dist/types';
import {projectId, networks, metadata, ethersAdapter} from '@/config/appkit';

export function Providers({children, themeProps}: {children: React.ReactNode; themeProps?: ThemeProviderProps}) {
	const router = useRouter();

	return (
		<AppKitProvider
			projectId={projectId}
			metadata={metadata}
			adapters={[ethersAdapter]} // 只做 EVM 就留 ethersAdapter；多链再把 solana/bitcoin 加回来
			networks={networks}
			themeVariables={{
				'--w3m-z-index': 2147483647, // 让钱包弹窗永远在最上面
				//'--w3m-font-family': 'var(--font-sans)', // 设置字体
				//'--w3m-accent': '#ffaa33',
				//'--w3m-color-mix': '#000000', // 设置颜色混合
				//'--w3m-color-mix-strength': 30, // 设置颜色混合强度
				//'--w3m-font-size-master': '14px', // 设置字体大小
				'--w3m-border-radius-master': '2px', // 设置按钮圆角
				'--w3m-qr-color': '#000000'
			}}>
			<HeroUIProvider navigate={router.push}>
				<NextThemesProvider {...themeProps}>
					<ToastProvider placement='top-center' toastOffset={60} />
					{children}
				</NextThemesProvider>
			</HeroUIProvider>
		</AppKitProvider>
	);
}
