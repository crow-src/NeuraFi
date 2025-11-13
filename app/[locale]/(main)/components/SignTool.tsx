// 'use client';
// import {useState, useMemo, ReactNode} from 'react';
// import React from 'react';

// import {Accordion, AccordionItem, Button, Spacer, Listbox, ListboxItem, RadioGroup, Input} from '@heroui/react';
// import {cn} from '@heroui/react';
// import {useTranslations} from 'next-intl';
// import {useMount} from 'react-use';

// import {useWalletStore} from '@/app/store';
// import {button} from '@/components';
// import {InputClass} from '@/components';
// import {InfoLine, CustomRadio, CellValue} from '@/components/client';
// import {withError} from '@/lib';
// import {obsTxt} from '@/lib';
// import {useTransactionManager} from '@/lib/hooks';

// /**
//  * 签名视图组件属性接口
//  */
// interface SignViewProps {
// 	mod: (params: any) => Promise<unknown> /** 模块方法 */;
// 	params: any /** 参数 */;
// 	token?: string /** 代币类型，默认'Sat' */;
// 	startContent?: ReactNode[] /** 开始内容数组 */;
// }

// /**
//  * 统一签名页面组件 - 展示交易输入输出信息并处理签名
//  * 支持多步骤流程和费率选择
//  * @param mod 模块方法
//  * @param params 交易参数
//  * @param token 代币类型
//  * @param startContent 开始内容数组
//  */
// export const SignView = ({mod, params, token = 'Sat', startContent}: SignViewProps) => {
// 	console.log('输出签名参数查看', params);
// 	const t = useTranslations('common');
// 	const [step, setStep] = useState(startContent && startContent.length > 0 ? 0 : 0); // 如果有startContent从0开始，否则直接是签名页
// 	const [feeRate, setFeeRate] = useState(1); // 当前选择的费率
// 	const [isLoading, setIsLoading] = useState(false);
// 	const {wallet} = useWalletStore(); // 钱包信息
// 	const {addTransaction} = useTransactionManager(); // 添加交易记录

// 	// 计算费用（仅用于显示）
// 	const {fee, totalInput, totalOutput, tokenTotalOutput} = useCalculateFee({token, inputs: params?.inputs ?? [], outputs: params?.outputs ?? [], feeRate}); // 计算手续费

// 	// 输出处理
// 	const outputs: Output[] = useMemo(() => {
// 		return params?.outputs?.length > 0 ? params.outputs : [{address: wallet.accounts[0], value: totalInput - fee}];
// 	}, [params.outputs, wallet.accounts, totalInput, fee]);

// 	// 是否禁用签名按钮
// 	const isDisabled = useMemo(() => {
// 		return token === 'Sat' ? totalOutput > totalInput + fee : false;
// 	}, [totalOutput, totalInput, fee, token]);

// 	// 处理交易签名
// 	const sign = withError({title: 'handleSign', onStart: () => setIsLoading(true), onComplete: () => setIsLoading(false)})(async () => {
// 		const result = await mod({...params, feeRate});
// 		console.log('铭刻或者蚀刻执行返回的数据:', result);
// 		// 使用新的 addTransaction 方法，必须包含 walletAddress
// 		await addTransaction(
// 			{
// 				hash: result as string,
// 				type: 'Transfer',
// 				walletAddress: wallet.accounts[0], // 必填字段
// 				description: `${token} Transfer`,
// 				amount: totalOutput,
// 				fee: fee,
// 				network: wallet.chain.currency
// 			},
// 			{showModal: true, autoSimulate: true}
// 		);
// 	});

// 	// 获取当前页面内容
// 	const getCurrentPageContent = () => {
// 		if (step === 0 && startContent && startContent.length > 0) {
// 			// 显示第一个信息页面
// 			return React.cloneElement(startContent[0] as React.ReactElement, {key: `page-${step}`});
// 		} else if (step > 0 && startContent && startContent.length > step) {
// 			// 显示后续的信息页面
// 			return React.cloneElement(startContent[step] as React.ReactElement, {key: `page-${step}`});
// 		}
// 		return null;
// 	};

