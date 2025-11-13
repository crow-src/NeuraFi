import {Suspense} from 'react';
import {BottomNavbar} from '@/components/client';

export default function HomeLayout({children}: {children: React.ReactNode}) {
	return (
		<div className='flex flex-col gap-2 w-full'>
			{children}
			<Suspense fallback={<div>Loading...</div>}>
				<BottomNavbar />
			</Suspense>
		</div>
	);
}
