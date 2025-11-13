'use client';
import React, {useState, useEffect, useMemo, FC, useId} from 'react';

import {useRouter, usePathname, useSearchParams} from 'next/navigation';

import {Avatar, Image, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, VisuallyHidden, Skeleton} from '@heroui/react';
import {cn} from '@heroui/react';
import {SwitchProps, useSwitch} from '@heroui/react';
import {Icon} from '@iconify/react';
import {useIsSSR} from '@react-aria/ssr';
import {useTheme} from 'next-themes';
import {useMountedState} from 'react-use';

// import {useWalletStore} from '@/app/store';
import {SunFilledIcon, MoonFilledIcon} from '@/components/icons';
import {MAIN_CONFIG} from '@/config';

export const SwitchLanguage = () => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [selectedKeys, setSelectedKeys] = useState<string>('en');
	const dropdownId = useId(); // 添加稳定的 ID

	// 从 URL 路径中获取当前语言
	useEffect(() => {
		const segments = pathname.split('/');
		const currentLocale = segments[1] || 'en';
		setSelectedKeys(currentLocale);
	}, [pathname]);

	const handleChangeLanguage = (newLocale: string) => {
		const segments = pathname.split('/');
		segments[1] = newLocale;
		const newPath = segments.join('/');
		const params = new URLSearchParams(searchParams.toString()); // 保留所有 URL 参数
		router.push(`${newPath}?${params.toString()}`);
		setSelectedKeys(newLocale);
	};

	return (
		<Dropdown>
			<DropdownTrigger>
				<span
					id={dropdownId} // 使用稳定的 ID
					className='flex items-center justify-center w-full cursor-pointer'
					suppressHydrationWarning // 抑制水合警告
				>
					{/* {MAIN_CONFIG.languages.find(item => item.key === selectedKeys)?.label} */}
					<Icon icon={MAIN_CONFIG.languages.find(item => item.key === selectedKeys)?.icon ?? 'akar-icons:language'} className='text-primary-foreground/60 w-6 h-6 shrink-0' />
				</span>
			</DropdownTrigger>

			<DropdownMenu
				aria-label={'lang'}
				color='primary'
				variant='flat'
				disallowEmptySelection
				selectionMode='single'
				selectedKeys={selectedKeys}
				onSelectionChange={keys => {
					const key = Array.from(keys)[0];
					handleChangeLanguage(key as string);
				}}>
				{MAIN_CONFIG.languages.map(item => (
					<DropdownItem key={item.key} startContent={<Icon icon={item.icon} />}>
						{item.label}
					</DropdownItem>
				))}
			</DropdownMenu>
		</Dropdown>
	);
};

export const SwitchGas = () => {
	// const {feeRate, initialize} = useFeeRateStore();
	const gasDropdownId = useId(); // 添加稳定的 ID

	// const list = useMemo(
	// 	() => [
	// 		{label: 'High', value: feeRate.fastestFee},
	// 		{label: 'Medium', value: feeRate.halfHourFee},
	// 		{label: 'Low', value: feeRate.economyFee}
	// 	],
	// 	[feeRate]
	// );

	const [selected, setSelected] = useState(1);

	// // 初始化费率监听
	// useEffect(() => {
	// 	initialize();
	// }, [initialize]);

	return (
		<>TEST</>
		// <Dropdown>
		// 	<DropdownTrigger>
		// 		<span
		// 			id={gasDropdownId} // 使用稳定的 ID
		// 			className='flex gap-1 items-center justify-center w-full cursor-pointer md:border border-primary-border/30 rounded-md md:px-4 md:py-1'
		// 			suppressHydrationWarning // 抑制水合警告
		// 		>
		// 			<Icon icon={'solar:gas-station-bold-duotone'} className='text-primary-foreground w-4 h-4' />
		// 			<p className={`font-black ${list[selected].value > 25 ? (list[selected].value > 50 ? 'text-red-400' : 'text-yellow-400') : 'text-green-400'}`}>{list[selected].value}</p>
		// 			<p className='text-primary-foreground/40 whitespace-nowrap hidden md:block'>{' sats/vB'}</p>
		// 		</span>
		// 	</DropdownTrigger>
		// 	<DropdownMenu
		// 		color='primary'
		// 		itemClasses={{base: ' text-primary-foreground'}}
		// 		aria-label='gas'
		// 		variant='flat'
		// 		items={list}
		// 		disallowEmptySelection
		// 		selectionMode='single'
		// 		// selectedKeys={selected}
		// 		onSelectionChange={key => {
		// 			const selectedIndex = list.findIndex(item => item.label === key.currentKey);
		// 			setSelected(selectedIndex);
		// 		}}>
		// 		{list.map((item, index) => (
		// 			<DropdownItem key={item.label} startContent={<Icon icon={'solar:gas-station-bold-duotone'} className={index > 0 ? (index > 1 ? 'text-red-400' : 'text-primary-foreground') : 'text-green-400'} />}>
		// 				<div className='flex items-center justify-between w-full gap-2 p-2 bg-transparent '>
		// 					<p className='w-full'>{item.label}</p>
		// 					<p className={`text-right ${item.value > 25 ? (item.value > 50 ? 'text-red-400' : 'text-yellow-400') : 'text-green-400'}`}>{item.value}</p>
		// 					<p className='text-right text-primary-foreground/40'>{' sats/vB'}</p>
		// 				</div>
		// 			</DropdownItem>
		// 		))}
		// 	</DropdownMenu>
		// </Dropdown>
	);
};

