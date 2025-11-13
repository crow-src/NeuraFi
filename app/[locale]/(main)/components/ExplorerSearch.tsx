'use client';
import React, {useState, useId, useEffect} from 'react';
import {Autocomplete, AutocompleteItem} from '@heroui/autocomplete';
import {Avatar} from '@heroui/avatar';
import {Button} from '@heroui/button';
import {Input} from '@heroui/input';
import {Icon} from '@iconify/react';
import {useAppKitNetwork} from '@reown/appkit/react'; // 更新：使用 Reown AppKit hooks
import {getAddressTypeByPrefix} from '@/lib/module/bitcoin/utils';

/**
 * 输入类型
 */
type InputType = 'address' | 'txid' | 'unknown';

/**
 * 检测输入内容类型
 * @param input 输入字符串
 * @returns 输入类型
 */
const detectInputType = (input: string): InputType => {
	const trimmed = input.trim();

	// 使用现有的地址类型判断方法
	const addressType = getAddressTypeByPrefix(trimmed);

	switch (addressType) {
		case 'P2PKH':
		case 'P2SH':
		case 'P2WPKH':
		case 'P2WSH':
		case 'P2TR':
			return 'address';
		default:
			// 如果不是已知地址类型，检查是否为交易哈希
			if (/^[a-fA-F0-9]{64}$/.test(trimmed)) {
				return 'txid';
			}
			return 'unknown';
	}
};

/**
 * 构建搜索URL
 * @param input 搜索输入
 * @param explorerUrl 浏览器基础URL
 * @returns 搜索URL
 */
const buildSearchUrl = (input: string, explorerUrl: string) => {
	const inputType = detectInputType(input);

	switch (inputType) {
		case 'address':
			return `${explorerUrl}/address/${input}`;
		case 'txid':
			return `${explorerUrl}/tx/${input}`;
		default:
			return `${explorerUrl}/tx/${input}`;
	}
};

/**
 * 搜索数据项接口
 */
interface SearchDataItem {
	id: number;
	name: string;
	icon: string;
	symbol: string;
}

/**
 * 搜索组件属性接口
 */
interface SearchProps {
	/** 搜索数据数组 */
	data: SearchDataItem[];
}

/**
 * 区块链浏览器搜索组件 - 支持地址和交易哈希搜索
 * 自动检测输入类型并在新窗口打开对应的浏览器页面
 */
export const ExplorerSearch = () => {
	//const {wallet} = useWalletStore();
	const {caipNetwork, chainId} = useAppKitNetwork(); // 更新：使用 AppKit network 获取 chainId
	const [searchValue, setSearchValue] = useState('');
	const [mounted, setMounted] = useState(false);
	const inputId = useId(); // 添加稳定的 ID

	// 确保组件在客户端挂载后再渲染，避免 hydration 不匹配
	useEffect(() => {
		setMounted(true);
	}, []);

	/**
	 * 处理搜索操作
	 */
	const handleSearch = () => {
		if (!searchValue.trim()) return;

		const url = buildSearchUrl(searchValue.trim(), caipNetwork?.blockExplorers?.default?.url ?? '');
		if (url) {
			window.open(url, '_blank');
		}
	};

	/**
	 * 处理回车键
	 */
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleSearch();
		}
	};

	const inputType = detectInputType(searchValue);
	const isValidInput = inputType !== 'unknown';

	// 在组件挂载前显示占位符，避免 hydration 不匹配
	if (!mounted) {
		return (
			<div className='flex-1 text-primary-foreground'>
				<div className='group flex h-10 w-full items-center rounded-lg border border-primary-border/30 bg-primary-background px-3 py-0'>
					<div className='flex h-full w-full items-center'>
						<Icon icon='streamline-plump:web' width={16} className='text-primary-foreground/50' />
						<div className='ml-2 h-4 w-32 bg-primary-foreground/10 rounded animate-pulse' />
					</div>
				</div>
			</div>
		);
	}

	return (
		<Input
			id={inputId} // 使用稳定的 ID
			aria-label='Search address or hash'
			placeholder='Enter address or hash...'
			type='text'
			value={searchValue}
			onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
			onKeyDown={handleKeyDown}
			classNames={{
				base: 'flex-1 text-primary-foreground',
				input: 'text-primary-foreground ',
				inputWrapper: 'bg-primary-background border border-primary-border/30 data-[hover=true]:border-primary data-[focus=true]:border-primary data-[focus-visible=true]:border-primary rounded-lg py-0'
			}}
			startContent={<Icon icon='streamline-plump:web' width={16} />}
			endContent={
				<Button isIconOnly onPress={handleSearch} isDisabled={!isValidInput} size='sm' className='bg-transparent' radius='sm'>
					<Icon icon='icon-park-twotone:search' width={16} className='text-primary-foreground' />
				</Button>
			}
			color={'primary'}
		/>
	);
};

ExplorerSearch.displayName = 'ExplorerSearch';

/**
 * 自动完成搜索组件 - 带下拉选项的搜索框
 * @param data 搜索数据数组
 */
export const Search = ({data}: SearchProps) => {
	return (
		<Autocomplete
			aria-label='Select an employee'
			placeholder='Explorer search'
			defaultItems={data}
			classNames={{
				base: 'w-full rounded-md p-0 m-0 text-primary-foreground border-none',
				listboxWrapper: 'max-h-[600px]',
				selectorButton: 'text-primary-foreground/50'
			}}
			inputProps={{
				classNames: {
					input: 'p-0',
					inputWrapper: ' bg-primary-background border border-primary-border/30 m-0 data-[hover=true]:border-primary data-[focus=true]:border-primary data-[focus-visible=true]:border-primary data-[selected=true]:border-primary'
				}
			}}
			listboxProps={{
				hideSelectedIcon: true,
				itemClasses: {
					base: ['rounded-small', 'text-primary-foreground/50', 'transition-opacity', 'data-[hover=true]:text-primary-foreground', 'dark:data-[hover=true]:bg-default-50', 'data-[pressed=true]:opacity-70', 'data-[hover=true]:bg-default-200', 'data-[selectable=true]:focus:bg-default-100', 'data-[focus-visible=true]:ring-default-500']
				}
			}}
			popoverProps={{
				offset: 10,
				classNames: {
					base: 'rounded-small',
					content: 'rounded-small p-1 border-small border border-primary-border/30 bg-background'
				}
			}}
			startContent={<Icon icon='solar:rounded-magnifer-linear' width={16} />}
			radius='sm'
			variant='bordered'>
			{item => (
				<AutocompleteItem key={item.id} textValue={item.name}>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-2'>
							<Avatar alt={item.name} className='shrink-0' size='sm' src={item.icon} />
							<div className='flex flex-col'>
								<span className='text-small'>{item.name}</span>
								<span className='text-tiny text-primary-foreground/50'>{item.symbol}</span>
							</div>
						</div>
						<Button className='border-small mr-0.5 font-medium shadow-small' radius='full' size='sm' variant='bordered'>
							View
						</Button>
					</div>
				</AutocompleteItem>
			)}
		</Autocomplete>
	);
};

Search.displayName = 'Search';
