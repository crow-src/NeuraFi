'use client';

import {useState} from 'react';
import {Tabs, Tab} from '@heroui/react';
import {useTranslations} from 'next-intl';
import {TabsClass} from '@/components/class';
import {NFTGrid} from '../components';
import {blindBoxItems} from './data_test';

export type BlindBoxCategory = {
	type: string;
	label: string;
};

// ===== 主视图 【盲盒列表】=====
export function BlindBoxView() {
	const t = useTranslations('common');
	const [selectedTab, setSelectedTab] = useState<string>('rwa');

	const blindBoxCategories: BlindBoxCategory[] = [
		{type: 'rwa', label: t('rwa')},
		{type: 'cards', label: t('cards')},
		{type: 'toys', label: t('toys')},
		{type: 'sports', label: t('sports')},
		{type: 'art', label: t('art')},
		{type: 'welfare', label: t('welfare')}
	];

	return (
		<div className='w-full flex flex-col p-4 pt-0 border-b border-primary-border/30 '>
			{/* 盲盒分类标签页 */}
			<Tabs selectedKey={selectedTab} onSelectionChange={key => setSelectedTab(String(key))} variant='underlined' classNames={TabsClass}>
				{blindBoxCategories.map(category => {
					const items = blindBoxItems.filter(item => item.type === category.type);
					return (
						<Tab key={category.type} title={category.label}>
							<div className='flex flex-col gap-4 py-4'>
								<NFTGrid
									nfts={items}
									mode='blindbox'
									onPurchase={(id, qty) => {
										console.info('mint blindbox', id, qty);
									}}
								/>
							</div>
						</Tab>
					);
				})}
			</Tabs>
		</div>
	);
}
