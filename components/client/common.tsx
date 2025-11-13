'use client';
import {useState} from 'react';
import {cn, Button} from '@heroui/react';
import {Icon} from '@iconify/react';
import clipboardCopy from 'clipboard-copy';
import {copyText} from '@/lib/utils';
// 显示键值
interface CellValueProps {
	label: string;
	value: React.ReactNode;
	labelClassName?: string;
	valueClassName?: string;
}
export const CellValue: React.FC<CellValueProps> = ({label, value, labelClassName = 'text-foreground', valueClassName = 'text-foreground'}) => (
	<div className='flex items-center justify-between w-full'>
		<span className={cn('text-sm', labelClassName)}>{label}</span>
		<span className={cn('text-sm', valueClassName)}>{value}</span>
	</div>
);
CellValue.displayName = 'CellValue';

interface CopyCellValueProps {
	label: string;
	value: string | number;
	labelClassName?: string;
	valueClassName?: string;
}
//带复制的CellValue
export const CopyCellValue: React.FC<CopyCellValueProps> = ({label, value, labelClassName = 'text-foreground', valueClassName = 'text-foreground'}) => (
	<div className='flex items-center justify-between w-full'>
		<span className={cn('text-sm', labelClassName)}>{label}</span>
		<div className='flex items-center gap-1'>
			<span className={cn('text-sm', valueClassName)}>{value}</span>
			<CopyButton text={value.toString()} className='w-5 h-5' iconClass='text-primary h-4 w-4 flex-shrink-0' />
		</div>
	</div>
);
CellValue.displayName = 'CellValue';

export const Title = ({title, icon, className}: {title: string; icon?: string; className?: string}) => (
	<div className={cn('flex items-center justify-center gap-1 w-full', className)}>
		{icon && <Icon icon={icon} />}
		<span>{title}</span>
	</div>
);

Title.displayName = 'Title';

// 创建一个信息提示框组件，要添加一个可选参数，是默认文本 如果text为空，则显示默认文本
export const InfoLine = ({text, defaultText, keepHeight = false, className}: {text: string | null; defaultText?: string; keepHeight?: boolean; className?: string}) => {
	const displayText = text ?? defaultText;
	if (!displayText && !keepHeight) return null; // 如果没有文本且不保持高度，则不渲染组件
	return <div className={cn('flex mt-2 border-dashed rounded-md border border-primary-border/50 w-full items-center justify-center p-2 min-h-[40px]', className, !displayText && 'border-transparent bg-transparent')}>{displayText && <p className='text-sm text-primary-foreground'>{displayText}</p>}</div>;
};

InfoLine.displayName = 'InfoLine';

// 工具按钮组组件
export interface ToolButtonItem {
	name?: string;
	icon?: string;
	onClick: () => void;
	disabled?: boolean;
}

export const ToolButton = ({tools, className}: {tools: ToolButtonItem[]; className?: string}) => {
	return (
		<div className={cn('flex gap-1 items-center', className)}>
			{tools.map((tool, index) => (
				<span key={index} className={cn('flex gap-1 items-center justify-center border border-primary-border/30 rounded-md px-3 py-2 transition-colors duration-200  h-8', tool.disabled ? 'bg-[#333333] text-primary-foreground/30 cursor-not-allowed' : 'bg-transparent hover:bg-primary hover:text-black active:bg-primary text-primary-foreground cursor-pointer')} onClick={tool.disabled ? undefined : tool.onClick}>
					{tool.name && <p className={cn('text-xs whitespace-nowrap', tool.disabled ? 'text-primary-foreground/30' : 'text-primary-foreground/50 hover:text-black')}>{tool.name}</p>}
					{tool.icon && <Icon icon={tool.icon} className={cn('w-3 h-3 shrink-0', tool.disabled ? 'text-primary-foreground/30' : 'text-primary-foreground/50 hover:text-black')} />}
				</span>
			))}
		</div>
	);
};
ToolButton.displayName = 'ToolButton';

// 自定义 Snippet 组件
export const Snippet: React.FC<{
	variant?: 'flat' | 'bordered';
	symbol?: string;
	className?: string;
	codeString: string;
	children?: React.ReactNode;
}> = ({variant = 'flat', symbol, className = '', codeString, children}) => {
	const baseClasses = 'flex items-center gap-3 p-3 rounded-lg bg-primary-background text-primary';
	const variantClasses = variant === 'bordered' ? 'border border-primary/20' : '';
	return (
		<div className={`${baseClasses} ${variantClasses} ${className}`}>
			{symbol && <span className='text-xs font-medium opacity-70 flex-shrink-0 flex items-center'>{symbol}</span>}
			<div className='flex-1 min-w-0 flex items-center '>{children ?? <span className='text-xs font-mono break-all'>{codeString}</span>}</div>
			<CopyButton text={codeString} className='w-5 h-5' iconClass='text-primary h-5 w-5 flex-shrink-0' />
		</div>
	);
};
Snippet.displayName = 'Snippet';

// //拷贝按钮
export const CopyButton = ({text, className, iconClass = 'text-primary'}: {text: string; className?: string; iconClass?: string}) => {
	const [icon, setIcon] = useState<string>('mdi:content-copy'); //图标

	const handleCopy = async () => {
		try {
			await clipboardCopy(text);
			setIcon('mdi:check');
			setTimeout(() => {
				setIcon('mdi:content-copy');
			}, 3000); // 3秒后恢复原状态
		} catch (error) {
			setIcon('mdi:content-copy'); //失败后 一个错误图标 再恢复
			setTimeout(() => {
				setIcon('mdi:content-copy');
			}, 3000); // 3秒后恢复原状态
		}
	};
	return (
		<Button isIconOnly variant='light' className={cn('h-5 w-5 min-w-0 flex-shrink-0', className)} onPress={handleCopy}>
			<Icon icon={icon} className={cn('w-3 h-3 flex-shrink-0', iconClass)} />
		</Button>
	);
};
CopyButton.displayName = 'CopyButton';
