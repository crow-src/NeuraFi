'use server';
import {sql} from '@vercel/postgres';

import {withCatch} from '../utils';

import {send, AxiosRequestConfig, getDatabaseCache, redis, checkCache, cacheData} from './utils';

// 获取airdrop所有数据
export const getAirdropList = withCatch(async () => {
	const userResult = await sql`SELECT * FROM airdrop_list;`;
	// 确保返回的数据结构与 AirdropItem 接口匹配
	const airdropItems: AirdropItem[] = userResult.rows as AirdropItem[];
	return {success: true, data: airdropItems};
});

// 获取单个空投项目
export const getAirdropItemBySlug = withCatch(async (slug: string) => {
	const userResult = await sql`SELECT * FROM airdrop_list WHERE slug = ${slug};`;
	return {success: true, data: userResult.rows[0] as AirdropItem};
});

// 添加单个空投项目
export const addAirdropItem = withCatch(async (airdropItem: AirdropItem) => {
	const userResult =
		await sql`INSERT INTO airdrop_list (agreement, title, name, decimals, total, amount, count, fee, start, "end", web, gitbook, github, twitter, telegram, discord, description, psbt, "private", progress, network, symbol) VALUES (${airdropItem.agreement}, ${airdropItem.title}, ${airdropItem.name}, ${airdropItem.decimals}, ${airdropItem.total}, ${airdropItem.amount}, ${airdropItem.count}, ${airdropItem.fee}, ${airdropItem.start}, ${airdropItem.end}, ${airdropItem.web}, ${airdropItem.gitbook}, ${airdropItem.github}, ${airdropItem.twitter}, ${airdropItem.telegram}, ${airdropItem.discord}, ${airdropItem.description}, ${airdropItem.psbt}, ${airdropItem.private}, ${airdropItem.progress}, ${airdropItem.network}, ${airdropItem.symbol});`;
	return {success: true, data: userResult.rows[0]};
});

// 领取空投 添加一个空投领取记录 将空投项目列表中的已领取数量received+1
export const addAirdropReceive = withCatch(async (id: string) => {
	const userResult = await sql`UPDATE airdrop_list SET received = received + 1 WHERE id = ${id};`;
	return {success: true, data: userResult.rows[0]};
});

// 获取所有token表的所有DEX数据
export const getDexList = withCatch(async () => {
	return getDatabaseCache('dex_list', () => sql`SELECT * FROM dexs;`);
});

export const getChartData = withCatch(async () => {
	return {success: true, data: []};
});

export const getTokenListByURL = withCatch(async (url: string) => {
	const cache = await checkCache(redis, 'url');
	if (!cache) {
		const req: AxiosRequestConfig = {method: 'GET', url: url};
		const response = await send(req); // 确保sendRequest返回的是期望的类型
		const data = typeof response === 'string' ? JSON.parse(response) : response; // 确保data是对象
		await cacheData(redis, url, JSON.stringify(data), 60000);
		return data; // 直接返回data对象
	} else {
		const parsedCache = typeof cache === 'string' ? JSON.parse(cache) : cache; // cache是一个字符串，需要反序列化
		return parsedCache; // 返回反序列化后的对象
	}
});

// 直接查询数据库获取数据
// 获取账户信息
export const getAccount = withCatch(async (address: string) => {
	const userResult = await sql`SELECT * FROM accounts_power WHERE address = ${address};`;
	return {success: true, data: userResult.rows[0]};
});

// 根据slug获取账户地址
export const getAccountBySlug = withCatch(async (slug: string) => {
	const userResult = await sql`SELECT * FROM accounts_power WHERE slug = ${slug};`;
	return {success: true, data: userResult.rows[0].address};
});

//
export const getSubCountBySlug = withCatch(async (slug: string) => {
	const query = `
        WITH RECURSIVE SubAccounts AS (
            SELECT id, parent, slug, address
            FROM accounts
            WHERE slug = $1
            UNION ALL
            SELECT a.id, a.parent, a.slug, a.address
            FROM accounts a
            INNER JOIN SubAccounts sa ON a.parent = sa.slug
        ),
        AirdropReceivers AS (
            SELECT address
            FROM airdrop_receive
            WHERE address IN (SELECT address FROM SubAccounts)
        )
        SELECT
            (SELECT COUNT(*) FROM SubAccounts) - 1 AS totalsubaccounts,
            (SELECT COUNT(*) FROM AirdropReceivers) AS airdropreceivedcount
    `;
	const result = await sql.query(query, [slug]);

	if (result.rows.length === 0) {
		return {success: true, data: {totalSubAccounts: 0, airdropReceivedCount: 0}};
	}

	const totalSubAccounts = result.rows[0].totalsubaccounts;
	const airdropReceivedCount = result.rows[0].airdropreceivedcount;
	return {
		success: true,
		data: {totalSubAccounts, airdropReceivedCount}
	};
});
