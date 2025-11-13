import {Image} from '@heroui/image';
import {Link} from '@heroui/link';

import {MAIN_CONFIG, footerNavigation} from '@/config';
// import {LogoGrey} from '@/components/icons';
// import { Button } from '@heroui/button';
// import { Input } from '@heroui/input';
// import { ThemeSwitch } from '@/components/client';

export function Footer() {
	function renderList({title, items}: {title: string; items: {name: string; href: string}[]}) {
		return (
			<div>
				<h3 className='font-semibold text-small text-primary-foreground/60'>{title}</h3>
				<ul className='mt-6 space-y-4'>
					{items.map(item => (
						<li key={item.name}>
							<Link className='text-primary-foreground/30' href={item.href} size='sm'>
								{item.name}
							</Link>
						</li>
					))}
				</ul>
			</div>
		);
	}

	return (
		<footer className='flex flex-col w-full sm:p-6 md:p-4'>
			{/* lg:px-8 */}
			<div className='w-full mx-auto'>
				<div className='w-full border-b border-foreground/10' />
				<div className='xl:grid xl:grid-cols-3 xl:gap-6 mt-6'>
					<div className='space-y-6 md:pr-8'>
						<div className='flex items-center justify-start gap-1'>
							<Image src='/favicon-128x128.png' alt='logo' className='w-6 h-6' />
							{/* <LogoGrey size={32} /> */}
							<span className='font-medium text-medium'>{MAIN_CONFIG.name}</span>
						</div>
						<p className='text-small text-foreground/60'>{MAIN_CONFIG.title}</p>
						<div className='flex space-x-6'>
							{footerNavigation.social.map(item => (
								<Link key={item.name} isExternal className='text-foreground/60' href={item.href}>
									<span className='sr-only'>{item.name}</span>
									{<item.icon className='text-foreground/60' />}
								</Link>
							))}
						</div>
					</div>
					<div className=' grid-cols-2 gap-8 mt-16 xl:col-span-2 xl:mt-0 hidden md:grid'>
						<div className='md:grid md:grid-cols-2 md:gap-8'>
							<div>{renderList({title: 'Services', items: footerNavigation.services})}</div>
							<div className='mt-10 md:mt-0'>{renderList({title: 'Support', items: footerNavigation.supportOptions})}</div>
						</div>
						<div className='md:grid md:grid-cols-2 md:gap-8'>
							<div>{renderList({title: 'About Us', items: footerNavigation.aboutUs})}</div>
							<div className='mt-10 md:mt-0 '>{renderList({title: 'Legal', items: footerNavigation.legal})}</div>
						</div>
					</div>
				</div>

				<div className='flex flex-wrap justify-between gap-2 pt-4 mb-24 md:mb-0'>
					<p className='text-small text-foreground/60'>&copy; 2024 ClaimYour.X Inc. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
}
