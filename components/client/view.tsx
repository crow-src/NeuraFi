'use client';
import React, {useEffect} from 'react';

import {CircularProgress} from '@heroui/progress';
import {Card, CardBody, CardFooter, Chip, Snippet, Image, cn, ModalProps, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter} from '@heroui/react';

import {useModalStore} from '@/app/store';
// import {useWalletStore} from '@/app/store';
import {title} from '@/components';
import {obsTxt} from '@/lib';
import {useTransactionStatus, useTransactionHistory} from '@/lib/hooks'; // 确保正确地导入useDebounce

// 交易弹出窗口
export const HexView = ({tx}: {tx: string}) => {
	const {status, receipt} = useTransactionStatus(tx);
	// 状态
	return (
		<div className='flex flex-col w-full gap-2 h-max-screen/2'>
			<div className='flex items-center justify-center w-full'>
				{status === 'pending' ? (
					// <CircularProgress label='Pending...' className='w-full' />
					<Card className='w-full h-full border-none bg-linear-to-br from-primary to-primary-secondary'>
						<CardBody className='items-center justify-center pb-0'>
							<CircularProgress
								classNames={{svg: 'w-36 h-36 drop-shadow-md', indicator: 'stroke-white', track: 'stroke-white/10', value: 'text-3xl font-semibold text-white'}}
								strokeWidth={4} // 线宽
							/>
						</CardBody>
						<CardFooter className='items-center justify-center pt-0'>
							<Chip
								classNames={{
									base: 'border-1 border-white/30',
									content: 'text-white/90 text-small font-semibold'
								}}
								variant='bordered'>
								Pending...
							</Chip>
						</CardFooter>
					</Card>
				) : (
					<Image alt='Send image' width={380} className='w-full' src='/images/gif/money.gif' />
				)}
			</div>
			<div className='break-words'>
				<p>
					Awaiting pending...{' '}
					<a href={`https://bscscan.com/tx/${tx}`} className='text-blue-600 hover:underline' target='_blank' rel='noopener noreferrer'>
						view transactions
					</a>
				</p>
			</div>

			<Snippet symbol='TX' variant='bordered' size='sm' codeString={tx}>
				<span className='text-sm md:text-sm'>{obsTxt(tx, 12, 12)}</span>
			</Snippet>
		</div>
	);
};

// 全局模态窗口组件，直接使用 store 中的状态和方法
export const CommonModal = () => {
	const {modalLabel, modalBody, modalFooter, isOpen, closeModal} = useModalStore();

	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={closeModal}
			// onClose={closeModal}
			backdrop='blur'
			radius='lg'
			scrollBehavior='inside'
			classNames={{
				wrapper: 'w-full max-w-screen-sm mx-auto',
				base: 'w-full max-w-full primary-ground text-primary-foreground border border-primary-border/30',
				body: 'w-full',
				header: 'w-full',
				footer: 'w-full'
			}}>
			<ModalContent className='custom-scrollbar'>
				<ModalHeader>
					<h2 className={title({color: 'primary', size: 'sm'})}>{modalLabel}</h2>
				</ModalHeader>
				<ModalBody className='custom-scrollbar'>{modalBody}</ModalBody>
				{modalFooter && <ModalFooter>{modalFooter}</ModalFooter>}
			</ModalContent>
		</Modal>
	);
};

CommonModal.displayName = 'CommonModal';

// 侧边抽屉管理
export const SidebarDrawer = React.forwardRef<HTMLDivElement, ModalProps>(({children, className, onOpenChange, isOpen, classNames = {}, ...props}, ref) => (
	<>
		<Modal
			ref={ref}
			{...props}
			classNames={{...classNames, wrapper: cn('items-start! justify-start! max-w-[288px]', classNames?.wrapper), base: cn('justify-start m-0! p-0 h-full max-h-full', classNames?.base, className), body: cn('p-0', classNames?.body), closeButton: cn('z-50', classNames?.closeButton)}}
			isOpen={isOpen}
			motionProps={{variants: {enter: {x: 0, transition: {duration: 0.3, ease: 'easeOut'}}, exit: {x: -288, transition: {duration: 0.2, ease: 'easeOut'}}}}}
			radius='none'
			scrollBehavior='inside'
			onOpenChange={onOpenChange}
			backdrop={'blur'}>
			<ModalContent>
				<ModalBody>{children}</ModalBody>
			</ModalContent>
		</Modal>
		{/* 'overflow-scroll' */}
		<div className={cn('hidden h-full max-w-[288px]  sm:flex', className)}>{children}</div>
	</>
));

