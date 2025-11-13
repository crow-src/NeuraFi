import React, {Suspense} from 'react';

import NextLink from 'next/link';

import {Avatar} from '@heroui/avatar';
import {Navbar as NextUINavbar, NavbarContent, NavbarBrand, NavbarItem} from '@heroui/react';
import {Icon} from '@iconify/react';

import {LoginButton} from '@/app/[locale]/(main)/components';
// import {ExplorerSearch} from '@/app/[locale]/(main)/components';
import {HotScroll} from '@/app/[locale]/(main)/components';
import {SwitchLanguage, SwitchGas, ThemeSwitch} from '@/components/client'; // SwitchLanguage, LoginButton, Search SwitchNetwork,
import {MAIN_CONFIG} from '@/config';

export const Navbar = () => {
	return (
		<NextUINavbar maxWidth='full' position='static' classNames={{wrapper: 'gap-4'}}>
			{/* Logo 区域 */}
			<NavbarContent justify='start' className='!flex-grow-0'>
				<NavbarBrand className='gap-2 max-w-fit'>
					<NextLink className='flex items-center justify-start gap-2' href='/'>
						<Avatar radius='full' size='sm' src='/favicon.png' className='w-6 h-6 bg-transparent shrink-0' />
						<p className='font-bold text-primary-foreground/50'>{MAIN_CONFIG.name}</p>
					</NextLink>
				</NavbarBrand>
			</NavbarContent>
			<NavbarItem className='!flex-grow-0'>
				<Suspense
					fallback={
						<span className='flex gap-1 items-center justify-center cursor-pointer border border-primary-border/30 rounded-md px-4 py-1'>
							<Icon icon={'akar-icons:language'} className='text-foreground/60 w-4 h-4' />
							<p className='text-foreground/60 whitespace-nowrap'>Language</p>
						</span>
					}>
					<SwitchLanguage />
				</Suspense>
			</NavbarItem>
			{/* 搜索栏 - 占据剩余宽度 */}
			<NavbarItem className='hidden sm:flex !flex-grow !flex-shrink min-w-0'>
				<HotScroll />
			</NavbarItem>

			{/* 右侧按钮区域 */}
			<NavbarItem className='!flex-grow-0'>
				<ThemeSwitch />
			</NavbarItem>
			<NavbarItem className='!flex-grow-0'>
				<LoginButton />
			</NavbarItem>
		</NextUINavbar>
	);
};
