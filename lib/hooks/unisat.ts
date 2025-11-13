// import {useState, useCallback} from 'react';
// import useSWR from 'swr';
// import {useWalletStore} from '@/app/store';
// import {proxyUnisatApiCache} from '@/lib';
// import {getAddressType} from '@/lib/module/bitcoin';
// import type {AddressType} from '@/lib/module/bitcoin';
// import type {BRC20Info, RunesInfo} from '@/types/unisat';

// // 初始化配置接口
// export interface UnisatInitConfig {
// 	brc20List?: boolean; // 是否初始获取 BRC20 列表
// 	runeList?: boolean; // 是否初始获取符文列表
// 	addressList?: boolean; // 是否初始获取地址列表
// }

// // 铭刻hook 最好拆分成两个，一个查询数据 一个铭刻
// export function useUnisatMintOrderList(initConfig?: UnisatInitConfig) {
// 	const {wallet} = useWalletStore();

// 	// 获取brc20数据列表
// 	const getBrc20List = async (chain: Chain): Promise<BRC20Info[]> => {
// 		const res = await proxyUnisatApiCache(chain, {method: 'GET', url: `/v1/indexer/brc20/status?start=${0}&limit=${200}&sort=${'deploy'}&complete=${'no'}`});
// 		return res.success ? (res?.data?.data?.detail ?? []) : [];
// 	};

// 	// 获取符文数据列表
// 	const getRunesList = async (chain: Chain): Promise<RunesInfo[]> => {
// 		const res = await proxyUnisatApiCache(chain, {method: 'GET', url: `/v1/indexer/runes/info-list?start=${0}&limit=${200}&sort=${'timestamp'}&complete=${'no'}`});
// 		return res.success ? (res?.data?.data?.detail ?? []) : [];
// 	};

// 	// 使用 useSWR 获取 BRC20 列表
// 	const {
// 		data: brc20List = [],
// 		error: brc20Error,
// 		isLoading: brc20Loading,
// 		mutate: mutateBrc20
// 	} = useSWR(initConfig?.brc20List ? 'BRC20_LIST' : null, () => getBrc20List(wallet.chain), {
// 		revalidateOnFocus: false, // 窗口聚焦时不重新验证
// 		revalidateOnReconnect: false, // 网络重连时不重新验证
// 		refreshInterval: 0, // 不自动刷新
// 		revalidateIfStale: false // 数据过期时不重新验证
// 	});
// 	// 使用 useSWR 获取符文列表
// 	const {
// 		data: runesList = [],
// 		error: runesError,
// 		isLoading: runesLoading,
// 		mutate: mutateRunes
// 	} = useSWR(initConfig?.runeList ? 'RUNES_LIST' : null, () => getRunesList(wallet.chain), {
// 		revalidateOnFocus: false, // 窗口聚焦时不重新验证
// 		revalidateOnReconnect: false, // 网络重连时不重新验证
// 		refreshInterval: 0, // 不自动刷新
// 		revalidateIfStale: false // 数据过期时不重新验证
// 	});

// 	return {
// 		brc20List,
// 		runesList,
// 		loading: brc20Loading ?? runesLoading,
// 		error: brc20Error ?? runesError,
// 		mutateBrc20,
// 		mutateRunes
// 	};
// }

// // 使用搜索账户余额
// export function useSearchAddressBalance({init}: {init: boolean}) {
// 	const {wallet} = useWalletStore();
// 	const [list, setList] = useState<{address: string; balance: number}[]>([]); // 筛选后的地址列表

// 	// 获取地址列表数据
// 	const getAddressList = async (chain: Chain) => {
// 		const res = await proxyUnisatApiCache(chain, {method: 'GET', url: `/v1/public/address/rich-list?cursor=0&size=500`});
// 		console.log('全网地址余额列表', res);
// 		return res.success ? (res.data?.data ?? []) : [];
// 	};

// 	// 根据 init 参数决定是否自动获取数据
// 	const {
// 		data: allAddress = [],
// 		error,
// 		isLoading,
// 		mutate
// 	} = useSWR(init ? 'ADDRESS_LIST' : null, () => getAddressList(wallet.chain), {
// 		revalidateOnFocus: false, // 窗口聚焦时不重新验证
// 		// revalidateOnReconnect: false, // 网络重连时不重新验证
// 		refreshInterval: 0, // 不自动刷新
// 		revalidateIfStale: false // 数据过期时不重新验证
// 	});

// 	/**
// 	 * 根据地址类型搜索地址列表
// 	 * @param addressTypes - 要搜索的地址类型数组
// 	 * @param balanceRange - 可选的余额范围 [min, max]
// 	 */
// 	const search = useCallback(
// 		(addressTypes: AddressType[], balanceRange?: [number, number]) => {
// 			console.log('搜索参数:', {addressTypes, balanceRange});
// 			console.log('原始数据长度:', allAddress.length);

// 			let filtered = allAddress;

// 			// 如果指定了地址类型，先按地址类型筛选
// 			if (addressTypes.length > 0) {
// 				filtered = filtered.filter((item: {address: string; balance: number}) => {
// 					const addressType = getAddressType(item.address);
// 					const isIncluded = addressTypes.includes(addressType);

// 					return isIncluded;
// 				});
// 			}

// 			// 如果指定了余额范围，再按余额范围筛选
// 			if (balanceRange && balanceRange.length === 2) {
// 				const [minBalance, maxBalance] = balanceRange;
// 				const minSatoshi = minBalance * 1e8;
// 				const maxSatoshi = maxBalance * 1e8;

// 				filtered = filtered.filter((item: {address: string; balance: number}) => {
// 					const isInRange = item.balance >= minSatoshi && item.balance <= maxSatoshi;
// 					return isInRange;
// 				});
// 			}

// 			setList(filtered);
// 		},
// 		[allAddress]
// 	);

// 	return {
// 		allAddress, // 原始地址列表
// 		list, // 筛选后的地址列表
// 		search,
// 		isLoading,
// 		error,
// 		mutate
// 	};
// }
