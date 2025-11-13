'use client';
import {useEffect} from 'react';
import {Button} from '@heroui/button';
import {Icon} from '@iconify/react';

export default function Error({error, reset}: {error: Error; reset: () => void}) {
	useEffect(() => {
		// Log the error to an error reporting service

		console.error(error);
	}, [error]);

	return (
		<div className='flex flex-col items-center justify-center min-h-screen'>
			<Icon icon='ix:error-multiple' className='text-primary w-32 h-32' />
			<h2 className='text-primary-foreground text-2xl font-bold'>Something went wrong!</h2>
			<Button onPress={() => reset()} color='primary' className='mt-4 text-black'>
				Try again
			</Button>
		</div>
	);
}
