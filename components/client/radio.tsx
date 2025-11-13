'use client';
import {cn} from '@heroui/react';
import {RadioProps, useRadio} from '@heroui/react';
import {VisuallyHidden} from '@react-aria/visually-hidden';

// 组件单选框？？
export const CustomRadio = (props: RadioProps) => {
	const {Component, children, description, getBaseProps, getInputProps} = useRadio(props);
	return (
		<Component {...getBaseProps()} className={cn('group inline-flex items-center justify-between bg-primary-background hover:bg-content2 flex-row-reverse w-full', 'cursor-pointer border-2 border-primary-border/30 rounded-md gap-2 p-1 ', 'data-[selected=true]:border-primary ')}>
			<VisuallyHidden>
				<input {...getInputProps()} aria-label={children as string} />
			</VisuallyHidden>
			{/* <span {...getWrapperProps()}>
				<span {...getControlProps()} />
			</span> */}
			{/* <div {...getLabelWrapperProps()}> */}
			<div className='flex flex-col items-center justify-between w-full'>
				{/* {children && <span {...getLabelProps()}>{children}</span>} */}
				{children && <span className='text-xs text-primary-foreground  whitespace-nowrap'>{children}</span>}
				{description && <span className='text-xxs text-primary-foreground/60 opacity-70 whitespace-nowrap'>{description}</span>}
			</div>
		</Component>
	);
};
