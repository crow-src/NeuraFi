'use client';

// import React from 'react';
import React from 'react';

import {Button} from '@heroui/button';
import type {ButtonProps} from '@heroui/button';
import {Card} from '@heroui/card';
import type {CardProps} from '@heroui/card';
import {Chip} from '@heroui/chip';
import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from '@heroui/dropdown';
import {cn} from '@heroui/react';
import {Icon} from '@iconify/react';
import {Area, AreaChart, ResponsiveContainer, YAxis} from 'recharts';
import {RadialBarChart, RadialBar, Cell, Tooltip} from 'recharts';
// import {Select, SelectItem} from '@heroui/select';
const data = [
	{
		title: 'BTC',
		subtitle: 'Bitcoin (USD)',
		value: '$97,859',
		chartData: [
			{month: 'January', value: 42582},
			{month: 'February', value: 61198},
			{month: 'March', value: 71333},
			{month: 'April', value: 60636},
			{month: 'May', value: 67491},
			{month: 'June', value: 62678},
			{month: 'July', value: 64619},
			{month: 'August', value: 58969},
			{month: 'September', value: 63329},
			{month: 'October', value: 70215},
			{month: 'November', value: 97850}
		],
		change: '10.9%',
		color: 'secondary',
		xaxis: 'month'
	},
	{
		title: 'FB',
		subtitle: 'Airbnb, Inc.',
		value: '$137,34',
		chartData: [
			{month: 'January', value: 120},
			{month: 'February', value: 126},
			{month: 'March', value: 123},
			{month: 'April', value: 130},
			{month: 'May', value: 133},
			{month: 'June', value: 128},
			{month: 'July', value: 125},
			{month: 'August', value: 132},
			{month: 'September', value: 135},
			{month: 'October', value: 134},
			{month: 'November', value: 136}
		],
		change: '0.3%',
		color: 'warning',
		xaxis: 'month'
	},
	{
		title: 'S&P 500',
		subtitle: 'Standard & Poor 500',
		value: '$5,969.51',
		chartData: [
			{month: 'January', value: 4850},
			{month: 'February', value: 4790},
			{month: 'March', value: 4920},
			{month: 'April', value: 4880},
			{month: 'May', value: 4950},
			{month: 'June', value: 4890},
			{month: 'July', value: 4970},
			{month: 'August', value: 4920},
			{month: 'September', value: 5010},
			{month: 'October', value: 4980},
			{month: 'November', value: 5100}
		],
		change: '1.2%',
		color: 'success',
		xaxis: 'month'
	}
];