// export const SwitchNetwork = () => {
// 	const {wallet} = useWalletStore();
// 	const isMounted = useMountedState();
// 	const networkDropdownId = useId(); // 添加稳定的 ID

// 	// 根据每个钱包支持的网络来显示
// 	const rpc = useMemo(() => {
// 		const _wallet = wallet.walletConfigs.find(item => item.key == wallet.walletKey);
// 		if (_wallet?.supportChain.includes(wallet.chain.enum)) return wallet.chainConfigs.filter(item => _wallet?.supportChain.includes(item.enum));
// 		return wallet.chainConfigs;
// 	}, [wallet.walletKey, wallet.chain, wallet.walletConfigs, wallet.chainConfigs]);

// 	// 防止水合不匹配 - 服务端不渲染动态内容
// 	if (!isMounted()) {
// 		return <Skeleton className='h-8 w-20 rounded-md' />;
// 	}

// 	return (
// 		<Dropdown isDisabled={!wallet.accounts[0]}>
// 			<DropdownTrigger>
// 				<span
// 					id={networkDropdownId} // 使用稳定的 ID
// 					className='flex gap-1 items-center justify-center w-full cursor-pointer md:border border-primary-border/30 rounded-md md:px-4 md:py-1'
// 					suppressHydrationWarning // 抑制水合警告
// 				>
// 					<Avatar alt='Network Icon' src={wallet.chain?.icon} className='w-4 h-4 shrink-0' fallback='/images/chain/btc.svg' />
// 					<p className='text-green-400 whitespace-nowrap hidden md:block'>{wallet.chain?.name}</p>
// 				</span>
// 			</DropdownTrigger>
// 			<DropdownMenu
// 				color='primary'
// 				itemClasses={{base: ' text-primary-foreground'}}
// 				aria-label='network'
// 				variant='flat'
// 				items={rpc}
// 				disallowEmptySelection
// 				selectionMode='single'
// 				selectedKeys={wallet.chain?.enum || wallet.chainConfigs[0].enum}
// 				onSelectionChange={keys => {
// 					const key = Array.from(keys)[0];
// 					const chain = wallet.chainConfigs.find(item => item.key == key) ?? wallet.chainConfigs[0];
// 					wallet.switchChain(chain);
// 				}}>
// 				{rpc.map(item => (
// 					<DropdownItem key={item.key} startContent={<Image alt={item.key + 'icon'} src={item.icon || wallet.chain?.icon} key='network-icon' className='w-4 h-4 block' />}>
// 						{item.name}
// 					</DropdownItem>
// 				))}
// 			</DropdownMenu>
// 		</Dropdown>
// 	);
// };

export const ThemeSwitch: FC<{className?: string; classNames?: SwitchProps['classNames']}> = ({className, classNames}) => {
	const {theme, setTheme} = useTheme();
	const isSSR = useIsSSR();
	const onChange = () => {
		theme === 'light' ? setTheme('dark') : setTheme('light');
	};

	const {Component, slots, isSelected, getBaseProps, getInputProps, getWrapperProps} = useSwitch({
		isSelected: theme === 'light' || isSSR,
		'aria-label': `Switch to ${theme === 'light' || isSSR ? 'dark' : 'light'} mode`,
		onChange
	});

	return (
		<Component {...getBaseProps({className: cn('px-px transition-opacity hover:opacity-80 cursor-pointer', className, classNames?.base)})}>
			<VisuallyHidden>
				<input {...getInputProps()} />
			</VisuallyHidden>
			<div
				{...getWrapperProps()}
				className={slots.wrapper({
					class: cn(['w-auto h-auto', 'bg-transparent', 'rounded-md', 'flex items-center justify-center', 'group-data-[selected=true]:bg-transparent', 'text-primary-foreground/50!', 'pt-px', 'px-0', 'mx-0'], classNames?.wrapper)
				})}>
				{!isSelected || isSSR ? <SunFilledIcon size={20} className='text-primary-foreground/50' /> : <MoonFilledIcon size={20} className='text-primary-foreground/50' />}
			</div>
		</Component>
	);
};
