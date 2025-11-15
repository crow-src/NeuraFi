'use client';
import React from 'react';

import {CircularProgress} from '@heroui/progress';
import {Card, CardBody, CardFooter, Chip, Snippet, Image, cn, ModalProps, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter} from '@heroui/react';

import {useModalStore} from '@/app/store';
// import {useWalletStore} from '@/app/store';
import {title} from '@/components';
import {obsTxt} from '@/lib';
import {useTransactionStatus} from '@/lib/hooks';

// 交易弹出窗口
export const HexView = ({tx}: {tx: string}) => {
	const {status} = useTransactionStatus(tx);

	return (
		<div className='flex h-max-screen/2 w-full flex-col gap-2'>
			<div className='flex w-full items-center justify-center'>
				{status === 'pending' ? (
					<Card className='h-full w-full border-none bg-linear-to-br from-primary to-primary-secondary'>
						<CardBody className='items-center justify-center pb-0'>
							<CircularProgress
								classNames={{
									svg: 'w-36 h-36 drop-shadow-md',
									indicator: 'stroke-white',
									track: 'stroke-white/10',
									value: 'text-3xl font-semibold text-primary-foreground'
								}}
								strokeWidth={4}
							/>
						</CardBody>
						<CardFooter className='items-center justify-center pt-0'>
							<Chip
								classNames={{
									base: 'border-1 border-white/30',
									content: 'text-primary-foreground/90 text-small font-semibold'
								}}
								variant='bordered'>
								Pending...
							</Chip>
						</CardFooter>
					</Card>
				) : (
					<Image alt='Send image' width={380} className='w-full' src='/images/banners/t.jpg' />
				)}
			</div>
			<div className='wrap-break-words'>
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