SidebarDrawer.displayName = 'SidebarDrawer';

// // 交易状态组件 主要用于BTC项目 其他项目使用HexView
// export const TransactionStateView = () => {
// 	const {wallet} = useWalletStore();
// 	const {allTransactions} = useTransactionHistory({
// 		limit: 1 // 只获取最新的1条交易
// 	});
// 	const [isProcessing, setIsProcessing] = React.useState(true);
// 	const [timeLeft, setTimeLeft] = React.useState(5);

// 	const latestTx = allTransactions[0]; // 获取最新的交易

// 	// 倒计时，然后显示成功
// 	useEffect(() => {
// 		const timer = setInterval(() => {
// 			setTimeLeft(prev => {
// 				if (prev <= 1) {
// 					setIsProcessing(false);
// 					clearInterval(timer);
// 					return 0;
// 				}
// 				return prev - 1;
// 			});
// 		}, 1000);

// 		return () => clearInterval(timer);
// 	}, []);

// 	// 如果没有交易记录，不渲染组件
// 	if (!latestTx) return null;
// 	return (
// 		<div className='flex flex-col w-full gap-2 h-max-screen/2'>
// 			<div className='flex items-center justify-center w-full'>
// 				<Card className='w-full h-full border-none bg-linear-to-br from-primary to-primary-secondary'>
// 					<CardBody className='items-center justify-center pb-0 min-h-[144px] overflow-hidden'>
// 						{isProcessing ? (
// 							<div className='flex flex-col items-center justify-center h-36 w-full'>
// 								<div className='relative w-36 h-36'>
// 									<CircularProgress
// 										aria-label='Loading...'
// 										classNames={{
// 											svg: 'w-36 h-36 drop-shadow-md',
// 											indicator: 'stroke-white',
// 											track: 'stroke-white/10',
// 											value: 'text-3xl font-semibold text-white'
// 										}}
// 										strokeWidth={4}
// 									/>
// 									<div className='absolute inset-0 flex items-center justify-center'>
// 										<span className='text-white text-2xl font-bold'>{timeLeft}s</span>
// 									</div>
// 								</div>
// 							</div>
// 						) : (
// 							<div className='flex flex-col items-center justify-center h-36 w-full'>
// 								<p className='text-white text-xl font-semibold'>Push Successful</p>
// 								<p className='text-white/80 text-sm mt-2'>Please check in browse</p>
// 							</div>
// 						)}
// 					</CardBody>
// 					<CardFooter className='items-center justify-center pt-0'>
// 						<Chip classNames={{base: 'border-1 border-white/30', content: 'text-white/90 text-small font-semibold'}} variant='bordered'>
// 							{latestTx.status === 'pending' ? 'Pending...' : latestTx.status === 'success' ? 'Success' : 'Failed'}
// 						</Chip>
// 					</CardFooter>
// 				</Card>
// 			</div>
// 			<div className='break-words'>
// 				<p>
// 					{isProcessing ? `Processing transaction, ${timeLeft}s remaining...` : 'Transaction completed'}{' '}
// 					{!isProcessing && (
// 						<a href={`${wallet.chain.explorerUrl}/tx/${latestTx.hash}`} className='text-blue-600 hover:underline' target='_blank' rel='noopener noreferrer'>
// 							view transactions
// 						</a>
// 					)}
// 				</p>
// 			</div>
// 			<Snippet symbol='TX' variant='bordered' size='sm' codeString={latestTx.hash}>
// 				<span className='text-sm md:text-sm'>{obsTxt(latestTx.hash, 12, 12)}</span>
// 			</Snippet>
// 		</div>
// 	);
// };

//TransactionStateView.displayName = 'TransactionStateView';