// 	// 检查是否还有下一页
// 	const hasNextPage = () => {
// 		return startContent && startContent.length > step + 1;
// 	};

// 	// 检查是否到达签名页
// 	const isSignPage = () => {
// 		// 如果没有startContent，则step=0时就是签名页
// 		// 如果有startContent，则step等于startContent.length时是签名页
// 		return startContent ? step === startContent.length : step === 0;
// 	};

// 	// 处理下一步或签名
// 	const handleNextOrSign = async () => {
// 		console.log('handleNextOrSign 被调用', {
// 			step,
// 			hasNextPage: hasNextPage(),
// 			isSignPage: isSignPage(),
// 			startContentLength: startContent?.length ?? 0
// 		});

// 		if (hasNextPage()) {
// 			// 还有下一页，继续
// 			console.log('还有下一页，继续');
// 			setStep(step + 1);
// 		} else {
// 			console.log('执行签名操作');
// 			// 没有下一页了，执行签名
// 			await sign();
// 		}
// 	};

// 	return (
// 		<div className='flex flex-col w-full gap-2 text-sm text-primary-foreground md:min-w-xl'>
// 			{getCurrentPageContent() ? (
// 				getCurrentPageContent()
// 			) : (
// 				<>
// 					<div className='flex flex-col border-dashed rounded-md border border-primary-border/50 w-full items-center justify-center p-2'>
// 						<p className='text-sm text-primary-foreground'>{t('signature') + t('data')}</p>
// 						{/* 交易信息小列表 */}
// 						<div className='w-full mt-2 space-y-1'>
// 							<div className='flex justify-between items-center text-sm'>
// 								<span className='text-primary-foreground/70'>{t('input')}:</span>
// 								<span className='text-green-400 font-medium'>{`${(totalInput / 1e8).toFixed(8)} ${wallet.chain.currency}`}</span>
// 							</div>
// 							<div className='flex justify-between items-center text-sm'>
// 								<span className='text-primary-foreground/70'>{t('output')}:</span>
// 								<span className='text-blue-400 font-medium'>{`${(totalOutput / 1e8).toFixed(8)} ${wallet.chain.currency}`}</span>
// 							</div>
// 							{token !== 'Sat' && (
// 								<div className='flex justify-between items-center text-sm'>
// 									<span className='text-primary-foreground/70'>{t('output')}:</span>
// 									<span className='text-purple-400 font-medium'>{`${tokenTotalOutput.toLocaleString()} ${token}`}</span>
// 								</div>
// 							)}
// 							<div className='flex justify-between items-center text-sm border-t border-primary-border/30 pt-2'>
// 								<span className='text-primary-foreground/70'>{t('fee')}:</span>
// 								<span className='text-orange-400 font-medium'>{`≈ ${fee.toFixed(8)} ${wallet.chain.currency}`}</span>
// 							</div>
// 						</div>
// 					</div>
// 					<Accordion defaultExpandedKeys={[]} className='w-full'>
// 						<AccordionItem key='input' title={<CellValue label={t('input') + ':'} value={params?.inputs?.length ?? 0} />} classNames={{base: 'px-0 mx-0', title: 'text-primary-foreground text-sm'}} aria-label='Input list'>
// 							<Listbox variant='faded' color='primary' classNames={{base: ' w-full border-1 border-primary-border/30 rounded-md max-h-60 overflow-y-auto'}}>
// 								{params?.inputs?.map((item: IUTXO, index: number) => (
// 									<ListboxItem key={index} startContent={'UTXO:'} textValue={`UTXO ${obsTxt(item?.txid, 6, 6)} ${item?.satoshi} Sat`}>
// 										<div className='flex w-full gap-1'>
// 											<p className='w-full text-primary-foreground/60'>{obsTxt(item?.txid, 6, 6)}</p>
// 											<p className='text-green-400'>{item?.satoshi}</p>
// 											<p className='text-primary-foreground'>{'Sat'}</p>
// 										</div>
// 									</ListboxItem>
// 								))}
// 							</Listbox>
// 						</AccordionItem>
// 						<AccordionItem key='output' title={<CellValue label={t('output') + ':'} value={outputs.length.toString()} />} aria-label='Output list'>
// 							<Listbox variant='faded' color='primary' classNames={{base: ' w-full border-1 border-primary-border/30 rounded-md max-h-60 overflow-y-auto'}}>
// 								{outputs.map((item: Output, index: number) => (
// 									<ListboxItem key={index} textValue={`Address ${obsTxt(item?.address, 6, 6)} ${item?.value} ${token !== 'Sat' ? token : 'Sat'}`}>
// 										<div className='flex w-full gap-1'>
// 											<p className='w-full text-primary-foreground/60'>{obsTxt(item?.address, 6, 6)}</p>
// 											<p className='text-green-400'>{item?.value}</p>
// 											<p className='text-primary-foreground'>{'Sat'}</p>
// 											{token !== 'Sat' && <p className='text-primary-foreground'>{token}</p>}
// 											{token !== 'Sat' && <p className='text-green-400'>{546}</p>}
// 											{token !== 'Sat' && <p className='text-primary-foreground'>{'Sat'}</p>}
// 										</div>
// 									</ListboxItem>
// 								))}
// 							</Listbox>
// 						</AccordionItem>
// 					</Accordion>
// 					<FeeRateSelector onFeeRateChange={setFeeRate} />
// 					<InfoLine text={isDisabled ? t('insufficient_balance') : ''} defaultText={t('transaction_info')} className='min-h-12' />
// 				</>
// 			)}
// 			<Button className={button({color: 'primary', text: 'sm'})} onPress={handleNextOrSign} isLoading={isLoading} aria-label='signature' isDisabled={isSignPage() && isDisabled}>
// 				{hasNextPage() ? t('next') : `${t('signature')} & ${t('push')}`}
// 			</Button>
// 			<Spacer y={2} />
// 		</div>
// 	);
// };

