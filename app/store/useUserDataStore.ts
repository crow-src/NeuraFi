'use client';

import {create} from 'zustand';

export interface UserData {
	name: string; //id
	ethBalance: string; //eth余额
	usdtBalance: string; //usdt余额
	activeFunds: string; //活动资金总额
	tokens: string[]; //参与的代币
	slug: string; //唯一码
	address: string; //用户地址
	account: string; //账户地址
	equity: number; //净值
	positionPnl: number; //盈亏
	available: number; //可用资金
	riskRatio: number; //风险比例
	team?: string; //团队
	performance?: number; //绩效
	deposits?: DepositRecord[]; //所有存单
	interests: string; //usdt的收益
	//airdropCount: number; //airdropCount
	//teamSize?: number; //
	//leader?: UserData; //上线
	//referrals?: UserData[]; //推荐的下线数组
}

export interface DepositRecord {
	id: string; //id
	amount: number; //金额
	token: string; //代币
	apy: number; //收益率
	leader: string; //使用者
	rate: number; //利率
	interest: string; //已获取的利息
	lastInterestTime: number; //上次获取利息时间
	borrowInterest: number; //配资利息
	startTime: number; //时间戳
	endTime: number; //结束时间
	cycle: number; //期限
	isLiquidityEnabled: boolean;
	isCompleted: boolean;
	isExtracted: boolean; //已提取
	earnings: number; //收益
}

interface UserDataStore {
	userData: UserData;
	isLoading: boolean;
	// 灵活更新方法
	updateUserData: (updates: Partial<UserData>) => void;
}

export const useUserDataStore = create<UserDataStore>(set => ({
	userData: {
		name: 'None',
		slug: '',
		address: '',
		account: '',
		ethBalance: '0',
		usdtBalance: '0',
		activeFunds: '0',
		tokens: [],
		equity: 0,
		positionPnl: 0,
		available: 0,
		riskRatio: 0,
		airdropCount: 0,
		team: '',
		//teamSize: 0,
		performance: 0,
		deposits: [],
		interests: '0'
	},
	isLoading: false,
	// 灵活更新方法 - 只更新传入的字段，其他字段保持原值
	updateUserData: updates =>
		set(state => {
			const newUserData = {...state.userData, ...updates};
			//console.log('更新后的 userData:', newUserData);
			return {
				userData: newUserData
			};
		})
}));
