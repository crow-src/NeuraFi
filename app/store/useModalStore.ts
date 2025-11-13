'use client';
import {ReactNode} from 'react';
import {create} from 'zustand';

// 定义模态窗口状态和方法
interface ModalStateProps {
	isOpen: boolean;
	modalLabel: string;
	modalBody: ReactNode;
	modalFooter?: ReactNode;
	showModal: ({label, body, footer}: {label: string; body: ReactNode; footer?: ReactNode}) => void;
	closeModal: () => void;
}

// 创建模态窗口store
export const useModalStore = create<ModalStateProps>(set => ({
	isOpen: false,
	modalLabel: '',
	modalBody: undefined,
	modalFooter: undefined,
	showModal: ({label, body, footer = undefined}) => {
		set({isOpen: true, modalLabel: label, modalBody: body, modalFooter: footer});
	},
	closeModal: () => set({isOpen: false})
}));
