import {Suspense} from 'react';
import {TabContent} from './components/TabContent';

// 添加这个函数来支持静态导出
export async function generateStaticParams() {
	return [{locale: 'zh'}, {locale: 'en'}, {locale: 'ja'}, {locale: 'fr'}, {locale: 'ru'}];
}

export default function Home() {
	return (
		<div className='w-full flex flex-col gap-2'>
			<div className='flex-1 flex w-full gap-2'>
				<Suspense fallback={<div>Loading...</div>}>
					<TabContent />
				</Suspense>
			</div>
			{/* <span className='min-h-20' /> */}
		</div>
	);
}
