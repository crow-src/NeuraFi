import {useEffect, useState, useMemo, useCallback, useRef} from 'react';
import {parseUnits, formatUnits, ZeroAddress, parseEther} from 'ethers';
// import {ethers} from 'ethers';
// import {useMount} from 'react-use';
import {useUserDataStore} from '@/app/store';
import {getAccountDataFromNeurafi, addIDOAmount, getAccountDataBySlug, getUserByInvitationCode, getDirectReferralsByAddressFromNeurafi} from '@/lib/api/db';
import {IERC20} from '@/lib/contract/abi';
import {useBrowserWallet, useTransactionManager} from '@/lib/hooks';
import {withError} from '@/lib/utils';
import {useContract, useMulticall, useERC20} from './common';

//操作用户账户合约
const DONATION_TOKEN = '0x55d398326f99059fF775485246999027B3197955'; //转移代币合约 测试:0xc1f92e6a5878e25b1547b52461771ef40b4cf0fe 正式:0x55d398326f99059fF775485246999027B3197955
const DONATION_TOKEN_DECIMALS = 18;
const TREASURY_ADDRESS = '0x7f268Ee4CD8DDfa52Bfe4D00e06216561A9cd7c4'; //接收代币地址 测试: 0x1553fb4d5e0c3a8cbbf6e1571dcd6ae0678de84e     正式:0xbEf6652155A326F93DF759b911F70352826806dA

export const useNeuraFiAccount = () => {
	const {userData, updateUserData} = useUserDataStore();
	const {addTransaction} = useTransactionManager({onComplete: () => {}});
	const [isLoading, setIsLoading] = useState(false); //加载数据中
	const [isExecuting, setIsExecuting] = useState(false); //执行中
	const {signer, address, isConnected} = useBrowserWallet();
	const {multicall, multicallAddr, call} = useMulticall();
	const usdt = useContract(DONATION_TOKEN, IERC20, signer); //代币合约
	const fetchingRef = useRef(false);
	const lastAddressRef = useRef<string>('');

	//获取用户所有数据 - 统一查询链上数据和数据库数据
	const _getUserData = async () => {
		if (!address || !multicall || !usdt || fetchingRef.current) return;
		fetchingRef.current = true;

		try {
			const [chainDataResult, dbDataResult, referralsResult] = await Promise.allSettled([
				(async () => {
					const calls = [
						[multicallAddr, multicall.interface.encodeFunctionData('getEthBalance', [address])],
						[DONATION_TOKEN, usdt.interface.encodeFunctionData('balanceOf', [address])]
					];
					const decodedResults = await call(calls);
					const ethBalance = multicall.interface.decodeFunctionResult('getEthBalance', decodedResults.returnData[0])[0];
					const usdtBalance = usdt.interface.decodeFunctionResult('balanceOf', decodedResults.returnData[1])[0];
					return {ethBalance: formatUnits(ethBalance, 18), usdtBalance: formatUnits(usdtBalance, DONATION_TOKEN_DECIMALS)};
				})(),
				getAccountDataFromNeurafi(address),
				getDirectReferralsByAddressFromNeurafi(address)
			]);

			// 处理链上余额数据 - 无论数据库查询结果如何，都要更新余额
			const chainData = chainDataResult.status === 'fulfilled' ? chainDataResult.value : null;

			// 处理数据库账户数据
			const dbData = dbDataResult.status === 'fulfilled' && dbDataResult.value.success && dbDataResult.value.data ? dbDataResult.value.data : null;

			// 获取下线列表
			const referrals = referralsResult.status === 'fulfilled' && referralsResult.value.success && Array.isArray(referralsResult.value.data) ? referralsResult.value.data : [];

			const updates: Partial<typeof userData> = {};

			if (dbData) {
				Object.assign(updates, {
					...dbData,
					deposits: dbData.deposits ?? [],
					referrals
				});
			} else {
				updates.referrals = referrals;
			}

			if (chainData) {
				updates.ethBalance = chainData.ethBalance;
				updates.usdtBalance = chainData.usdtBalance;
			}

			if (Object.keys(updates).length > 0) {
				updateUserData(updates);
			}
		} finally {
			fetchingRef.current = false;
		}
	};

	const getUserData = withError({title: 'getUserData', onStart: () => setIsLoading(true), onComplete: () => setIsLoading(false)})(_getUserData);

	// 初始化时调用 _getUserData - 只在 address 变化时触发
	useEffect(() => {
		if (!address || address === lastAddressRef.current) return;
		lastAddressRef.current = address;
		// 如果 multicall 和 usdt 还没准备好，会在下一个 useEffect 中触发
		if (multicall && usdt) {
			_getUserData();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [address]);

	// 当 multicall 和 usdt 准备好时，如果 address 已设置且未查询过则查询
	useEffect(() => {
		if (!address || !multicall || !usdt) return;
		// 如果正在查询或已经查询过这个 address，不再重复查询
		if (fetchingRef.current) return;
		_getUserData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [multicall, usdt]);

	// 申购
	const _purchase = async (level: number, amount: string, inviteCode?: string) => {
		if (isConnected && address && usdt) {
			const tx = await usdt.transfer(TREASURY_ADDRESS, parseUnits(amount, DONATION_TOKEN_DECIMALS));
			const result = await addIDOAmount(address, Number(amount), level, inviteCode);
			await addTransaction({...tx, type: 'Other'}).then(() => {
				_getUserData(); //更新用户数据
			});
			return tx;
		}
		return null;
	};

	const purchase = withError({title: 'purchase', onStart: () => setIsExecuting(true), onComplete: () => setIsExecuting(false), onError: error => setIsExecuting(false)})(_purchase);

	return {isLoading, isExecuting, userData, address, isConnected, purchase, getUserData};
};

// 邀请码验证 Hook
export const useInviteValidation = (slug: string | null) => {
	const [inviteCode, setInviteCode] = useState('');
	const [inviteAccepted, setInviteAccepted] = useState(false);
	const [inviteError, setInviteError] = useState(false);
	const [checkingInvite, setCheckingInvite] = useState(false);

	// 检查 slug 参数，如果有且数据库有账户则直接进入
	useEffect(() => {
		if (!slug || inviteAccepted) return;
		const checkSlug = async () => {
			setCheckingInvite(true);
			try {
				const result = await getAccountDataBySlug(slug);
				if (result.success && result.data) {
					setInviteAccepted(true);
					setInviteCode(slug);
				}
			} catch (error) {
				console.error('Failed to check slug', error);
			} finally {
				setCheckingInvite(false);
			}
		};
		checkSlug();
	}, [slug, inviteAccepted]);

	// 验证邀请码
	const inviteCompleted = inviteCode.length === 6;
	useEffect(() => {
		if (!inviteCompleted || inviteAccepted) return;
		const validateInviteCode = async () => {
			// 检查邀请码是否在数据库中有账户
			setCheckingInvite(true);
			setInviteError(false);
			try {
				const result = await getUserByInvitationCode(inviteCode);
				if (result.success && result.data) {
					setInviteAccepted(true);
					setInviteError(false);
				} else {
					setInviteError(true);
					setInviteAccepted(false);
				}
			} catch (error) {
				console.error('Failed to validate invite code', error);
				setInviteError(true);
				setInviteAccepted(false);
			} finally {
				setCheckingInvite(false);
			}
		};
		validateInviteCode();
	}, [inviteCode, inviteCompleted, inviteAccepted]);

	return {
		inviteCode,
		setInviteCode,
		inviteAccepted,
		inviteError,
		checkingInvite,
		inviteCompleted
	};
};
