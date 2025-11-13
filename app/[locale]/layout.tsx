import {notFound} from 'next/navigation';
import {NextIntlClientProvider} from 'next-intl';
import {HotScroll} from '@/app/[locale]/(main)/components';
import {CommonModal, Sidebar} from '@/components/client';
import {Navbar, Footer} from '@/components/server'; // FloatingBanner,
import {routing} from '@/i18n/routing';

type Locale = 'en' | 'zh' | 'ja' | 'fr' | 'ru';

export default async function LocaleLayout({children, params}: {children: React.ReactNode; params: Promise<{locale: string}>}) {
	const {locale} = await params;
	if (!routing.locales.includes(locale as Locale)) {
		notFound();
	}

	return (
		<NextIntlClientProvider locale={locale}>
			<CommonModal />
			<div className='relative flex flex-col max-w-screen text-foreground w-full mx-auto'>
				<Navbar />
				<HotScroll className='sm:hidden' />
				<div className='flex w-full gap-1'>
					<Sidebar className='hidden md:block' />
					{children}
				</div>
				<Footer />
			</div>
		</NextIntlClientProvider>
	);
}
