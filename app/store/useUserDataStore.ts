'use client';

import {create} from 'zustand';
import type {AccountData} from '@/types/db';

//组合AccountData 接口增加相应
export interface UserData extends AccountData {
	ethBalance: string;
	usdtBalance: string;
}

interface UserDataStore {
	userData: UserData;
	isLoading: boolean;
	updateUserData: (updates: Partial<UserData>) => void; // 灵活更新方法
}

export const useUserDataStore = create<UserDataStore>(set => ({
	userData: {
		id: '',
		name: '',
		slug: '',
		address: '',
		level: 0,
		joinDate: '',
		depositTotal: 0,
		idoAmount: 0,
		idoPerformance: 0,
		invitationCode: '',
		ethBalance: '0',
		usdtBalance: '0',
		team: '',
		teamSize: 0,
		performance: 0,
		deposits: [],
		referrals: []
	},
	isLoading: false,
	// 灵活更新方法 - 只更新传入的字段，其他字段保持原值
	updateUserData: updates =>
		set(state => {
			const newUserData = {...state.userData, ...updates};
			return {userData: newUserData};
		})
}));
