'use client';
import React, {useMemo} from 'react';

import {Accordion, AccordionItem} from '@heroui/react';
import {useTranslations} from 'next-intl';

/**
 * FAQ项目接口
 */
export interface FaqItem {
	title: string;
	content: string;
}

/**
 * 关于我们组件 - 展示FAQ手风琴列表
 * 如果不传入faqs则使用内部默认配置
 * @param faqs FAQ项目数组（可选）
 */
export const About = ({faqs: externalFaqs}: {faqs?: FaqItem[]}) => {
	const tContent = useTranslations('content');

	// 内部默认的FAQ配置
	const defaultFaqs: FaqItem[] = useMemo(
		() =>
			Array.from({length: 3}, (_, i) => ({
				title: tContent(`faq.v${i + 1}.question`),
				content: tContent(`faq.v${i + 1}.answer`)
			})),
		[tContent]
	);

	// 使用外部传入的faqs或内部默认的faqs
	const faqs = externalFaqs ?? defaultFaqs;

	return (
		<section className='w-full mx-auto'>
			<div className='flex flex-col items-center w-full gap-8 mx-auto'>
				<Accordion
					fullWidth
					keepContentMounted
					itemClasses={{
						base: 'px-0 md:px-2 md:px-6',
						title: 'font-medium text-primary-foreground text-small',
						trigger: 'py-6 flex-row-reverse',
						content: 'pt-0 pb-6 text-sm text-primary-foreground/60',
						indicator: 'rotate-0 data-[open=true]:-rotate-45'
					}}
					items={faqs}
					selectionMode='multiple'>
					{faqs?.map((item: FaqItem) => (
						<AccordionItem key={item.title} title={item.title} className='text-left'>
							{item.content.split('\n').map((line, index) => (
								<React.Fragment key={`${item.title}-${index}`}>
									{line}
									<br />
								</React.Fragment>
							))}
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</section>
	);
};

About.displayName = 'About';
