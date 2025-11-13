'use server';
import {send, AxiosRequestConfig, redis, checkCache, cacheData} from './utils';

// 查询货币价格     改改改!!!
export async function getCryptoPrice(): Promise<{[key: string]: {[currency: string]: number}}> {
	const cache = await checkCache(redis, 'crypto_price');
	if (!cache) {
		const req: AxiosRequestConfig = {
			method: 'GET',
			url: `https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,SOL,OKT,BNB,AVAX,ARB,MATIC,OP,LINEA,BASE,ARB&tsyms=USD,EUR,&api_key=${process.env.cryptoPrice}`
		};
		const response = await send(req); // 确保sendRequest返回的是期望的类型
		const data = typeof response === 'string' ? JSON.parse(response) : response; // 确保data是对象
		await cacheData(redis, 'crypto_price', JSON.stringify(data), 600);
		// console.log('获取到的货币价格:', data);
		return data; // 直接返回data对象
	} else {
		const parsedCache = typeof cache === 'string' ? JSON.parse(cache) : cache; // cache是一个字符串，需要反序列化
		return parsedCache; // 返回反序列化后的对象
	}
}

// 获取机器人验证信息
export async function getCaptcha(token: string) {
	// console.log('调用了查询验证码:', token);
	const url = 'https://hcaptcha.com/siteverify'; // hCaptcha验证URL
	const params = new URLSearchParams(); // 构造请求配置 使用 URLSearchParams 来构造请求体
	params.append('response', token);
	params.append('secret', process.env.elasticsearchApiKey ?? ''); // hCaptcha密钥
	const req: AxiosRequestConfig = {
		headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		method: 'POST',
		params: params.toString(),
		url: url
	};

	// const response = await axios.post(url, params.toString(), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
	const response = await send(req);
	return response; // 返回 hCaptcha 验证结果
}
