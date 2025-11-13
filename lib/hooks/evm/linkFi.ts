import {useEffect, useState, useMemo, useCallback} from 'react';
import {keccak256, solidityPacked, getCreate2Address, JsonRpcProvider, getAddress} from 'ethers';
import {parseUnits, formatUnits, ZeroAddress, parseEther} from 'ethers';
import {ethers} from 'ethers';
import {useMount} from 'react-use';
import {useUserDataStore, UserData, DepositRecord} from '@/app/store';
import {PROJECT_CONFIG} from '@/config/main';
import {IAgonBank, IMulticall, IAgonAccount, ITeam, IERC20} from '@/lib/contract/abi';
import {useBrowserWallet, useTransactionManager} from '@/lib/hooks';
import {withError} from '@/lib/utils';
import {useContract, useMulticall} from './common';

//操作用户账户合约
export const useAgonAccount = ({token}: {token: string}) => {
	const {userData} = useUserDataStore();
	const {getUserData} = useAgonData({token});
	const {addTransaction} = useTransactionManager({onComplete: () => getUserData()});
	const [isLoading, setIsLoading] = useState(false);
	const {signer, address} = useBrowserWallet();

	//计算地址
	const accountAddr = useMemo(() => {
		return address ? calculateAddress(address, PROJECT_CONFIG.accountClone, PROJECT_CONFIG.bankAddr) : '';
	}, [address]);

	const account = useContract(accountAddr, IAgonAccount, signer); //创建用户账户合约
	const bank = useContract(PROJECT_CONFIG.bankAddr, IAgonBank, signer); //银行合约
	const usdt = useContract(token, IERC20, signer);

	//创建账户绑定
	const _createAccountByReferrer = async (referrer?: string) => bank && (await bank.createAccountByReferrer(referrer ?? ZeroAddress).then(tx => addTransaction({...tx, type: 'Other'})));
	//转移
	const _transfer = async (amount: string) => usdt && (await usdt.transfer(accountAddr, parseUnits(amount, 18)).then(tx => addTransaction({...tx, type: 'Other'})));
	//存单
	const _deposit = async (token: string, amount: string, cycle: number) => bank && (await bank.deposit(token, parseUnits(amount, 18), cycle).then(tx => addTransaction({...tx, type: 'Other'})));
	//续存
	const _renew = async (token: string, index: number) => bank && (await bank.renew(token, index).then(tx => addTransaction({...tx, type: 'Other'})));
	//获取存单利息
	const _withdrawInterest = async (token: string, index: number) => bank && (await bank.withdrawInterest(token, index).then(tx => addTransaction({...tx, type: 'Other'})));
	//获取存单本金
	const _withdrawDeposit = async (token: string, index: number) => bank && (await bank.withdrawDeposit(token, index).then(tx => addTransaction({...tx, type: 'Other'})));
	//获取账户闲置资金
	const _withdraw = async (amount: string) => account && (await account.withdraw(token, parseUnits(amount, 18)).then(tx => addTransaction({...tx, type: 'Other'})));
	//设置名称
	const _setName = async (name: string) => account && (await account.setName(name).then(tx => addTransaction({...tx, type: 'Other'})));

	const createAccountByReferrer = withError({title: 'createAccountByReferrer', onStart: () => setIsLoading(true), onComplete: () => setIsLoading(false)})(_createAccountByReferrer);
	const transfer = withError({title: 'transfer', onStart: () => setIsLoading(true), onComplete: () => setIsLoading(false)})(_transfer);
	const deposit = withError({title: 'deposit', onStart: () => setIsLoading(true), onComplete: () => setIsLoading(false)})(_deposit);
	const renew = withError({title: 'renew', onStart: () => setIsLoading(true), onComplete: () => setIsLoading(false)})(_renew);
	const withdrawDeposit = withError({title: 'withdrawDeposit', onStart: () => setIsLoading(true), onComplete: () => setIsLoading(false)})(_withdrawDeposit);
	const withdraw = withError({title: 'withdraw', onStart: () => setIsLoading(true), onComplete: () => setIsLoading(false)})(_withdraw);
	const withdrawInterest = withError({title: 'withdrawInterest', onStart: () => setIsLoading(true), onComplete: () => setIsLoading(false)})(_withdrawInterest);
	const setName = withError({title: 'setName', onStart: () => setIsLoading(true), onComplete: () => setIsLoading(false)})(_setName);

	return {isLoading, userData, transfer, deposit, withdrawDeposit, withdraw, renew, withdrawInterest, setName, createAccountByReferrer};
};

