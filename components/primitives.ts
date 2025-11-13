import {cn} from '@heroui/react';
import {tv} from 'tailwind-variants';

import {fontSans} from '@/config/fonts';

export const title = tv({
	base: cn('tracking-tight inline font-semibold font-heading motion-preset-blur-down', fontSans.variable),
	variants: {
		color: {
			primary: 'from-primary to-primary-secondary',
			violet: 'from-primary to-primary-secondary',
			yellow: 'from-[#e8b43b] to-[#df7a04]',
			blue: 'from-[#e8b43b] to-[#df7a04]',
			cyan: 'from-[#00b7fa] to-[#01cfea]',
			green: 'from-primary-secondary to-primary',
			pink: 'from-[#ff6bff] to-[#783ffe]',
			foreground: 'dark:from-primary-foreground dark:to-primary-foreground'
		},
		size: {
			xm: 'text-xm lg:text-xm',
			sm: 'text-lg lg:text-xl',
			md: 'text-xl lg:text-2xl leading-9',
			lg: 'text-5xl lg:text-5xl'
		},
		fullWidth: {true: 'w-full block'},
		center: {true: 'text-center'}
	},
	defaultVariants: {size: 'md', center: true},
	compoundVariants: [
		{
			color: ['violet', 'yellow', 'blue', 'cyan', 'green', 'pink', 'foreground', 'primary'],
			class: 'bg-clip-text text-transparent bg-linear-to-r'
		}
	]
});

export const subtitle = tv({
	base: 'w-full md:w-1/2 my-2 text-lg lg:text-xl text-primary-foreground block max-w-full', // font-(--font-body)
	variants: {fullWidth: {true: 'w-full!'}},
	defaultVariants: {fullWidth: true}
});

// 按钮 tailwind-variants  primitives
export const button = tv({
	base: cn('w-full rounded-md', fontSans.variable),
	variants: {
		color: {
			primary: 'bg-primary text-primary-foreground',
			violet: ' bg-linear-to-br from-primary to-[#a56eff] text-black', // 由棕色过渡到紫色，带有复古感
			yellow: ' bg-linear-to-br from-primary to-[#ff9900] text-[#ff9900]', // 由金黄色过渡到深橙，增强暖色调
			blue: 'bg-linear-to-br from-primary to-[#00dfd8] text-black', // 由亮蓝过渡到青蓝，更具科技感
			cyan: 'bg-linear-to-br from-primary to-[#00e4ff] text-black', // 由浅蓝到湖蓝，增强冷色调
			green: 'bg-linear-to-br from-primary to-green-400 text-black', // 由浅绿到深绿，增加层次感
			pink: 'bg-linear-to-br from-primary to-[#d14eff] text-black', // 由粉紫色渐变到深紫，强化对比
			red: 'bg-linear-to-br from-red-500 to-red-600 text-black' // 由红色的过渡
		},
		text: {
			xm: 'text-xm lg:text-xm',
			sm: 'text-sm lg:text-sm',
			md: 'text-md lg:text-md',
			lg: 'text-lg lg:text-3xl'
		},
		fullWidth: {true: 'w-full block'}
	},
	defaultVariants: {color: 'primary', size: 'sm'},
	compoundVariants: [
		{
			color: ['violet', 'yellow', 'blue', 'cyan', 'green', 'pink', 'primary', 'red']
		}
	]
});

// 卡片 tailwind-variants
export const group = tv({
	base: 'flex flex-col gap-2 overflow-y-auto p-2 rounded-md border w-full shadow-lg custom-scrollbar shadow-black motion-preset-slide-up', // max-h-[500px] min-h-[500px]
	variants: {
		background: {
			primary: 'bg-primary-background',
			violet: 'bg-primary-ground',
			yellow: 'bg-primary-ground',
			blue: 'bg-primary-ground',
			cyan: 'bg-primary-ground',
			green: 'bg-primary-ground',
			pink: 'bg-primary-ground'
		},
		border: {
			primary: 'border-primary-border/30',
			violet: 'border-primary-border/30',
			yellow: 'border-primary-border/30',
			blue: 'border-primary-border/30',
			cyan: 'border-primary-border/30',
			green: 'border-primary-border/30',
			pink: 'border-primary-border/30'
		},
		fullWidth: {true: 'w-full block'}
	},
	defaultVariants: {background: 'primary', border: 'primary'},
	compoundVariants: [
		{
			background: ['violet', 'yellow', 'blue', 'cyan', 'green', 'pink', 'primary']
		}
	]
});
