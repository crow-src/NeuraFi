'use client';
import React, {useMemo} from 'react';
import {Accordion, AccordionItem} from '@heroui/react';
import {Icon} from '@iconify/react';
import {useTranslations} from 'next-intl';

//常用可复用的组件

//没有数据显示的组件

export const NoData = () => {
	return (
		<div className='flex items-center justify-center h-full'>
			<Icon icon='mdi:information-outline' className='w-10 h-10 text-primary' />
			<span className='text-primary-foreground'>No data</span>
		</div>
	);
};
//没有数据显示的组件