//操作用户账户合约
export const useAgonData = ({token}: {token: string}) => {
	const {updateUserData, userData} = useUserDataStore();
	const [isLoading, setIsLoading] = useState(false);
	const {address, loading} = useBrowserWallet();

	const accountAddr = useMemo(() => {
		return address ? calculateAddress(address, PROJECT_CONFIG.accountClone, PROJECT_CONFIG.bankAddr) : '';
	}, [address]);

	const {multicall, multicallAddr, call} = useMulticall();
	const account = useContract(accountAddr, IAgonAccount); //创建用户账户合约
	const usdt = useContract(token, IERC20);

	//获取用户所有数据 - 使用 useCallback 包装
	const _getUserData = useCallback(async () => {
		if (!account || !multicall || !address || !accountAddr || !usdt) return;
		const calls = [
			[multicallAddr, multicall.interface.encodeFunctionData('getEthBalance', [address])], //获取用户eth余额 0
			[token, usdt.interface.encodeFunctionData('balanceOf', [address])], //获取用户usdt余额 1
			[accountAddr, account.interface.encodeFunctionData('getDeposits', [token])], //获取用户存单 2
			[accountAddr, account.interface.encodeFunctionData('getActiveFunds', [token])], //获取用户闲置资金 3
			[accountAddr, account.interface.encodeFunctionData('tokens', [])], //获取用户操作的资金 4
			[accountAddr, account.interface.encodeFunctionData('name', [])], //获取用户名  6
			[accountAddr, account.interface.encodeFunctionData('team', [])], //获取用户team地址 7
			[accountAddr, account.interface.encodeFunctionData('interests', [token])] //获取usdt的利息收益 8
		];

		const decodedResults = await call(calls); //解码调用数据

		const ethBalance = multicall.interface.decodeFunctionResult('getEthBalance', decodedResults.returnData[0])[0]; //解码eth余额 0
		const usdtBalance = usdt.interface.decodeFunctionResult('balanceOf', decodedResults.returnData[1])[0]; //解码usdt余额1
		const deposits = account.interface.decodeFunctionResult('getDeposits', decodedResults.returnData[2])[0]; //解码存单2
		const activeFunds = account.interface.decodeFunctionResult('getActiveFunds', decodedResults.returnData[3])[0]; //解码闲置资金3
		const tokens = account.interface.decodeFunctionResult('tokens', decodedResults.returnData[4])[0]; //解码操作的资金4
		const name = account.interface.decodeFunctionResult('name', decodedResults.returnData[5])[0]; //解码用户名 6
		const team = account.interface.decodeFunctionResult('team', decodedResults.returnData[6])[0]; //解码用户team地址 7
		const interests = account.interface.decodeFunctionResult('interests', decodedResults.returnData[7])[0]; //解码usdt的收益 8

		const depositList: DepositRecord[] = deposits.map((deposit: any, index: number) => {
			// 将 BigInt 转换为字符串，然后转换为数字进行比较
			const startTime = Number(deposit.startTime.toString()); // 假设是秒时间戳
			const cycleDays = Number(deposit.cycle.toString()); // 计算结束时间：startTime + cycle天数
			const endTime = startTime + cycleDays * 86400;
			const isCompleted = cycleDays === 0 ? false : endTime < Date.now() / 1000; // 判断是否完成：cycle为0表示永续，否则比较结束时间
			const isExtracted = startTime === 0; // 判断是否提取
			const amount = formatUnits(deposit.amount, 18); // 格式化 BigInt 金额
			const rate = Number(deposit.rate.toString()) / 100; // 假设 rate 是百分比，需要除以100

			return {
				id: index.toString(),
				isCompleted,
				isExtracted,
				token: token,
				amount: parseFloat(amount), // 转换为数字
				startTime,
				endTime,
				apy: rate,
				cycle: Number(deposit.cycle.toString()),
				leader: deposit.lender, //使用者
				isLiquidityEnabled: Number(deposit.rate.toString()) > 0, //利率大于0的时候 是流动性配置
				earnings: 0, //收益
				rate, //利率
				interest: formatUnits(deposit.interest, 18), //已获取的利息
				lastInterestTime: Number(deposit.lastInterestTime.toString()), //上次提取利息时间
				borrowInterest: Number(deposit.borrowInterest.toString()) //配资利息
			};
		});

		const data = {
			name: name === '' ? 'None' : name,
			slug: slugFromAddress(address),
			address,
			account: accountAddr,
			team: team,
			ethBalance: formatUnits(ethBalance, 18),
			usdtBalance: formatUnits(usdtBalance, 18),
			deposits: depositList,
			activeFunds: formatUnits(activeFunds, 18),
			tokens,
			interests: formatUnits(interests, 18)
		};
		updateUserData(data);
		console.log('userData:ok');
	}, [account, multicall, address, accountAddr, usdt, updateUserData, token, multicallAddr, call]); // 添加所有依赖

	//useMount(() => _getUserData()); //挂载后获取一次
	useEffect(() => {
		account && _getUserData();
	}, [account]);

	const getUserData = withError({title: 'getUserData', onStart: () => setIsLoading(true), onComplete: () => setIsLoading(false)})(_getUserData);
	return {isLoading, userData, getUserData};
};

//接口team data
export interface TeamData {
	name: string;
	level: number;
	address: string;
	owner: string;
	referrals: {address: string}[];
	teamSize: number;
	performance: string; //绩效
	leader: string;
	levelBonus: string; //级差
	levelBonusClaimed: string; //已领取级差
	referralBonus: string; //直推奖励
	referralBonusClaimed: string; //已领取直推奖励
}