// /**
//  * 费率选择器组件属性接口
//  */
// interface FeeRateSelectorProps {
// 	/** 费率变化回调 */
// 	onFeeRateChange: (feeRate: number) => void;
// 	/** 自定义样式类名 */
// 	className?: string;
// }

// /**
//  * 费率选择器组件 - 提供快速、普通、慢速和自定义费率选择
//  * @param onFeeRateChange 费率变化回调
//  * @param className 自定义样式
//  */
// export const FeeRateSelector = ({onFeeRateChange, className}: FeeRateSelectorProps) => {
// 	const t = useTranslations('common');
// 	// const {feeRate: feeRateStore} = useFeeRateStore();
// 	const [feeType, setFeeType] = useState('halfHourFee');
// 	const [feeAmount, setFeeAmount] = useState(1); // 自定义输入的费率

// 	// useMount(() => onFeeRateChange(feeRateStore.halfHourFee || 1)); // 初始化时通知父组件当前费率

// 	// 处理费率类型选择
// 	const handleFeeTypeChange = (type: string) => {
// 		setFeeType(type);
// 		// type !== 'free' && onFeeRateChange(feeRateStore[type] ?? 1); // ?????
// 	};

// 	// 处理自定义费率输入
// 	const handleFeeAmountChange = (value: string) => {
// 		const amount = Number(value) || 0;
// 		setFeeAmount(amount);
// 		onFeeRateChange(amount);
// 	};

// 	// const feeRateList = [
// 	// 	{key: 'fast', value: 'fastestFee', description: `${feeRateStore.fastestFee.toString()} sats/vB`}, // 最快
// 	// 	{key: 'normal', value: 'halfHourFee', description: `${feeRateStore.halfHourFee.toString()} sats/vB`}, // 半小时
// 	// 	{key: 'slow', value: 'minimumFee', description: `${feeRateStore.minimumFee.toString()} sats/vB`}, // 最低
// 	// 	{key: 'custom', value: 'free', description: 'sats/vB'} // 自定义
// 	// ];