export function CommonChart() {
	return (
		<dl className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3'>
			{data.map(({title, subtitle, value, change, color, chartData}, index) => (
				<Card key={title} className='border border-transparent dark:border-default-100'>
					<section className='flex flex-col flex-nowrap'>
						<div className='flex flex-col justify-between px-4 pt-4 gap-y-2'>
							<div className='flex flex-col gap-y-2'>
								<div className='flex flex-col gap-y-0'>
									<dt className='text-sm font-medium text-default-600'>{title}</dt>
									<dt className='font-normal text-tiny text-default-400'>{subtitle}</dt>
								</div>
								<div className='flex items-baseline gap-x-2'>
									<dd className='text-xl font-semibold text-default-700'>{value}</dd>
									<Chip
										classNames={{
											content: 'font-medium'
										}}
										color={color === 'success' ? 'success' : color === 'primary' ? 'primary' : color === 'secondary' ? 'secondary' : color === 'warning' ? 'warning' : color === 'danger' ? 'danger' : 'default'}
										radius='sm'
										size='sm'
										startContent={color === 'success' ? <Icon height={16} icon={'solar:arrow-right-up-linear'} width={16} /> : color === 'danger' ? <Icon height={16} icon={'solar:arrow-right-down-linear'} width={16} /> : <Icon height={16} icon={'solar:arrow-right-linear'} width={16} />}
										variant='flat'>
										<span>{change}</span>
									</Chip>
								</div>
							</div>
						</div>
						<div className='w-full min-h-24'>
							<ResponsiveContainer className='[&_.recharts-surface]:outline-hidden'>
								<AreaChart accessibilityLayer className='scale-105 translate-y-1' data={chartData}>
									<defs>
										<linearGradient id={'colorUv' + index} x1='0' x2='0' y1='0' y2='1'>
											<stop
												offset='10%'
												stopColor={cn({
													'hsl(var(--heroui-success))': color === 'success',
													'hsl(var(--heroui-primary))': color === 'primary',
													'hsl(var(--heroui-secondary))': color === 'secondary',
													'hsl(var(--heroui-warning))': color === 'warning',
													'hsl(var(--heroui-danger))': color === 'danger',
													'hsl(var(--heroui-foreground))': color === 'default'
												})}
												stopOpacity={0.3}
											/>
											<stop
												offset='100%'
												stopColor={cn({
													'hsl(var(--heroui-success))': color === 'success',
													'hsl(var(--heroui-primary))': color === 'primary',
													'hsl(var(--heroui-secondary))': color === 'secondary',
													'hsl(var(--heroui-warning))': color === 'warning',
													'hsl(var(--heroui-danger))': color === 'danger',
													'hsl(var(--heroui-foreground))': color === 'default'
												})}
												stopOpacity={0.1}
											/>
										</linearGradient>
									</defs>
									<YAxis domain={[Math.min(...chartData.map(d => d.value)), 'auto']} hide={true} />
									<Area
										dataKey='value'
										fill={`url(#colorUv${index})`}
										stroke={cn({
											'hsl(var(--heroui-success))': color === 'success',
											'hsl(var(--heroui-primary))': color === 'primary',
											'hsl(var(--heroui-secondary))': color === 'secondary',
											'hsl(var(--heroui-warning))': color === 'warning',
											'hsl(var(--heroui-danger))': color === 'danger',
											'hsl(var(--heroui-foreground))': color === 'default'
										})}
									/>
								</AreaChart>
							</ResponsiveContainer>
						</div>
						<Dropdown
							classNames={{
								content: 'min-w-[120px]'
							}}
							placement='bottom-end'>
							<DropdownTrigger>
								<Button isIconOnly className='absolute w-auto rounded-full right-2 top-2' size='sm' variant='light'>
									<Icon height={16} icon='solar:menu-dots-bold' width={16} />
								</Button>
							</DropdownTrigger>
							<DropdownMenu
								itemClasses={{
									title: 'text-tiny'
								}}
								variant='flat'>
								<DropdownItem key='view-details'>View Details</DropdownItem>
								<DropdownItem key='export-data'>Export Data</DropdownItem>
								<DropdownItem key='set-alert'>Set Alert</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					</section>
				</Card>
			))}
		</dl>
	);
}

type ChartData = {
	name: string;
	value: number;
	valueText: string;
	[key: string]: string | number;
};

type CircleChartProps = {
	title: string;
	color: ButtonProps['color'];
	categories: string[];
	chartData: ChartData[];
	unit?: string;
	unitTitle?: string;
	total?: number;
};

const data2: CircleChartProps[] = [
	{
		title: '项目进度',
		categories: ['空投:', '募集:', '自留:'],
		color: 'warning',
		unit: 'K',
		unitTitle: '剩余额度',
		total: 2390000,
		chartData: [
			{name: '空投:', value: 670, valueText: '67%'},
			{name: '募集:', value: 440, valueText: '44%'},
			{name: '自留:', value: 750, valueText: '100%'}
		]
	}
];

export function CommonChartB() {
	return (
		<dl className='grid w-full '>
			{data2.map((item, index) => (
				<CircleChartCard key={index} {...item} />
			))}
		</dl>
	);
}

const colorIndexMap = (index: number) => {
	const mapIndex: Record<number, number> = {
		0: 300,
		1: 500,
		2: 700,
		3: 900
	};

	return mapIndex[index] ?? 200;
};

const formatTotal = (value: number | undefined) => {
	return value?.toLocaleString() ?? '0';
};