//team hook
export const useTeam = ({token}: {token: string}) => {
	const {userData} = useUserDataStore(); //?????
	const {signer, address} = useBrowserWallet();
	const {addTransaction} = useTransactionManager({onComplete: () => getTeamData()}); //???

	const [isLoading, setIsLoading] = useState(false);
	const {multicall, call} = useMulticall();
	const bank = useContract(PROJECT_CONFIG.bankAddr, IAgonBank, signer);
	const team = useContract(userData.team ?? '', ITeam, signer);

	const [data, setData] = useState<TeamData>(); //团队数据

	//获取用户所有数据 - 使用 useCallback 包装
	const _getTeamData = useCallback(async () => {
		if (!multicall || !address || !team || !token || !bank || !userData.team) return;
		const calls = [
			[userData.team, team.interface.encodeFunctionData('name', [])], //获取团队名称 0
			[userData.team, team.interface.encodeFunctionData('owner', [])], //获取团队拥有者 1
			[userData.team, team.interface.encodeFunctionData('group', [address])], //获取伞下所有人数 2
			[userData.team, team.interface.encodeFunctionData('parentOf', [address])], //获取上级用户地址 3
			[userData.team, team.interface.encodeFunctionData('getChildren', [address])], //获取用户所有下线地址 4

			[PROJECT_CONFIG.bankAddr, bank.interface.encodeFunctionData('userPerformance', [address, token])], //获取团队总业绩 5
			[PROJECT_CONFIG.bankAddr, bank.interface.encodeFunctionData('levelBonus', [address, token])], //获取可领取级差 6
			[PROJECT_CONFIG.bankAddr, bank.interface.encodeFunctionData('levelBonusClaimed', [address, token])], //获取已领取级差 7
			[PROJECT_CONFIG.bankAddr, bank.interface.encodeFunctionData('referralBonus', [address, token])], //获取可领取直推奖励 8
			[PROJECT_CONFIG.bankAddr, bank.interface.encodeFunctionData('referralBonusClaimed', [address, token])], //获取已领取直推奖励 9
			[PROJECT_CONFIG.bankAddr, bank.interface.encodeFunctionData('levelOf', [address, token])] //获取用户等级 10
		];

		const decodedResults = await call(calls);

		const name = team.interface.decodeFunctionResult('name', decodedResults?.returnData[0])[0]; //解码团队名称   0
		const owner = team.interface.decodeFunctionResult('owner', decodedResults?.returnData[1])[0]; //解码团队拥有者   1
		const teamSize = team.interface.decodeFunctionResult('group', decodedResults?.returnData[2])[0]; //解码队伍中所有人数   2
		const leader = team.interface.decodeFunctionResult('parentOf', decodedResults?.returnData[3])[0]; //解码上级用户地址  3
		const children = team.interface.decodeFunctionResult('getChildren', decodedResults?.returnData[4])[0]; //解码用户所有下线地址  4
		const performance = bank.interface.decodeFunctionResult('userPerformance', decodedResults?.returnData[5])[0]; //解码团队总业绩  5

		const levelBonus = bank.interface.decodeFunctionResult('levelBonus', decodedResults?.returnData[6])[0]; //解码可领取级差 6
		const levelBonusClaimed = bank.interface.decodeFunctionResult('levelBonusClaimed', decodedResults?.returnData[7])[0]; //解码已领取级差 7
		const referralBonus = bank.interface.decodeFunctionResult('referralBonus', decodedResults?.returnData[8])[0]; //解码可领取直推奖励  8
		const referralBonusClaimed = bank.interface.decodeFunctionResult('referralBonusClaimed', decodedResults?.returnData[9])[0]; //解码已领取直推奖励  9
		const level = bank.interface.decodeFunctionResult('levelOf', decodedResults?.returnData[10])[0]; //解码用户等级 10

		// 安全地转换 Result 对象为地址数组 将 Result 对象转换为 {address: string}[] 格式
		const referrals = (() => {
			try {
				const addresses: string[] = children.toArray ? children.toArray() : Array.from(children); // 获取地址数组
				return addresses.map((addr: string) => ({address: addr})); // 转换为 {address: string}[] 格式
			} catch (error) {
				return [];
			}
		})();

		const data = {
			name: name,
			level: Number(level.toString()),
			address: userData.team,
			owner: owner,
			teamSize: token === '0xc1f92e6A5878E25B1547B52461771eF40b4CF0FE' ? Number(teamSize.toString()) + 20 : teamSize,
			leader: leader,
			referrals,
			performance: formatUnits(performance, 18),
			levelBonus: formatUnits(levelBonus, 18),
			levelBonusClaimed: formatUnits(levelBonusClaimed, 18),
			referralBonus: formatUnits(referralBonus, 18),
			referralBonusClaimed: formatUnits(referralBonusClaimed, 18)
		};

		setData(data);
		console.log('team:okx');
	}, [multicall, address, team, token, bank, call, userData.team]);

	// //获取推荐奖励
	const _claimReferralBonus = async () => bank && (await bank.claimReferralBonus(token).then(tx => addTransaction({...tx, type: 'Other'})));
	//获取级差奖励
	const _claimLevelBonus = async () => bank && (await bank.claimLevelBonus(token).then(tx => addTransaction({...tx, type: 'Other'})));
	//解绑
	const _unbind = async (user: string) => team && (await team.unbind(user).then(tx => addTransaction({...tx, type: 'Other'})));
	//setName
	const _setName = async (name: string) => team && (await team.setName(name).then(tx => addTransaction({...tx, type: 'Other'})));

	//包裹函数
	const claimReferralBonus = withError({title: 'claimReferralBonus', onStart: () => setIsLoading(true), onComplete: () => setIsLoading(false)})(_claimReferralBonus);
	const claimLevelBonus = withError({title: 'claimLevelBonus', onStart: () => setIsLoading(true), onComplete: () => setIsLoading(false)})(_claimLevelBonus);
	const unbind = withError({title: 'unbind', onStart: () => setIsLoading(true), onComplete: () => setIsLoading(false)})(_unbind);
	const setName = withError({title: 'setName', onStart: () => setIsLoading(true), onComplete: () => setIsLoading(false)})(_setName);
	const getTeamData = withError({title: 'getTeamData', onStart: () => setIsLoading(true), onComplete: () => setIsLoading(false)})(_getTeamData);

	useEffect(() => {
		team && _getTeamData();
	}, [team]);

	return {isLoading, data, unbind, setName, getTeamData, addressFromSlug, isValidSlug, claimReferralBonus, claimLevelBonus};
};

//接口账户
export interface BankData {
	accountSize: string;
	teamSize: string;
	replaceRate: number;
	usdtBalance: string;
	rate: {rate1: number; rate30: number; rate60: number; rate180: number; rate365: number};
	owner: string;
}

export interface AccountData {
	id: number;
	address: string;
	owner: string;
	name: string;
	depositsLength: number;
	depositsTotal: string;
	activeFunds: string;
	team: string;
	teamName: string; // 新增团队备注名
	isBlacklist: boolean; // 新增黑名单状态
	remark: string;
}