// 	return (
// 		<div className={cn('flex flex-col gap-1 w-full', className)}>
// 			{/* <RadioGroup className='flex w-full gap-2' defaultValue={'halfHourFee'} value={feeType} color='primary' onValueChange={handleFeeTypeChange}>
// 				<div className='flex w-full gap-2'>
// 					{feeRateList.map(item => (
// 						<CustomRadio key={item.value} value={item.value} description={item.description}>
// 							{t(item.key)}
// 						</CustomRadio>
// 					))}
// 				</div>
// 			</RadioGroup> */}
// 			{feeType === 'free' && <Input color='primary' type='number' isRequired labelPlacement='inside' classNames={InputClass} endContent='sats/vB' onValueChange={handleFeeAmountChange} value={feeAmount?.toString()} aria-label='Custom fee rate' />}
// 		</div>
// 	);
// };

// /**
//  * 费用计算Hook属性接口
//  */
// interface UseCalculateFeeProps {
// 	token: string /** 代币类型 */;
// 	inputs: IUTXO[] /** 输入UTXO数组 */;
// 	outputs: Output[] /** 输出数组 */;
// 	feeRate?: number /** 费率，默认1 */;
// }

// /**
//  * 费用计算Hook返回值接口
//  */
// interface UseCalculateFeeResult {
// 	fee: number;
// 	totalInput: number;
// 	totalOutput: number;
// 	tokenTotalOutput: number;
// }

// /**
//  * 根据输入和输出简单计算手续费Hook
//  * @param token 代币类型
//  * @param inputs 输入UTXO数组
//  * @param outputs 输出数组
//  * @param feeRate 费率
//  * @returns 费用计算结果
//  */
// export const useCalculateFee = ({token, inputs, outputs, feeRate = 1}: UseCalculateFeeProps): UseCalculateFeeResult => {
// 	const data: {fee: number; totalInput: number; totalOutput: number; tokenTotalOutput: number} = useMemo(() => {
// 		const totalInput = inputs.reduce((acc: number, item: IUTXO) => acc + item.satoshi, 0); // 计算总输入金额 不需要useMemo
// 		const totalOutput = outputs.reduce((acc: number, item: Output) => acc + (token === 'Sat' ? item.value : item.value * 546), 0); // 计算总输出金额 如果token是Sat 则正常计算 否则是根据输出数量*546 计算
// 		const tokenTotalOutput = outputs.reduce((acc: number, item: Output) => acc + item.value, 0); // 计算代币总输出数额
// 		const fee = calculateFeeAmount(token, inputs, outputs, feeRate); // 要根据实际输入和输入的数量大概计算手续费
// 		return {fee, totalInput, totalOutput, tokenTotalOutput};
// 	}, [inputs, outputs, token, feeRate]);
// 	return data;
// };

// /**
//  * 计算费用金额函数 - 根据输入和输出计算交易手续费
//  * @param token 代币类型
//  * @param inputs 输入UTXO数组
//  * @param outputs 输出数组
//  * @param feeRate 费率，默认1
//  * @returns 计算出的费用金额
//  */
// export const calculateFeeAmount = (token: string, inputs: IUTXO[], outputs: Output[], feeRate: number = 1): number => {
// 	// 基础手续费计算
// 	let totalFee = 0;
// 	const inputFee = inputs.length * 67.5 * feeRate; // 使用 P2WPKH 作为平均值
// 	const outputFee = (outputs.length + 1) * 43 * feeRate; // 使用 P2WPKH 作为标准
// 	const transactionOverhead = 12 * feeRate;
// 	totalFee = inputFee + outputFee + transactionOverhead;
// 	token !== 'Sat' && (totalFee += 450 * feeRate); // 根据token类型增加额外费用
// 	totalFee += 100 * feeRate; // 添加一些安全缓冲费用
// 	return totalFee / 1e8;
// };

// SignView.displayName = 'SignView';
// FeeRateSelector.displayName = 'FeeRateSelector';
