'use client';

import {useState} from 'react';
import {Tabs, Tab} from '@heroui/react';
import {TabsClass} from '@/components/class';
import {NFTGrid} from '../components';
import {blindBoxItems} from './data_test';

export type BlindBoxCategory = {
	type: string;
	label: string;
};

export const blindBoxCategories: BlindBoxCategory[] = [
	{type: 'rwa', label: 'RWA'},
	{type: 'cards', label: '卡牌'},
	{type: 'toys', label: '玩具'},
	{type: 'sports', label: '体育'},
	{type: 'art', label: '艺术'},
	{type: 'welfare', label: '福利'}
];

// ===== 主视图 【盲盒列表】=====
export function BlindBoxView() {
	const [selectedTab, setSelectedTab] = useState<string>(blindBoxCategories[0]?.type ?? 'rwa');

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