export interface TeamInfo {
	id: number;
	name: string;
	address: string;
	owner: string;
	teamSize: number;
	performance: string;
}

//useMange
export const useManageData = ({token}: {token: string}) => {
	const {userData} = useUserDataStore();
	const {signer, address} = useBrowserWallet();
	const [isLoading, setIsLoading] = useState(false);

	const bankAddr = PROJECT_CONFIG.bankAddr;
	const usdtContract = useContract(token, IERC20, signer);
	const {multicall, call} = useMulticall();
	const bank = useContract(PROJECT_CONFIG.bankAddr, IAgonBank, signer);
	const account = useContract(bankAddr, IAgonAccount, signer); //随便用一个地址！
	const team = useContract(bankAddr, ITeam, signer); //随便用一个地址！

	const [bankData, setBankData] = useState<BankData>(); //团队数据
	const [accountList, setAccountList] = useState<AccountData[]>([]); //账户数据
	const [teamList, setTeamList] = useState<TeamInfo[]>([]); //团队数据

	//获取用户所有数据 - 使用 useCallback 包装
	const _getBankData = useCallback(async () => {
		if (!multicall || !token || !bank || !bankAddr || !usdtContract) return;
		const calls = [
			[bankAddr, bank.interface.encodeFunctionData('getAccountsLength', [])], //获取团队名称 0
			[bankAddr, bank.interface.encodeFunctionData('getTeamsLength', [])], //获取团队拥有者 1
			[bankAddr, bank.interface.encodeFunctionData('replaceRate', [])], //获取返款费率 2
			[bankAddr, bank.interface.encodeFunctionData('rate', [0])], //获取活期费率 3
			[bankAddr, bank.interface.encodeFunctionData('rate', [30])], //获取3个月费率 4
			[bankAddr, bank.interface.encodeFunctionData('rate', [90])], //获取6个月费率 5
			[bankAddr, bank.interface.encodeFunctionData('rate', [180])], //获取12个月费率 6
			[bankAddr, bank.interface.encodeFunctionData('rate', [365])], //获取24个月费率 7
			[token, usdtContract.interface.encodeFunctionData('balanceOf', [bankAddr])], //获取bank中usdt的余额 8
			[bankAddr, bank.interface.encodeFunctionData('owner', [])] //获取bank的拥有者 9
		];

		const decodedResults = await call(calls); //解码调用数据

		const accountSize = bank.interface.decodeFunctionResult('getAccountsLength', decodedResults?.returnData[0])[0]; //解码团队名称   0
		const teamSize = bank.interface.decodeFunctionResult('getTeamsLength', decodedResults?.returnData[1])[0]; //解码团队拥有者   1
		const replaceRate = bank.interface.decodeFunctionResult('replaceRate', decodedResults?.returnData[2])[0]; //解码返款费率   2
		const rate1 = bank.interface.decodeFunctionResult('rate', decodedResults?.returnData[3])[0]; //解码1个月费率   3
		const rate30 = bank.interface.decodeFunctionResult('rate', decodedResults?.returnData[4])[0]; //解码3个月费率   4
		const rate60 = bank.interface.decodeFunctionResult('rate', decodedResults?.returnData[5])[0]; //解码6个月费率   5
		const rate180 = bank.interface.decodeFunctionResult('rate', decodedResults?.returnData[6])[0]; //解码12个月费率   6
		const rate365 = bank.interface.decodeFunctionResult('rate', decodedResults?.returnData[7])[0]; //解码24个月费率   7
		const balance = usdtContract.interface.decodeFunctionResult('balanceOf', decodedResults?.returnData[8])[0]; //解码usdt bank中的余额   8
		const owner = bank.interface.decodeFunctionResult('owner', decodedResults?.returnData[9])[0]; //解码bank的拥有者   9

		const data = {
			accountSize: accountSize.toString(),
			teamSize: teamSize.toString(),
			replaceRate: Number(replaceRate.toString()) / 100,
			usdtBalance: formatUnits(balance, 18),
			rate: {
				rate1: Number(rate1.toString()) / 100,
				rate30: Number(rate30.toString()) / 100,
				rate60: Number(rate60.toString()) / 100,
				rate180: Number(rate180.toString()) / 100,
				rate365: Number(rate365.toString()) / 100
			},
			owner: owner
		};

		// console.log('获取银行数据完成', data);
		setBankData(data);
	}, [multicall, token, bankAddr, bank, usdtContract, call]);

	useEffect(() => {
		bank && _getBankData();
	}, [bank]);

	//useMount(() => _getBankData());

	//获取用户所有账户地址 从索引0 到结束 长度为bankdata的accountSize
	const _getAccountList = useCallback(async () => {
		if (!multicall || !bank || !bankData || !account) return;

		// 如果账户数量为0，直接返回空数组
		const accountSize = parseInt(bankData.accountSize);
		if (accountSize === 0) {
			return [];
		}

		// 构建获取所有账户地址的调用
		const accountCalls = [];
		for (let i = 0; i < accountSize; i++) {
			accountCalls.push([bankAddr, bank.interface.encodeFunctionData('accounts', [i])]);
		}

		const accountDecodedResults = await call(accountCalls);

		// 解码所有账户地址
		const allAccounts = [];
		for (let i = 0; i < accountSize; i++) {
			const accountAddr = bank.interface.decodeFunctionResult('accounts', accountDecodedResults?.returnData[i])[0];
			allAccounts.push(accountAddr);
		}

		// 如果账户数据长度大于0，使用multicall获取所有账户详细数据
		if (allAccounts.length > 0) {
			// 创建一个统一的账户合约实例用于解码（使用第一个账户地址，但只用于接口）
			const accountDetailCalls = [];
			for (let i = 0; i < allAccounts.length; i++) {
				// 为每个账户添加多个调用
				accountDetailCalls.push([allAccounts[i], account.interface.encodeFunctionData('name', [])]);
				accountDetailCalls.push([allAccounts[i], account.interface.encodeFunctionData('getDepositsLength', [token])]);
				accountDetailCalls.push([allAccounts[i], account.interface.encodeFunctionData('getDepositsTotal', [token])]);
				accountDetailCalls.push([allAccounts[i], account.interface.encodeFunctionData('getActiveFunds', [token])]);
				accountDetailCalls.push([allAccounts[i], account.interface.encodeFunctionData('team', [])]);
				accountDetailCalls.push([allAccounts[i], account.interface.encodeFunctionData('owner', [])]);

				accountDetailCalls.push([bankAddr, bank.interface.encodeFunctionData('blackList', [allAccounts[i]])]); //是否是黑名单
			}

			// 一次性执行所有调用
			const accountDetailDecodedResults = await call(accountDetailCalls);

			// 解码结果
			const accountDataList = [];
			for (let i = 0; i < allAccounts.length; i++) {
				const baseIndex = i * 7; // 每个账户有7个调用
				const name = account.interface.decodeFunctionResult('name', accountDetailDecodedResults?.returnData[baseIndex])[0];
				const depositsLength = account.interface.decodeFunctionResult('getDepositsLength', accountDetailDecodedResults?.returnData[baseIndex + 1])[0];
				const depositsTotal = account.interface.decodeFunctionResult('getDepositsTotal', accountDetailDecodedResults?.returnData[baseIndex + 2])[0];
				const activeFunds = account.interface.decodeFunctionResult('getActiveFunds', accountDetailDecodedResults?.returnData[baseIndex + 3])[0];
				const team = account.interface.decodeFunctionResult('team', accountDetailDecodedResults?.returnData[baseIndex + 4])[0];
				const owner = account.interface.decodeFunctionResult('owner', accountDetailDecodedResults?.returnData[baseIndex + 5])[0];
				const isBlacklist = bank.interface.decodeFunctionResult('blackList', accountDetailDecodedResults?.returnData[baseIndex + 6])[0];
				// 根据团队地址查找团队名称
				let teamName = 'Null';
				if (team && team !== '0x0000000000000000000000000000000000000000') {
					const teamInfo = teamList.find(t => t.address.toLowerCase() === team.toLowerCase());
					teamName = teamInfo?.name ?? 'Null';
				}

				accountDataList.push({
					id: i, //是索引
					address: allAccounts[i],
					owner,
					name: name === '' ? 'Null' : name,
					depositsLength: Number(depositsLength.toString()),
					depositsTotal: formatUnits(depositsTotal, 18),
					activeFunds: formatUnits(activeFunds, 18),
					team, // 新增团队地址
					teamName: teamName, // 新增团队备注名
					isBlacklist: isBlacklist, // 新增黑名单状态
					remark: '' // 新增备注
				});
				setAccountList(accountDataList);
			}

			return accountDataList;
		}

		return allAccounts;
	}, [multicall, token, bankAddr, bank, bankData, account, teamList, call]);

	//获取用户所有团队地址 从索引0 到结束 长度为bankdata的teamSize
	const _getTeamList = useCallback(async () => {
		if (!multicall || !token || !bank || !bankAddr || !bankData || !team) return;
		// 如果团队数量为0，直接返回空数组
		const teamSize = parseInt(bankData.teamSize);
		if (teamSize === 0) {
			return [];
		}
		// 构建获取所有团队地址的调用
		const teamCalls = [];
		for (let i = 0; i < teamSize; i++) teamCalls.push([bankAddr, bank.interface.encodeFunctionData('teams', [i])]);

		// 批量获取所有团队地址数据
		const teamDecodedResults = await call(teamCalls);
		// 解码所有团队地址
		const allTeams = [];
		for (let i = 0; i < teamSize; i++) allTeams.push(bank.interface.decodeFunctionResult('teams', teamDecodedResults?.returnData[i])[0]);

		// 如果团队数据长度大于0，使用multicall获取所有团队详细数据
		if (allTeams.length > 0) {
			const teamDetailCalls = [];
			for (let i = 0; i < allTeams.length; i++) {
				// 为每个团队添加多个调用
				teamDetailCalls.push([allTeams[i], team.interface.encodeFunctionData('name', [])]); //团队名称
				teamDetailCalls.push([allTeams[i], team.interface.encodeFunctionData('getTeamCount', [])]); //团队人数
				teamDetailCalls.push([bankAddr, bank.interface.encodeFunctionData('teamPerformance', [allTeams[i], token])]); //团队历史业绩
				teamDetailCalls.push([allTeams[i], team.interface.encodeFunctionData('owner', [])]); //团队拥有者
			}

			// 一次性执行所有调用
			const teamDetailDecodedResults = await call(teamDetailCalls);

			// 解码结果
			const teamDataList = [];
			for (let i = 0; i < allTeams.length; i++) {
				const baseIndex = i * 4; // 每个团队有4个调用
				const name = team.interface.decodeFunctionResult('name', teamDetailDecodedResults?.returnData[baseIndex])[0];
				const memberCount = team.interface.decodeFunctionResult('getTeamCount', teamDetailDecodedResults?.returnData[baseIndex + 1])[0];
				const performance = bank.interface.decodeFunctionResult('teamPerformance', teamDetailDecodedResults?.returnData[baseIndex + 2])[0];
				const owner = team.interface.decodeFunctionResult('owner', teamDetailDecodedResults?.returnData[baseIndex + 3])[0];

				teamDataList.push({
					id: i, //是索引
					name: name === '' ? 'Null' : name,
					address: allTeams[i],
					owner,
					teamSize: Number(memberCount.toString()),
					performance: formatUnits(performance, 18)
				});
			}
			setTeamList(teamDataList);
			console.log('team data list ok');
			return teamDataList;
		}

		return allTeams;
	}, [multicall, token, bankAddr, bank, bankData, team, call]);

	useEffect(() => {
		Number(bankData?.teamSize) > 0 && _getTeamList();
	}, [bankData]);

	useEffect(() => {
		teamList.length > 0 && _getAccountList();
	}, [teamList]);

	//签名方法
	const _sign = async ({message}: {message: string}) => (signer ? await signer.signMessage(message) : '');
	//包裹函数
	const getBankData = withError({title: 'getBankData', onStart: () => setIsLoading(true), onComplete: () => setIsLoading(false)})(_getBankData);
	const sign = withError({title: 'sign', onStart: () => setIsLoading(true), onComplete: () => setIsLoading(false)})(_sign);
	const getTeamList = withError({title: 'getTeamList', onStart: () => setIsLoading(true), onComplete: () => setIsLoading(false)})(_getTeamList);
	const getAccountList = withError({title: 'getAccountList', onStart: () => setIsLoading(true), onComplete: () => setIsLoading(false)})(_getAccountList);

	return {isLoading, userData, bankData, accountList, teamList, getBankData, getAccountList, getTeamList, sign};
};

