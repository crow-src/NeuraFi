'use server';
// import { withCatch, } from '../utils';
import crypto from 'crypto';

import {send, AxiosRequestConfig, redis, checkCache, cacheData} from './utils';
import type {Result} from './utils';

const apiKeyMap: {[key: string]: string | undefined} = {
	BITCOIN_MAINNET: process.env.unisatBitcoinApiKey,
	BITCOIN_TESTNET: process.env.unisatBitcoinTestApiKey,
	BITCOIN_TESTNET4: process.env.unisatBitcoinTest4ApiKey,
	FRACTAL_BITCOIN_MAINNET: process.env.unisatFractalApiKey,
	FRACTAL_BITCOIN_TESTNET: process.env.unisatFractalTestApiKey, // unisatFractalTestApiKey
	default: process.env.unisatBitcoinApiKey // 默认比特币主网
};

// 创建Unisat请求配置的
function createRequestConfig(method: string, api: string, network: Chain): AxiosRequestConfig {
	const apiKey = apiKeyMap[network.enum] ?? apiKeyMap['default']; // 获取 apiKey

	console.log('后端查询的网络:', network.enum);
	return {
		method,
		url: `https://open-api${network.enum === 'FRACTAL_BITCOIN_MAINNET' || network.enum === 'FRACTAL_BITCOIN_TESTNET' ? '-fractal' : ''}${network.network === 'testnet' ? '-testnet' : ''}.unisat.io${api}`,
		headers: {
			accept: 'application/json',
			Authorization: `Bearer ${apiKey}` // 添加Authorization头 测试
			// application/json; charset=utf-8
		}
	};
}

// 综合代理unisat api
export async function proxyUnisatApi(network: Chain, request: AxiosRequestConfig) {
	// 构建完整的请求路径
	const req: AxiosRequestConfig = createRequestConfig(request.method ?? 'GET', request.url ?? '', network); // 构建请求配置  其实直接传递request就可以
	// 仅在 POST 请求时将 data 赋值给请求体
	if (request.method === 'POST' && request.data) req.data = request.data; // POST 请求使用 data
	// 直接使用 send 函数
	const result = await send<any>(req);
	return result;
}

// 综合代理unisat api 调用缓存
export async function proxyUnisatApiCache(network: Chain, api: AxiosRequestConfig) {
	const cache = await checkCache(redis, `${network.name}/${api.url}`);
	if (!cache) {
		// 没有缓存
		const result = await proxyUnisatApi(network, {method: 'GET', url: api.url});
		// 如果请求成功 则缓存数据
		if (result.success) {
			const dataString = JSON.stringify(result.data); // 成功时缓存数据
			await cacheData(redis, `${network.enum}/${api?.url}`, dataString);
		}
		return result; // 直接返回 send 函数的返回值
	} else {
		return {success: true, data: cache}; // 如果找到缓存，直接返回缓存结果
	}
}

/** ------------------------------------------------------------------------------------------------@@ okx @@--------------------------------------------------------------------------------------------------------- */

// okx签名
function signOkx(message: string): string {
	const secretKey = process.env.secretKey as string;
	const hmac = crypto.createHmac('sha256', secretKey);
	hmac.update(message);
	return hmac.digest('base64');
}

// okx构建请求头，现在这个函数需要额外的apiUrl参数来生成签名
function buildOkxHeaders(api: string, method: string): Record<string, string> {
	const timestamp = new Date().toISOString();
	const preHashString = `${timestamp}${method}${api}`; // 时间戳+请求方法+请求路径
	const signature = signOkx(preHashString); // 直接调用签名函数，不需要传递密钥

	return {
		'OK-ACCESS-KEY': process.env.apiKey as string,
		'OK-ACCESS-SIGN': signature,
		'OK-ACCESS-TIMESTAMP': timestamp,
		'OK-ACCESS-PASSPHRASE': process.env.passphrase as string,
		'Content-Type': 'application/json',
		// 条件地添加其他头部字段
		...(process.env.project && {'OK-ACCESS-PROJECT': process.env.project})
	};
}

/** ------------------------------------------------------------------------------------------------@@ 方 法 @@--------------------------------------------------------------------------------------------------------- */

// 获取市场合集列表 没有必要传入key
export async function getMarketData(network: Chain): Promise<Result<any>> {
	if (!network) {
		return {success: false, error: 'Unsupported chain'};
	} // 如果没有找到网络，返回错误
	const marketApiUrl = `${network.market}?chain=${network.key}`;

	const cache = await checkCache(redis, marketApiUrl);
	if (!cache) {
		const headers = buildOkxHeaders(marketApiUrl, 'GET');
		const req: AxiosRequestConfig = {method: 'GET', url: 'https://www.okx.com' + marketApiUrl, headers};
		const result = await send<any>(req); // 直接使用 send 函数
		if (result.success) {
			const dataString = JSON.stringify(result.data); // 成功时缓存数据
			await cacheData(redis, marketApiUrl, dataString);
		}
		return result; // 直接返回 send 函数的返回值
	} else {
		return {success: true, data: cache}; // 如果找到缓存，直接返回缓存结果
	}
}

// 综合代理okx api
export async function proxyOkxApi(request: AxiosRequestConfig) {
	console.log('代理okx api请求:', request);
	const fullUrl = 'https://www.okx.com' + request.url + (request.method === 'GET' && request.params ? request.params : ''); // 构建完整的请求路径
	const preHashString = `${request.url}${request.method === 'POST' ? JSON.stringify(request.data) : request.params}`; // 构建签名的请求路径
	const headers = buildOkxHeaders(preHashString, request.method ?? 'GET'); // 构建请求头
	const axiosReqConfig: AxiosRequestConfig = {
		method: request.method,
		url: fullUrl,
		headers,
		...(request.method === 'POST' && {data: request.data})
	};

	return await send(axiosReqConfig);
}
