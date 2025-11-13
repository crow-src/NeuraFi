import {Button} from '@heroui/button';
import {Icon} from '@iconify/react';

export default function NotFound() {
	return (
		<div className='flex flex-col items-center justify-center min-h-screen'>
			<Icon icon='fluent:globe-error-20-regular' className='text-primary-foreground w-16 h-16' />
			<h2 className='text-primary-foreground text-2xl font-bold'>Not Found</h2>
			<Button color='primary' href='/' className='mt-4 text-black'>
				Return Home
			</Button>
		</div>
	);
}
