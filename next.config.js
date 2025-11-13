import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
	//output: 'standalone',
	outputFileTracingRoot: process.cwd(), // 设置正确的工作区根目录

	webpack: config => {
		// 处理原生模块和外部依赖
		config.externals.push('pino-pretty', 'lokijs', 'encoding');
		return config;
	},

	// async headers() {
	// 	return [
	// 		{
	// 			// 为所有路由添加 CORS 头部
	// 			source: '/(.*)',
	// 			headers: [
	// 				{
	// 					key: 'Access-Control-Allow-Origin',
	// 					value: '*'
	// 				},
	// 				{
	// 					key: 'Access-Control-Allow-Methods',
	// 					value: 'GET, POST, PUT, DELETE, OPTIONS'
	// 				},
	// 				{
	// 					key: 'Access-Control-Allow-Headers',
	// 					value: 'Content-Type, Authorization'
	// 				},
	// 				{
	// 					key: 'Content-Security-Policy',
	// 					value: "font-src 'self' https://fonts.reown.com https://fonts.googleapis.com https://fonts.gstatic.com data: blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;"
	// 				}
	// 			]
	// 		}
	// 	];
	// },
	env: {
		baseURL: process.env.BASE_URL || '',
		apiURL: process.env.OKX_API_URL || '',
		apiKey: process.env.OKX_API_KEY || '',
		secretKey: process.env.OKX_API_SECRET_KEY || '',
		passphrase: process.env.OKX_API_PASSPHRASE || '',
		project: process.env.OKX_API_PROJECT_ID || '',
		privateKey: process.env.BITCOIN_PRIVATE_KEY || '',
		mnemonic: process.env.BITCOIN_WALLET_MNEMONIC || '',
		redisURL: process.env.UPSTASH_REDIS_REST_URL || '',
		redisToken: process.env.UPSTASH_REDIS_REST_TOKEN || '',
		cryptoPrice: process.env.CRYPTO_COMPARE_API_KEY || '',
		hCaptchaSiteKey: process.env.HCAPTCHA_SITE_KEY || '',
		elasticsearchApiKey: process.env.ELASTICSEARCH_API_KEY || '',
		unisatBitcoinApiKey: process.env.UNISAT_BITCOIN_API_KEY || '',
		unisatBitcoinTestApiKey: process.env.UNISAT_BITCOIN_TEST_API_KEY || '',
		unisatBitcoinTest4ApiKey: process.env.UNISAT_BITCOIN_TEST4_API_KEY || '',
		unisatFractalApiKey: process.env.UNISAT_FRACTAL_API_KEY || '',
		unisatFractalTestApiKey: process.env.UNISAT_FRACTAL_TEST_API_KEY || '', //UNISAT_FRACTAL_TEST_API_KEY

		pinataApiKey: process.env.PINATA_API_KEY || '',
		pinataApiSecret: process.env.PINATA_API_SECRET || '',
		pinataApiJwt: process.env.PINATA_API_JWT || '',
		pinataGateways: process.env.PINATA_GATEWAYS || ''
	}
};

export default withNextIntl(nextConfig);