export const CircleChartCard = React.forwardRef<HTMLDivElement, Omit<CardProps, 'children'> & CircleChartProps>(({className, title, categories, color, chartData, unit, total, unitTitle, ...props}, ref) => {
	return (
		<Card ref={ref} className={cn('min-h-[200px] border border-transparent dark:border-default-100', className)} {...props}>
			<div className='flex flex-col p-4 pb-0 gap-y-2'>
				<div className='flex items-center justify-between gap-x-2'>
					<dt>
						<h3 className='font-medium text-small text-foreground'>{title}</h3>
					</dt>
					<div className='flex items-center justify-end gap-x-2'>
						<Dropdown
							classNames={{
								content: 'min-w-[120px]'
							}}
							placement='bottom-end'>
							<DropdownTrigger>
								<Button isIconOnly radius='full' size='sm' variant='light'>
									<Icon height={16} icon='solar:menu-dots-bold' width={16} />
								</Button>
							</DropdownTrigger>
							<DropdownMenu
								itemClasses={{
									title: 'text-tiny'
								}}
								variant='flat'>
								<DropdownItem key='view-details'>View Details</DropdownItem>
								<DropdownItem key='export-data'>Export Data</DropdownItem>
								<DropdownItem key='set-alert'>Set Alert</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					</div>
				</div>
			</div>
			{/* <div className="flex flex-col flex-col-reverse flex-wrap h-full gap-3 sm:flex-row sm:flex-nowrap"> */}
			<div className='flex h-full gap-3 sm:flex-row sm:flex-nowrap'>
				<div className='flex flex-col justify-center pl-5 gap-y-2 text-tiny text-foreground/60 '>
					{/* lg:pb-0  justify-center */}

					{categories.map((category, index) => {
						const title = category;
						const valueText = chartData.find(c => c.name === title)?.valueText;

						return (
							<div key={index} className='flex w-full gap-x-2'>
								<span className='w-full font-medium text-small text-foreground whitespace-nowrap'>{category}</span>
								<span className='font-semibold text-small text-primary-foreground'>{valueText}</span>
							</div>
						);
					})}
				</div>

				<ResponsiveContainer className='[&_.recharts-surface]:outline-hidden' height={200} width='100%'>
					<RadialBarChart barSize={10} cx='50%' cy='50%' data={chartData} endAngle={-270} innerRadius={90} outerRadius={54} startAngle={90}>
						<Tooltip
							content={({payload}) => (
								<div className='flex h-8 min-w-[120px] items-center gap-x-2 rounded-medium bg-background px-1 text-tiny shadow-small'>
									{payload?.map(p => {
										const name = p.payload.name;
										const value = p.value;
										const index = chartData.findIndex(c => c.name === name);

										return (
											<div key={`${index}-${name}`} className='flex items-center w-full gap-x-2'>
												<div
													className='flex-none w-2 h-2 rounded-full'
													style={{
														backgroundColor: `hsl(var(--heroui-${color}-${colorIndexMap(index)}))`
													}}
												/>
												<div className='flex items-center justify-between w-full pr-1 text-sm gap-x-2 text-default-700'>
													<span className='text-primary-foreground'>{name}</span>
													<span className='font-mono font-medium text-default-700'>{formatTotal(value as number)}</span>
												</div>
											</div>
										);
									})}
								</div>
							)}
							cursor={false}
						/>

						<RadialBar animationDuration={1000} animationEasing='ease' background={{fill: 'hsl(var(--heroui-default-100))'}} cornerRadius={12} dataKey='value' strokeWidth={0}>
							{chartData.map((_, index) => (
								<Cell key={`cell-${index}`} fill={`hsl(var(--heroui-${color}-${colorIndexMap(index)}))`} />
							))}
						</RadialBar>

						<g>
							<text textAnchor='middle' x='50%' y='48%'>
								<tspan className='fill-default-500 text-[0.6rem]' dy='-0.5em' x='50%'>
									{unitTitle}
								</tspan>
								<tspan className='font-semibold fill-foreground text-tiny' dy='1.5em' x='50%'>
									{formatTotal(total)} {unit}
								</tspan>
							</text>
						</g>
					</RadialBarChart>
				</ResponsiveContainer>
			</div>
		</Card>
	);
});

CircleChartCard.displayName = 'CircleChartCard'; // 显式设置 displayName

import {PieChart, Pie, Label} from 'recharts';

type ChartDataB = {
	name: string;
	[key: string]: string | number;
};

type CircleChartBProps = {
	title: string;
	total: number;
	unit?: string;
	color: ButtonProps['color'];
	categories: string[];
	chartData: ChartDataB[];
};

const data3: CircleChartBProps[] = [
	{
		title: '项目分配比例',
		total: 210000000,
		unit: 'CYX',
		categories: ['自  留 : 16%', '募  集 : 24%', '空  投 : 50%', '其  他 : 10%'],
		color: 'warning',
		chartData: [
			{name: '自 留', value: 33600000},
			{name: '募  集', value: 50400000},
			{name: '空  投', value: 105000000},
			{name: '其  他', value: 21000000}
		]
	}
];

export function CommonChartC() {
	return (
		<dl className='grid w-full'>
			{data3.map((item, index) => (
				<CircleChartCardB key={index} {...item} />
			))}
		</dl>
	);
}

