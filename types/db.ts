// 数据库相关类型定义
export interface AccountData {
	id: string; //id
	slug: string; //唯一码
	address: string; //address
	name: string; //名称
	level: number; //等级
	joinDate: string; //创建时间
	teamSize: number; //
	performance: number; //业绩
	team: string; //团队名称
	referrals?: AccountData[]; //下线人数
	deposits: Deposit[]; //存单数据
	depositTotal: number; //存单总额
	idoAmount: number; //白名单购买数额
	idoPerformance: number; //白名单推荐业绩
	invitationCode: string; //邀请码
}

export interface Deposit {
	id: string;
	address: string;
	amount: number;
	interestRate: number;
	interest: number;
	interestReceived: number;
	startTime: string; // ISO
	endTime: string; // ISO
	isEnabled: boolean;
	isWithdrawn: boolean;
	createdAt: string; // ISO
	is_extracting: boolean;
	is_buy: boolean;
	txid: string;
	cycle: number;
	currentInterest?: number; //当前空投
}