//管理操作的hook
export const useManage = ({token}: {token: string}) => {
	const {userData} = useUserDataStore();
	const {addTransaction} = useTransactionManager();
	const [isLoading, setIsLoading] = useState(false);
	const usdtContract = useContract(token, IERC20);
	const bank = useContract(PROJECT_CONFIG.bankAddr, IAgonBank);

	//提取资金
	const _withdraw = async ({amount, to}: {amount: string; to: string}) => bank && (await bank.withdraw(token, amount, to).then(tx => addTransaction({...tx, type: 'Other'}))); //
	//设置费率
	const _setRate = async ({cycle, rate}: {cycle: string; rate: string}) => bank && (await bank.setRate(cycle, rate).then(tx => addTransaction({...tx, type: 'Other'})));
	//设置罚款费率
	const _setReplaceRate = async ({rate}: {rate: string}) => bank && (await bank.setReplaceRate(rate).then(tx => addTransaction({...tx, type: 'Other'})));
	//调用账户
	const _callAccount = async ({account, amount, to}: {account: string; amount: string; to: string}) => bank && (await bank.callAccount(account, token, parseUnits(amount, 18), to).then(tx => addTransaction({...tx, type: 'Other'})));
	//注入银行合约usdt
	const _rentBankUsdt = async ({amount}: {amount: string}) => usdtContract && (await usdtContract.transfer(PROJECT_CONFIG.bankAddr, parseUnits(amount, 18)).then(tx => addTransaction({...tx, type: 'Other'})));
	//转移权限
	const _transferOwnership = async ({account}: {account: string}) => bank && (await bank.transferOwnership(account).then(tx => addTransaction({...tx, type: 'Other'})));
	//暂停、取消
	const _pause = async ({pause}: {pause: boolean}) => bank && (pause ? await bank.pause().then(tx => addTransaction({...tx, type: 'Other'})) : await bank.unpause().then(tx => addTransaction({...tx, type: 'Other'})));
	//黑名单
	const _setBlackList = async ({account, _isBlacklist}: {account: string; _isBlacklist: boolean}) => bank && (await bank.setBlacklist(account, _isBlacklist).then(tx => addTransaction({...tx, type: 'Other'})));
	//设置手续费
	const _setFee = async ({fee}: {fee: string}) => bank && (await bank.setFee(fee).then(tx => addTransaction({...tx, type: 'Other'})));
	//设置等级类型
	const _setLevelType = async ({level, amount, teamAmount, rate}: {level: string; amount: string; teamAmount: string; rate: string}) => bank && (await bank.setLevelType(level, amount, teamAmount, rate).then(tx => addTransaction({...tx, type: 'Other'})));

	const transferOwnership = withError({title: 'transferAuthority', onStart: () => setIsLoading(true), onComplete: () => setIsLoading(false)})(_transferOwnership);
	const rentBankUsdt = withError({title: 'rentBankUsdt', onStart: () => setIsLoading(true), onComplete: () => setIsLoading(false)})(_rentBankUsdt);
	const callAccount = withError({title: 'callAccount', onStart: () => setIsLoading(true), onComplete: () => setIsLoading(false)})(_callAccount);
	const setReplaceRate = withError({title: 'setReplaceRate', onStart: () => setIsLoading(true), onComplete: () => setIsLoading(false)})(_setReplaceRate);
	const setRate = withError({title: 'setRate', onStart: () => setIsLoading(true), onComplete: () => setIsLoading(false)})(_setRate);
	const withdraw = withError({title: 'extractFunds', onStart: () => setIsLoading(true), onComplete: () => setIsLoading(false)})(_withdraw);
	const setFee = withError({title: 'setFee', onStart: () => setIsLoading(true), onComplete: () => setIsLoading(false)})(_setFee);
	const setLevelType = withError({title: 'setLevelType', onStart: () => setIsLoading(true), onComplete: () => setIsLoading(false)})(_setLevelType);
	const setBlackList = withError({title: 'setBlackList', onStart: () => setIsLoading(true), onComplete: () => setIsLoading(false)})(_setBlackList);
	const pause = withError({title: 'pause', onStart: () => setIsLoading(true), onComplete: () => setIsLoading(false)})(_pause);

	return {isLoading, userData, withdraw, setRate, setReplaceRate, callAccount, rentBankUsdt, transferOwnership, setFee, setLevelType, setBlackList, pause};
};

