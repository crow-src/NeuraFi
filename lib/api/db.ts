'use server';
import {sql} from '@vercel/postgres';
import {withCatch, norm, toIso, fromMs} from '../utils';

// ===== Types =====
export interface UserData {
	id: string; //id
	slug: string; //唯一码
	address: string; //address
	name: string; //名称
	level: number; //等级
	joinDate: string; //创建时间
	team?: string; //团队名称
	teamSize: number; //
	performance: number; //业绩
	referrals?: UserData[]; //下线人数
	deposits?: Deposit[]; //存单数据
	depositTotal?: number; //存单总额
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

const mapAccountRow = (row: any): UserData => ({
	id: row.id,
	slug: row.slug ?? '',
	address: row.address ?? '',
	name: row.name ?? '',
	level: Number(row.level ?? 0),
	joinDate: toIso(row.join_date),
	team: row.team ?? undefined,
	teamSize: Number(row.team_size),
	performance: Number(row.performance),
	referrals: [],
	deposits: [],
	depositTotal: Number(row.deposit_total),
	idoAmount: Number(row.ido_amount),
	idoPerformance: Number(row.ido_performance),
	invitationCode: row.Invitation_code ?? ''
});

// ===== 1) 创建账户 =====
// 若未找到推荐人，尝试使用 nil-uuid 这条“默认账户”作为 leader；不存在则报错（避免触发器拒绝 NULL）
export const createAccount = withCatch(async (params: {address: string; leaderSlugOrAddress: string}) => {
	const {address, leaderSlugOrAddress} = params;
	// 使用单个查询获取推荐人ID或默认根账户ID
	const leaderResult = await sql /*sql*/ `
		WITH leader_search AS (
			SELECT id FROM mx_account
			WHERE slug = ${leaderSlugOrAddress}
			   OR address = ${leaderSlugOrAddress}
			   OR id::text = ${leaderSlugOrAddress}
			LIMIT 1
		),
		fallback_search AS (
			SELECT id FROM mx_account
			WHERE id = '00000000-0000-0000-0000-000000000000'::uuid
			LIMIT 1
		)
		SELECT COALESCE(
			(SELECT id FROM leader_search),
			(SELECT id FROM fallback_search)
		) as leader_id;
	`;

	const leaderId = leaderResult.rows[0]?.leader_id;
	if (!leaderId) {
		throw new Error('Leader not found: please provide a valid leader or create the default root (nil-uuid) account first.');
	}

	// 插入/更新账户
	const res = await sql /*sql*/ `
    INSERT INTO mx_account (address, leader_id)
    VALUES (${address}, ${leaderId})
    ON CONFLICT (address) DO UPDATE SET
        last_operation_time = now()
    RETURNING *;
`;
	return {success: true, data: mapAccountRow(res.rows[0])};
});

// ===== 3) 获取用户数据 =====
export const getUserData = withCatch(async (params: {address?: string; slug?: string}) => {
	const {address, slug} = params;
	if (!address && !slug) throw new Error('address or slug is required');
	const q = address ? sql /*sql*/ `SELECT a.* FROM mx_account a WHERE a.address = ${address} LIMIT 1;` : sql /*sql*/ `SELECT a.* FROM mx_account a WHERE a.slug = ${slug} LIMIT 1;`;
	const r = await q;
	return {success: true, data: r.rows[0] ? mapAccountRow(r.rows[0]) : null};
});

// ===== 6) 获取直接下线列表=====
export const getDirectReferralsByAddress = withCatch(async (address: string) => {
	if (!address) throw new Error('address is required');

	const acc = await sql`SELECT id FROM mx_account WHERE address = ${address} LIMIT 1;`;
	if (acc.rows.length === 0) return {success: true, data: []};
	const parentId = acc.rows[0].id;

	const res = await sql /*sql*/ `
    SELECT 
      a2.*,
      COALESCE(SUM(CASE WHEN d.is_enabled = TRUE AND d.is_withdrawn = FALSE THEN d.amount ELSE 0 END), 0) AS active_deposits_total,
      COALESCE(SUM(d.amount), 0) AS deposits_total
    FROM mx_account a2
    LEFT JOIN mx_deposit d ON d.account_id = a2.id
    WHERE a2.leader_id = ${parentId}
    GROUP BY a2.id
    ORDER BY a2.join_date DESC;
  `;
	return {success: true, data: res.rows};
});

//添加购买的白名单数额 先查询是否有账户 如果没有账户直接创建一个账户然后添加
export const addIDOAmount = withCatch(async (address: string, amount: number, level: number) => {
	if (!address) {
		throw new Error('address is required');
	}
	if (amount <= 0) {
		throw new Error('amount must be greater than zero');
	}

	const existing = await sql`SELECT address, ido_amount FROM neurafi_account WHERE address = ${address} LIMIT 1;`;

	if (existing.rows.length === 0) {
		const insertResult = await sql`
			INSERT INTO neurafi_account (address, ido_amount)
			VALUES (${address}, ${amount})
			RETURNING *;
		`;
		return {success: true, data: insertResult.rows[0]};
	}

	const updateResult = await sql`
		UPDATE neurafi_account
		SET ido_amount = ido_amount + ${amount}
		WHERE address = ${address}
		RETURNING *;
	`;

	return {success: true, data: updateResult.rows[0]};
});

//通过slug获取用户数据
export const getUserDataBySlug = withCatch(async (slug: string) => {
	const userResult = await sql`SELECT * FROM neurafi_account WHERE slug = ${slug};`;
	return {success: true, data: userResult.rows[0]};
});

//通过邀请码（slug或invitation_code）查询用户是否存在
// invitation_code 是文本字段，进行精确匹配
export const getUserByInvitationCode = withCatch(async (code: string) => {
	const userResult = await sql`
		SELECT * FROM neurafi_account 
		WHERE slug = ${code}::text OR invitation_code = ${code}::text
		LIMIT 1;
	`;
	return {success: true, data: userResult.rows[0] || null};
});
