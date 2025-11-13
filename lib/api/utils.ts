import {Redis} from '@upstash/redis';
import axios, {AxiosRequestConfig} from 'axios';

// 通用发送请求函数
export async function send<T>(req: AxiosRequestConfig): Promise<Result<T>> {
	try {
		const response = await axios(req);
		return {success: true, data: response.data};
	} catch (error) {
		console.error('请求错误:', error);
		return {success: false, error: 'error'}; // 返回Result类型表示错误
	}
}

export type Result<T> = {success: true; data: T} | {success: false; error: string}; // 定义一个Result类型，用于返回结果
export type {AxiosRequestConfig}; // 导出AxiosRequestConfig类型

// Redis客户端实例  全局变量 获取缓存实例
let redisClient: Redis | null = null;

// 获取redis客户端
export function getRedisClient() {
	redisClient ??= new Redis({
		url: process.env.redisURL as string,
		token: process.env.redisToken as string
	});
	return redisClient;
}

export const redis = getRedisClient(); // 获取redis缓存客户端实例

// 通用的函数，用于获取缓存数据
export const getDatabaseCache = async (cacheKey: string, query: any) => {
	const cache = await checkCache(redis, cacheKey);

	if (!cache) {
		// 缓存不存在，查询数据库
		const result = await query(); // 执行查询
		await cacheData(redis, cacheKey, result.rows); // 将结果存入缓存，设置适当的过期时间现在是默认时间
		return {success: true, data: result.rows}; // 返回查询到的数据
	} else {
		return {success: true, data: cache}; // 缓存存在，返回缓存
	}
};

// 检查和获取缓存数据
export async function checkCache(redis: Redis, key: string): Promise<string | null> {
	try {
		const dataString = await redis.get(key);
		return dataString as string | null;
	} catch (error) {
		console.error('Error accessing Redis cache:', error);
		return null;
	}
}

// 缓存数据
export async function cacheData(redis: Redis, key: string, data: string, time?: number): Promise<void> {
	try {
		await redis.set(key, data, {ex: time ?? 3600}); // Cache data with an expiration time of 1 hour
	} catch (error) {
		console.error('Error saving data to Redis cache:', error);
	}
}