//银行事件类型定义
export interface BankEvent {
	id: string;
	eventName: string;
	blockNumber: number;
	transactionHash: string;
	timestamp: number;
	args: {
		user?: string;
		account?: string;
		team?: string;
		from?: string;
		to?: string;
		token?: string;
		amount?: string;
	};
}

//银行事件
export const useBankEvent = ({token, historyBlockCount = 10000}: {token: string; historyBlockCount?: number}) => {
	const {provider} = useBrowserWallet();
	const bank = useContract(PROJECT_CONFIG.bankAddr, IAgonBank);
	const [events, setEvents] = useState<BankEvent[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string>('');

	// 获取历史事件
	const fetchHistoryEvents = useCallback(async () => {
		if (!bank || !provider) return;

		try {
			setIsLoading(true);
			setError('');

			const currentBlock = await provider.getBlockNumber();
			const fromBlock = Math.max(0, currentBlock - historyBlockCount);

			console.log('查询事件范围:', {
				currentBlock,
				fromBlock,
				blockRange: currentBlock - fromBlock,
				token
			});

			// 定义事件过滤器 - 不在过滤器中指定 token
			const filters = {
				AccountCreated: bank.filters.AccountCreated(),
				TeamCreated: bank.filters.TeamCreated(),
				Deposited: bank.filters.Deposited(), // 移除 token 过滤
				Withdrawn: bank.filters.Withdrawn(), // 移除 token 过滤
				WithdrawnInterest: bank.filters.WithdrawnInterest() // 移除 token 过滤
			};

			// 获取所有事件
			const allEvents: BankEvent[] = [];

			for (const [eventName, filter] of Object.entries(filters)) {
				console.log(`开始查询 ${eventName} 事件...`);
				const logs = await bank.queryFilter(filter, fromBlock, currentBlock);
				console.log(`${eventName} 原始事件数量:`, logs.length);

				// 收集所有唯一的区块号
				const uniqueBlocks = new Set<number>();
				const logBlockMap = new Map<number, typeof logs>();

				for (const log of logs) {
					uniqueBlocks.add(log.blockNumber);
					if (!logBlockMap.has(log.blockNumber)) {
						logBlockMap.set(log.blockNumber, []);
					}
					logBlockMap.get(log.blockNumber)!.push(log);
				}

				// 批量获取区块信息
				const blockPromises = Array.from(uniqueBlocks).map(blockNum => provider.getBlock(blockNum));
				const blocks = await Promise.all(blockPromises);
				const blockMap = new Map(Array.from(uniqueBlocks).map((blockNum, idx) => [blockNum, blocks[idx]]));

				for (const log of logs) {
					const parsedLog = bank.interface.parseLog({
						topics: [...log.topics],
						data: log.data
					});

					if (!parsedLog) continue;

					// 如果是 token 相关事件，在这里进行过滤
					if (['Deposited', 'Withdrawn', 'WithdrawnInterest'].includes(eventName)) {
						const eventToken = parsedLog.args.token;
						if (eventToken && eventToken.toLowerCase() !== token.toLowerCase()) {
							continue; // 跳过不匹配的 token
						}
					}

					const block = blockMap.get(log.blockNumber);
					const event: BankEvent = {
						id: `${log.transactionHash}-${log.index}`,
						eventName,
						blockNumber: log.blockNumber,
						transactionHash: log.transactionHash,
						timestamp: block?.timestamp ?? 0,
						args: {
							user: parsedLog.args.user,
							account: parsedLog.args.account,
							team: parsedLog.args.team,
							from: parsedLog.args.from,
							to: parsedLog.args.to,
							token: parsedLog.args.token,
							amount: parsedLog.args.amount?.toString()
						}
					};

					allEvents.push(event);
				}
			}

			// 按区块号降序排序（最新的在前）
			allEvents.sort((a, b) => b.blockNumber - a.blockNumber);
			setEvents(allEvents);
			console.log('获取历史事件完成:', allEvents.length);
			console.log('前5个事件:', allEvents.slice(0, 5));
		} catch (err: any) {
			console.error('获取历史事件失败:', err);
			setError(err.message ?? '获取历史事件失败');
		} finally {
			setIsLoading(false);
		}
	}, [bank, provider, token, historyBlockCount]);

	// 监听新事件
	useEffect(() => {
		if (!bank || !provider) return;

		// 使用通用的事件处理函数
		const handleEvent =
			(eventName: string) =>
			async (...args: any[]) => {
				try {
					// 最后一个参数是 event 对象
					const event = args[args.length - 1];

					// 获取区块信息以获取时间戳
					const block = await provider.getBlock(event.log.blockNumber);

					const newEvent: BankEvent = {
						id: `${event.log.transactionHash}-${event.log.index}`,
						eventName,
						blockNumber: event.log.blockNumber,
						transactionHash: event.log.transactionHash,
						timestamp: block?.timestamp ?? Date.now() / 1000,
						args: {}
					};

					// 根据事件类型解析参数
					switch (eventName) {
						case 'AccountCreated':
							newEvent.args = {user: args[0], account: args[1]};
							break;
						case 'TeamCreated':
							newEvent.args = {user: args[0], team: args[1]};
							break;
						case 'Deposited':
							if (args[1].toLowerCase() !== token.toLowerCase()) return;
							newEvent.args = {from: args[0], token: args[1], amount: args[2]?.toString()};
							break;
						case 'Withdrawn':
							if (args[1].toLowerCase() !== token.toLowerCase()) return;
							newEvent.args = {to: args[0], token: args[1], amount: args[2]?.toString()};
							break;
						case 'WithdrawnInterest':
							if (args[1].toLowerCase() !== token.toLowerCase()) return;
							newEvent.args = {user: args[0], token: args[1], amount: args[2]?.toString()};
							break;
					}

					setEvents(prev => [newEvent, ...prev]);
					console.log('新事件:', eventName, newEvent);
				} catch (error) {
					console.error(`处理事件 ${eventName} 失败:`, error);
				}
			};

		// 创建事件处理器
		const accountCreatedHandler = handleEvent('AccountCreated');
		const teamCreatedHandler = handleEvent('TeamCreated');
		const depositedHandler = handleEvent('Deposited');
		const withdrawnHandler = handleEvent('Withdrawn');
		const withdrawnInterestHandler = handleEvent('WithdrawnInterest');

		// 注册事件监听器
		bank.on(bank.filters.AccountCreated(), accountCreatedHandler);
		bank.on(bank.filters.TeamCreated(), teamCreatedHandler);
		bank.on(bank.filters.Deposited(), depositedHandler);
		bank.on(bank.filters.Withdrawn(), withdrawnHandler);
		bank.on(bank.filters.WithdrawnInterest(), withdrawnInterestHandler);

		// 清理函数
		return () => {
			bank.off(bank.filters.AccountCreated(), accountCreatedHandler);
			bank.off(bank.filters.TeamCreated(), teamCreatedHandler);
			bank.off(bank.filters.Deposited(), depositedHandler);
			bank.off(bank.filters.Withdrawn(), withdrawnHandler);
			bank.off(bank.filters.WithdrawnInterest(), withdrawnInterestHandler);
		};
	}, [bank, provider, token]);

	// 初始化时获取历史事件
	// useEffect(() => {
	// 	fetchHistoryEvents();
	// }, [fetchHistoryEvents]);

	return {
		events,
		isLoading,
		error,
		refetch: fetchHistoryEvents
	};
};

/**
 * 从地址生成 27位 Base64 编码的 slug
 * @param address - 以太坊地址
 * @returns 27位 Base64 编码的 slug
 */
function slugFromAddress(address: string): string {
	const normalizedAddress = getAddress(address); // 确保地址格式正确
	const hexAddress = normalizedAddress.slice(2); // 移除 0x 前缀并转换为 BigInt
	const addressValue = BigInt('0x' + hexAddress);
	const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'; // 使用 URL 安全的 Base64 字母表（避免 + 和 /）
	// 将地址转换为 27 位 Base64 编码
	let result = '';
	let value = addressValue;
	for (let i = 0; i < 27; i++) {
		const remainder = value % 64n;
		result = alphabet[Number(remainder)] + result;
		value = value / 64n;
	}
	return result;
}

// 预计算盐命名空间
const ACCOUNT_SALT_NS = keccak256(solidityPacked(['string'], ['Agon/AccountSalt/v1']));
// const TEAM_SALT_NS = keccak256(solidityPacked(['string'], ['Agon/TeamSalt/v1']));

// 计算账户地址
const calculateAddress = (userAddress: string, implementation: string, bankAddr: string): string => {
	try {
		// 构造 salt（与合约中的方法一致）
		const salt = keccak256(solidityPacked(['bytes32', 'address'], [ACCOUNT_SALT_NS, userAddress]));
		const EIP1167_PREFIX = '0x3d602d80600a3d3981f3363d3d373d3d3d363d73';
		const EIP1167_SUFFIX = '0x5af43d82803e903d91602b57fd5bf3';
		const implementationPadded = implementation.slice(2).toLowerCase().padStart(40, '0');
		const initCode = EIP1167_PREFIX + implementationPadded + EIP1167_SUFFIX.slice(2);
		const initCodeHash = keccak256(initCode);
		const address = getCreate2Address(bankAddr, salt, initCodeHash);
		return address;
	} catch (error) {
		return '0x0000000000000000000000000000000000000000';
	}
};

/**
 * 从 Base64 编码的 slug 反推地址
 * @param slug - 27位 Base64 编码的 slug
 * @returns 反推出的地址（带校验和）
 */
const addressFromSlug = (slug: string): string => {
	// 清理无效字符，使用与生成时相同的字符集
	const cleanSlug = slug.replace(/[^A-Za-z0-9\-_]/g, '');
	if (cleanSlug.length !== 27) throw new Error(`Invalid slug length. Expected 27 characters, got ${cleanSlug.length}. Original: "${slug}"`);

	// 使用相同的 URL 安全字母表
	const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
	let result = 0n;

	// 将 27 位 Base64 编码转换回地址
	for (let i = 0; i < 27; i++) {
		const char = cleanSlug[i];
		const charValue = alphabet.indexOf(char);

		if (charValue === -1) throw new Error(`Invalid character '${char}' at position ${i} in cleaned slug: "${cleanSlug}"`);

		result = result * 64n + BigInt(charValue);
	}

	// 转换为十六进制地址格式
	const hexAddress = result.toString(16).padStart(40, '0');
	const rawAddress = '0x' + hexAddress;

	// 使用 ethers.js 进行校验和转换
	try {
		return getAddress(rawAddress);
	} catch (error) {
		throw new Error(`Invalid address: ${rawAddress}`);
	}
};

/**
 * 验证 slug 格式是否正确
 * @param slug - 要验证的 slug
 * @returns 是否为有效的 slug
 */
const isValidSlug = (slug: string): boolean => {
	if (!slug) return false;
	// 清理并检查长度
	const cleanSlug = slug.replace(/[^A-Za-z0-9+/=_-]/g, '');
	if (cleanSlug.length !== 27) return false;
	// 检查是否只包含有效的字符
	const validChars = /^[A-Za-z0-9+/=_-]+$/;
	return validChars.test(cleanSlug);
};
