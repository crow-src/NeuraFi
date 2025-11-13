'use client';
import {useState, useEffect} from 'react';
import {cn, Button, Image} from '@heroui/react';
import {Icon} from '@iconify/react';
import {useAppKitNetwork, useAppKitAccount, useAppKitState, useAppKit} from '@reown/appkit/react';
import {button} from '@/components/primitives';
import {EVM_RPC_CONFIG} from '@/config/network';
import {obsTxt, fixDec} from '@/lib/utils';
//login按钮
export function LoginButton() {
	const {open, close} = useAppKit(); //打开关闭模态框
	const {address, isConnected, caipAddress, status, embeddedWalletInfo} = useAppKitAccount(); // 更新：使用 AppKit account
	const {chainId} = useAppKitNetwork(); // 更新：使用 AppKit network 获取 chainId
	const {loading} = useAppKitState();

	// 根据网络ID获取图标
	const getNetworkIcon = (networkId: number | string) => {
		const network = EVM_RPC_CONFIG.find(config => config.chainId === networkId);
		console.log('network', network?.icon);
		return network?.icon ?? '/images/chain/eth.svg';
	};

	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return address ? (
		<Button className={cn(button({color: 'primary'}), 'flex gap-4 w-full rounded-md max-w-[160px] min-w-[134px] max-h-[30px] border-0')} isLoading={loading} onPress={() => open()}>
			<Image src={getNetworkIcon(chainId as number)} alt='network' className='w-4 h-4 rounded-full flex-shrink-0' />
			<span className='text-sm'>{obsTxt(address, 4, 4)}</span>
		</Button>
	) : (
		<Button className={cn(button({color: 'primary'}), 'flex gap-2 w-full rounded-md max-w-[134px] min-w-[134px] max-h-[30px] border-0')} isLoading={loading} onPress={() => open()}>
			<Icon height={20} icon='fluent:wallet-16-regular' width={20} />
			Connect
		</Button>
	);
}

LoginButton.displayName = 'LoginButton';