const formatTotalB = (total: number) => {
	return total >= 1000 ? `${(total / 1000).toFixed(1)}K` : total;
};

export const CircleChartCardB = React.forwardRef<HTMLDivElement, Omit<CardProps, 'children'> & CircleChartBProps>(({className, title, total, unit, categories, color, chartData, ...props}, ref) => {
	return (
		<Card ref={ref} className={cn('min-h-[280px] border border-transparent dark:border-default-100', className)} {...props}>
			<div className='flex flex-col p-4 pb-0 gap-y-2'>
				<div className='flex items-center justify-between gap-x-2'>
					<dt>
						<h3 className='font-medium text-small text-primary-foreground'>{title}</h3>
					</dt>
					<div className='flex items-center justify-end gap-x-2'>
						<Dropdown
							classNames={{
								content: 'min-w-[120px]'
							}}
							placement='bottom-end'>
							<DropdownTrigger>
								<Button isIconOnly radius='full' size='sm' variant='light'>
									<Icon height={16} icon='solar:menu-dots-bold' width={16} />
								</Button>
							</DropdownTrigger>
							<DropdownMenu
								itemClasses={{
									title: 'text-tiny'
								}}
								variant='flat'>
								<DropdownItem key='view-details'>View Details</DropdownItem>
								<DropdownItem key='export-data'>Export Data</DropdownItem>
								<DropdownItem key='set-alert'>Set Alert</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					</div>
				</div>
			</div>
			<div className='flex items-center justify-center h-full gap-x-2 sm:flex-nowrap'>
				<ResponsiveContainer className='w-full max-w-[200px] [&_.recharts-surface]:outline-hidden' height={200} width='100%'>
					<PieChart accessibilityLayer margin={{top: 0, right: 0, left: 0, bottom: 0}}>
						<Tooltip
							content={({label, payload}) => (
								<div className='flex h-8 min-w-[120px] items-center gap-x-2 rounded-medium bg-background px-1 text-tiny shadow-small'>
									<span className='font-medium text-foreground'>{label}</span>
									{payload?.map((p, index) => {
										const name = p.name;
										const value = p.value;
										const category = categories.find(c => c.toLowerCase() === name) ?? name;

										return (
											<div key={`${index}-${name}`} className='flex items-center w-full gap-x-2'>
												<div
													className='flex-none w-2 h-2 rounded-full'
													style={{
														backgroundColor: `hsl(var(--heroui-${color}-${(index + 1) * 200}))`
													}}
												/>
												<div className='flex items-center justify-between w-full pr-1 text-sm gap-x-2 text-default-700'>
													<span className='text-primary-foreground'>{category}</span>
													<span className='font-mono font-medium text-default-700'>{formatTotalB(value as number)}</span>
												</div>
											</div>
										);
									})}
								</div>
							)}
							cursor={false}
						/>
						<Pie animationDuration={1000} animationEasing='ease' cornerRadius={12} data={chartData} dataKey='value' innerRadius='68%' nameKey='name' paddingAngle={-20} strokeWidth={0}>
							{chartData.map((_, index) => (
								<Cell key={`cell-${index}`} fill={`hsl(var(--heroui-${color}-${(index + 1) * 200}))`} />
							))}
							<Label
								content={({viewBox}) => {
									if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
										return (
											<text dominantBaseline='auto' textAnchor='middle' x={viewBox.cx} y={viewBox.cy}>
												<tspan fill='hsl(var(--heroui-default-700))' fontSize={20} fontWeight={600} x={viewBox.cx} y={viewBox.cy}>
													{formatTotalB(total)}
												</tspan>
												<tspan fill='hsl(var(--heroui-default-500))' fontSize={12} fontWeight={500} x={viewBox.cx} y={viewBox.cy! + 14}>
													{unit}
												</tspan>
											</text>
										);
									}

									return null;
								}}
								position='center'
							/>
						</Pie>
					</PieChart>
				</ResponsiveContainer>

				<div className='flex flex-col justify-center gap-4 p-4 text-tiny text-foreground/60'>
					{categories.map((category, index) => (
						<div key={index} className='flex items-center gap-2'>
							<span
								className='w-2 h-2 rounded-full'
								style={{
									backgroundColor: `hsl(var(--heroui-${color}-${(index + 1) * 200}))`
								}}
							/>
							<span className='cap'>{category}</span>
						</div>
					))}
				</div>
			</div>
		</Card>
	);
});

CircleChartCardB.displayName = 'CircleChartCardB'; // 显式设置 displayName
