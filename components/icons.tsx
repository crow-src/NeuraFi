import {SVGProps} from 'react';

export type IconSvgProps = SVGProps<SVGSVGElement> & {size?: number};

export const Logo = ({size = 24, width, height, ...props}: IconSvgProps) => (
	<svg aria-hidden='true' focusable='false' height={size || height} role='presentation' viewBox='0 0 32 32' width={size || width} {...props}>
		<g fill='none'>
			<path fill='#ffdea7' d='M13.98 2.54a3.992 3.992 0 0 0 2.52 5.546a3.992 3.992 0 0 0 2.52-5.546c-.14-.31.16-.63.47-.51c.25.1.49.22.72.38a4.012 4.012 0 0 1 1.34 5.18a3.993 3.993 0 0 1-5.05 1.855a3.993 3.993 0 0 1-5.05-1.855c-.94-1.8-.36-4.06 1.34-5.18c.23-.16.47-.28.72-.38c.31-.12.61.2.47.51' />
			<path fill='#d3d3d3' d='m20.5 7.5l-4-1.5h-4.81c-.47 0-.93.07-1.36.2c-.48.14-1.2.64-1.33 1.2v15.07h16V10.69c0-.298-.028-.59-.081-.873z' />
			<path fill='#636363' d='M6.09 10h.965c-.03.171-.05.348-.055.53v9.64l9-1.54v-4.51c0-2.58-1.28-4.98-3.42-6.41a3.561 3.561 0 0 0-2.686-.548A4.094 4.094 0 0 0 5.9 4H2.62c-.34 0-.62.28-.62.62v1.29C2 8.17 3.83 10 6.09 10M22 10h3.91C28.17 10 30 8.17 30 5.91V4.62c0-.34-.28-.62-.63-.62h-3.28a4.09 4.09 0 0 0-3.752 2.46A4.677 4.677 0 0 0 20.31 6H16l2.38 2.38A5.537 5.537 0 0 0 22 9.992z' />
			<path fill='#212121' d='M11 15c0 .55.45 1 1 1s1-.45 1-1v-1c0-.55-.45-1-1-1s-1 .45-1 1zm9 1c.55 0 1-.45 1-1v-1c0-.55-.45-1-1-1s-1 .45-1 1v1c0 .55.45 1 1 1' />
			<path fill='#fbb8ab' d='M5.91 5.5c1.17 0 2.17.78 2.48 1.85c-.34.34-.62.73-.85 1.15H6.09A2.59 2.59 0 0 1 3.5 5.91v-.2c0-.12.09-.21.21-.21zm20.18 0c-1.17 0-2.17.78-2.48 1.85c.34.33.63.72.85 1.15h1.45a2.59 2.59 0 0 0 2.59-2.59v-.2c0-.12-.09-.21-.21-.21zM20.48 17c2.99-.01 5.48 2.41 5.52 5.42A5.502 5.502 0 0 1 20.5 28h-.309l-4.203.957L11.813 28H11.5c-3.06 0-5.54-2.5-5.5-5.58c.04-3.03 2.58-5.48 5.61-5.42z' />
			<path fill='#ff8687' d='M13 22a1 1 0 1 0 0-2a1 1 0 0 0 0 2m7.304 6A5.638 5.638 0 0 1 16 29.99A5.637 5.637 0 0 1 11.696 28zM20 21a1 1 0 1 1-2 0a1 1 0 0 1 2 0' />
		</g>
	</svg>
);

export const LogoGrey = ({size = 24, width, height, ...props}: IconSvgProps) => (
	<svg aria-hidden='true' focusable='false' height={size || height} role='presentation' viewBox='0 0 48 48' width={size || width} {...props}>
		<g fill='currentColor'>
			<path
				fillRule='evenodd'
				d='M29 13.48a1 1 0 0 1-1-1V7.882a10 10 0 0 0-3-.807v3.405a1 1 0 0 1-2 0V7.02a8.9 8.9 0 0 0-3 .69v4.77a1 1 0 0 1-2 0V8.955a7.5 7.5 0 0 0-2.04 2.808q-.144.12-.282.25c-.243.91-.217 1.672-.045 2.15a1 1 0 0 1-1.882.676a4 4 0 0 1-.148-.525c-1.466 2.051-.114 3.533 2.493 4.447a8 8 0 1 0 15.809 0c2.611-.916 3.963-2.402 2.484-4.459q-.06.27-.15.53a1 1 0 1 1-1.887-.662c.195-.556.2-1.295-.017-2.098a4 4 0 0 0-.236-.122c-.402-.99-1.104-1.983-2.099-2.818v3.35a1 1 0 0 1-1 1m-4.356 6.375a1.5 1.5 0 1 0-1.288-2.71a1.5 1.5 0 0 0 1.288 2.71M24 22c1.51 0 2.796-.956 3.287-2.295a27 27 0 0 0 2.674-.391Q30 19.652 30 20a6 6 0 1 1-11.961-.686c.842.17 1.742.3 2.674.39A3.5 3.5 0 0 0 24 22'
				clipRule='evenodd'
			/>
			<path d='M25 7a1 1 0 1 0-2 0z' />
			<path fillRule='evenodd' d='M28.466 28.4c1.15.184 2.348.43 3.534.735V42H16V29.135a40 40 0 0 1 3.534-.735L23 31h2zM26 37a2 2 0 1 1-4 0a2 2 0 0 1 4 0' clipRule='evenodd' />
			<path d='M12 30.425a29 29 0 0 1 2-.717V42h-2zm22-.717c.687.22 1.357.459 2 .717V42h-2zm-24 1.637C7.635 32.597 6 34.167 6 36v6h4zM42 36c0-1.833-1.635-3.404-4-4.655V42h4z' />
		</g>
	</svg>
);

export const MoonFilledIcon = ({size = 24, width, height, ...props}: IconSvgProps) => (
	<svg aria-hidden='true' focusable='false' height={size || height} role='presentation' viewBox='0 0 24 24' width={size || width} {...props}>
		<path fill='currentColor' fillRule='evenodd' d='M22 12c0 5.523-4.477 10-10 10a9.986 9.986 0 0 1-3.321-.564A8.973 8.973 0 0 1 8 18a8.97 8.97 0 0 1 2.138-5.824A6.493 6.493 0 0 0 15.5 15a6.496 6.496 0 0 0 5.567-3.143c.24-.396.933-.32.933.143' clipRule='evenodd' opacity='0.5' />
		<path fill='currentColor' d='M2 12c0 4.359 2.789 8.066 6.679 9.435A8.973 8.973 0 0 1 8 18c0-2.221.805-4.254 2.138-5.824A6.47 6.47 0 0 1 9 8.5a6.496 6.496 0 0 1 3.143-5.567C12.54 2.693 12.463 2 12 2C6.477 2 2 6.477 2 12' />
	</svg>
);

export const SunFilledIcon = ({size = 24, width, height, ...props}: IconSvgProps) => (
	<svg aria-hidden='true' focusable='false' height={size || height} role='presentation' viewBox='0 0 48 48' width={size || width} {...props}>
		<defs>
			<mask id='ipTSunOne0'>
				<g fill='none'>
					<path fill='#555' stroke='#fff' strokeLinejoin='round' strokeWidth='4' d='M24 37c7.18 0 13-5.82 13-13s-5.82-13-13-13s-13 5.82-13 13s5.82 13 13 13Z' />
					<path fill='#fff' d='M24 6a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5m14.5 6a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5m6 14.5a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5m-6 14.5a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5M24 47a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5M9.5 41a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5m-6-14.5a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5m6-14.5a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5' />
				</g>
			</mask>
		</defs>
		<path fill='currentColor' d='M0 0h48v48H0z' mask='url(#ipTSunOne0)' />
	</svg>
);

export const SearchIcon = ({size = 24, width, height, ...props}: IconSvgProps) => (
	<svg aria-hidden='true' focusable='false' height={size || height} role='presentation' viewBox='0 0 24 24' width={size || width} {...props}>
		<path d='M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' />
		<path d='M22 22L20 20' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' />
	</svg>
);

export const GithubIcon = ({size = 24, width, height, ...props}: IconSvgProps) => (
	<svg aria-hidden='true' focusable='false' height={size || height} role='presentation' viewBox='0 0 24 24' width={size || width} {...props}>
		<path
			fill='currentColor'
			d='M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499.09.679-.217.679-.481 0-.237-.008-.865-.011-1.696-2.775.602-3.361-1.338-3.361-1.338-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605 1.002.07 1.527 1.028 1.527 1.028.89 1.524 2.336 1.084 2.902.829.091-.645.351-1.085.635-1.334-2.214-.251-4.542-1.107-4.542-4.93 0-1.087.389-1.979 1.024-2.675-.101-.253-.446-1.268.099-2.64 0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336 9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021.545 1.372.203 2.387.099 2.64.64.696 1.024 1.587 1.024 2.675 0 3.833-2.33 4.675-4.552 4.922.355.308.675.916.675 1.846 0 1.334-.012 2.41-.012 2.737 0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974 22 6.465 17.535 2 12.026 2z'
		/>
	</svg>
);

export const TelegramIcon = ({size = 24, width, height, ...props}: IconSvgProps) => (
	<svg aria-hidden='true' focusable='false' height={size || height} role='presentation' viewBox='0 0 24 24' width={size || width} {...props}>
		<path
			fill='currentColor'
			d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19c-.14.75-.42 1-.68 1.03c-.58.05-1.02-.38-1.58-.75c-.88-.58-1.38-.94-2.23-1.5c-.99-.65-.35-1.01.22-1.59c.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02c-.09.02-1.49.95-4.22 2.79c-.4.27-.76.41-1.08.4c-.36-.01-1.04-.2-1.55-.37c-.63-.2-1.12-.31-1.08-.66c.02-.18.27-.36.74-.55c2.92-1.27 4.86-2.11 5.83-2.51c2.78-1.16 3.35-1.36 3.73-1.36c.08 0 .27.02.39.12c.1.08.13.19.14.27c-.01.06.01.24 0 .38'></path>
	</svg>
);

export const TwitterIcon = ({size = 24, width, height, ...props}: IconSvgProps) => (
	<svg aria-hidden='true' focusable='false' height={size || height} role='presentation' viewBox='0 0 24 24' width={size || width} {...props}>
		<path fill='currentColor' d='M18.205 2.25h3.308l-7.227 8.26l8.502 11.24H16.13l-5.214-6.817L4.95 21.75H1.64l7.73-8.835L1.215 2.25H8.04l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z'></path>
	</svg>
);

export const DiscordIcon = ({size = 24, width, height, ...props}: IconSvgProps) => (
	<svg aria-hidden='true' focusable='false' height={size || height} role='presentation' viewBox='0 0 24 24' width={size || width} {...props}>
		<path
			fill='currentColor'
			d='M14.82 4.26a10.14 10.14 0 0 0-.53 1.1 14.66 14.66 0 0 0-4.58 0 10.14 10.14 0 0 0-.53-1.1 16 16 0 0 0-4.13 1.3 17.33 17.33 0 0 0-3 11.59 16.6 16.6 0 0 0 5.07 2.59A12.89 12.89 0 0 0 8.23 18a9.65 9.65 0 0 1-1.71-.83 3.39 3.39 0 0 0 .42-.33 11.66 11.66 0 0 0 10.12 0q.21.18.42.33a10.84 10.84 0 0 1-1.71.84 12.41 12.41 0 0 0 1.08 1.78 16.44 16.44 0 0 0 5.06-2.59 17.22 17.22 0 0 0-3-11.59 16.09 16.09 0 0 0-4.09-1.35zM8.68 14.81a1.94 1.94 0 0 1-1.8-2 1.93 1.93 0 0 1 1.8-2 1.93 1.93 0 0 1 1.8 2 1.93 1.93 0 0 1-1.8 2zm6.64 0a1.94 1.94 0 0 1-1.8-2 1.93 1.93 0 0 1 1.8-2 1.92 1.92 0 0 1 1.8 2 1.92 1.92 0 0 1-1.8 2z'
		/>
	</svg>
);

export const LoadingIcon = ({size = 24, width, height, ...props}: IconSvgProps) => (
	<svg aria-hidden='true' focusable='false' height={size || height} role='presentation' viewBox='0 0 24 24' width={size || width} {...props}>
		<rect width='7.33' height='7.33' x='1' y='1' fill='currentColor'>
			<animate id='svgSpinnersBlocksWave0' attributeName='x' begin='0;svgSpinnersBlocksWave1.end+0.2s' dur='0.6s' values='1;4;1' />
			<animate attributeName='y' begin='0;svgSpinnersBlocksWave1.end+0.2s' dur='0.6s' values='1;4;1' />
			<animate attributeName='width' begin='0;svgSpinnersBlocksWave1.end+0.2s' dur='0.6s' values='7.33;1.33;7.33' />
			<animate attributeName='height' begin='0;svgSpinnersBlocksWave1.end+0.2s' dur='0.6s' values='7.33;1.33;7.33' />
		</rect>
		<rect width='7.33' height='7.33' x='8.33' y='1' fill='currentColor'>
			<animate attributeName='x' begin='svgSpinnersBlocksWave0.begin+0.1s' dur='0.6s' values='8.33;11.33;8.33' />
			<animate attributeName='y' begin='svgSpinnersBlocksWave0.begin+0.1s' dur='0.6s' values='1;4;1' />
			<animate attributeName='width' begin='svgSpinnersBlocksWave0.begin+0.1s' dur='0.6s' values='7.33;1.33;7.33' />
			<animate attributeName='height' begin='svgSpinnersBlocksWave0.begin+0.1s' dur='0.6s' values='7.33;1.33;7.33' />
		</rect>
		<rect width='7.33' height='7.33' x='1' y='8.33' fill='currentColor'>
			<animate attributeName='x' begin='svgSpinnersBlocksWave0.begin+0.1s' dur='0.6s' values='1;4;1' />
			<animate attributeName='y' begin='svgSpinnersBlocksWave0.begin+0.1s' dur='0.6s' values='8.33;11.33;8.33' />
			<animate attributeName='width' begin='svgSpinnersBlocksWave0.begin+0.1s' dur='0.6s' values='7.33;1.33;7.33' />
			<animate attributeName='height' begin='svgSpinnersBlocksWave0.begin+0.1s' dur='0.6s' values='7.33;1.33;7.33' />
		</rect>
		<rect width='7.33' height='7.33' x='15.66' y='1' fill='currentColor'>
			<animate attributeName='x' begin='svgSpinnersBlocksWave0.begin+0.2s' dur='0.6s' values='15.66;18.66;15.66' />
			<animate attributeName='y' begin='svgSpinnersBlocksWave0.begin+0.2s' dur='0.6s' values='1;4;1' />
			<animate attributeName='width' begin='svgSpinnersBlocksWave0.begin+0.2s' dur='0.6s' values='7.33;1.33;7.33' />
			<animate attributeName='height' begin='svgSpinnersBlocksWave0.begin+0.2s' dur='0.6s' values='7.33;1.33;7.33' />
		</rect>
		<rect width='7.33' height='7.33' x='8.33' y='8.33' fill='currentColor'>
			<animate attributeName='x' begin='svgSpinnersBlocksWave0.begin+0.2s' dur='0.6s' values='8.33;11.33;8.33' />
			<animate attributeName='y' begin='svgSpinnersBlocksWave0.begin+0.2s' dur='0.6s' values='8.33;11.33;8.33' />
			<animate attributeName='width' begin='svgSpinnersBlocksWave0.begin+0.2s' dur='0.6s' values='7.33;1.33;7.33' />
			<animate attributeName='height' begin='svgSpinnersBlocksWave0.begin+0.2s' dur='0.6s' values='7.33;1.33;7.33' />
		</rect>
		<rect width='7.33' height='7.33' x='1' y='15.66' fill='currentColor'>
			<animate attributeName='x' begin='svgSpinnersBlocksWave0.begin+0.2s' dur='0.6s' values='1;4;1' />
			<animate attributeName='y' begin='svgSpinnersBlocksWave0.begin+0.2s' dur='0.6s' values='15.66;18.66;15.66' />
			<animate attributeName='width' begin='svgSpinnersBlocksWave0.begin+0.2s' dur='0.6s' values='7.33;1.33;7.33' />
			<animate attributeName='height' begin='svgSpinnersBlocksWave0.begin+0.2s' dur='0.6s' values='7.33;1.33;7.33' />
		</rect>
		<rect width='7.33' height='7.33' x='15.66' y='8.33' fill='currentColor'>
			<animate attributeName='x' begin='svgSpinnersBlocksWave0.begin+0.3s' dur='0.6s' values='15.66;18.66;15.66' />
			<animate attributeName='y' begin='svgSpinnersBlocksWave0.begin+0.3s' dur='0.6s' values='8.33;11.33;8.33' />
			<animate attributeName='width' begin='svgSpinnersBlocksWave0.begin+0.3s' dur='0.6s' values='7.33;1.33;7.33' />
			<animate attributeName='height' begin='svgSpinnersBlocksWave0.begin+0.3s' dur='0.6s' values='7.33;1.33;7.33' />
		</rect>
		<rect width='7.33' height='7.33' x='8.33' y='15.66' fill='currentColor'>
			<animate attributeName='x' begin='svgSpinnersBlocksWave0.begin+0.3s' dur='0.6s' values='8.33;11.33;8.33' />
			<animate attributeName='y' begin='svgSpinnersBlocksWave0.begin+0.3s' dur='0.6s' values='15.66;18.66;15.66' />
			<animate attributeName='width' begin='svgSpinnersBlocksWave0.begin+0.3s' dur='0.6s' values='7.33;1.33;7.33' />
			<animate attributeName='height' begin='svgSpinnersBlocksWave0.begin+0.3s' dur='0.6s' values='7.33;1.33;7.33' />
		</rect>
		<rect width='7.33' height='7.33' x='15.66' y='15.66' fill='currentColor'>
			<animate id='svgSpinnersBlocksWave1' attributeName='x' begin='svgSpinnersBlocksWave0.begin+0.4s' dur='0.6s' values='15.66;18.66;15.66' />
			<animate attributeName='y' begin='svgSpinnersBlocksWave0.begin+0.4s' dur='0.6s' values='15.66;18.66;15.66' />
			<animate attributeName='width' begin='svgSpinnersBlocksWave0.begin+0.4s' dur='0.6s' values='7.33;1.33;7.33' />
			<animate attributeName='height' begin='svgSpinnersBlocksWave0.begin+0.4s' dur='0.6s' values='7.33;1.33;7.33' />
		</rect>
	</svg>
);

// 加载
export const SvgSpinnersBlocksShuffle3 = ({size = 24, width, height, ...props}: IconSvgProps) => (
	<svg aria-hidden='true' focusable='false' height={size || height} role='presentation' viewBox='0 0 24 24' width={size || width} {...props}>
		<rect width={10} height={10} x={1} y={1} fill='currentColor' rx={1}>
			<animate id='svgSpinnersBlocksShuffle30' fill='freeze' attributeName='x' begin='0;svgSpinnersBlocksShuffle3b.end' dur='0.2s' values='1;13'></animate>
			<animate id='svgSpinnersBlocksShuffle31' fill='freeze' attributeName='y' begin='svgSpinnersBlocksShuffle38.end' dur='0.2s' values='1;13'></animate>
			<animate id='svgSpinnersBlocksShuffle32' fill='freeze' attributeName='x' begin='svgSpinnersBlocksShuffle39.end' dur='0.2s' values='13;1'></animate>
			<animate id='svgSpinnersBlocksShuffle33' fill='freeze' attributeName='y' begin='svgSpinnersBlocksShuffle3a.end' dur='0.2s' values='13;1'></animate>
		</rect>
		<rect width={10} height={10} x={1} y={13} fill='currentColor' rx={1}>
			<animate id='svgSpinnersBlocksShuffle34' fill='freeze' attributeName='y' begin='svgSpinnersBlocksShuffle30.end' dur='0.2s' values='13;1'></animate>
			<animate id='svgSpinnersBlocksShuffle35' fill='freeze' attributeName='x' begin='svgSpinnersBlocksShuffle31.end' dur='0.2s' values='1;13'></animate>
			<animate id='svgSpinnersBlocksShuffle36' fill='freeze' attributeName='y' begin='svgSpinnersBlocksShuffle32.end' dur='0.2s' values='1;13'></animate>
			<animate id='svgSpinnersBlocksShuffle37' fill='freeze' attributeName='x' begin='svgSpinnersBlocksShuffle33.end' dur='0.2s' values='13;1'></animate>
		</rect>
		<rect width={10} height={10} x={13} y={13} fill='currentColor' rx={1}>
			<animate id='svgSpinnersBlocksShuffle38' fill='freeze' attributeName='x' begin='svgSpinnersBlocksShuffle34.end' dur='0.2s' values='13;1'></animate>
			<animate id='svgSpinnersBlocksShuffle39' fill='freeze' attributeName='y' begin='svgSpinnersBlocksShuffle35.end' dur='0.2s' values='13;1'></animate>
			<animate id='svgSpinnersBlocksShuffle3a' fill='freeze' attributeName='x' begin='svgSpinnersBlocksShuffle36.end' dur='0.2s' values='1;13'></animate>
			<animate id='svgSpinnersBlocksShuffle3b' fill='freeze' attributeName='y' begin='svgSpinnersBlocksShuffle37.end' dur='0.2s' values='1;13'></animate>
		</rect>
	</svg>
);

// Home
export const HomeIcon = ({size = 24, width, height, ...props}: IconSvgProps) => (
	<svg aria-hidden='true' focusable='false' height={size || height} role='presentation' viewBox='0 0 24 24' width={size || width} {...props}>
		<path fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M12 18v-3m-9.648-1.786c-.354-2.298-.53-3.446-.096-4.465s1.398-1.715 3.325-3.108L7.021 4.6C9.418 2.867 10.617 2 12.001 2c1.382 0 2.58.867 4.978 2.6l1.44 1.041c1.927 1.393 2.89 2.09 3.325 3.108c.434 1.019.258 2.167-.095 4.464l-.301 1.96c-.5 3.256-.751 4.884-1.919 5.856S16.554 22 13.14 22h-2.28c-3.415 0-5.122 0-6.29-.971c-1.168-.972-1.418-2.6-1.918-5.857z' color='currentColor' />
	</svg>
);

// Market
export const MarketIcon = ({size = 24, width, height, ...props}: IconSvgProps) => (
	<svg aria-hidden='true' focusable='false' height={size || height} role='presentation' viewBox='0 0 16 16' width={size || width} {...props}>
		<path fill='none' stroke='currentColor' strokeLinejoin='round' d='M3 7.5h2.5m0 0V6m0 1.5H8m0 0V6m0 1.5h2.5m0 0V6m0 1.5H13m-6.5 2h1m1 0h1m-1 1.5h1m-3 0h1m-4 2.5v-6h-1v-2l1.5-3h8l1.5 3v2h-1v6z' />
	</svg>
);

// Mint
export const MintIcon = ({size = 24, width, height, ...props}: IconSvgProps) => (
	<svg aria-hidden='true' focusable='false' height={size || height} role='presentation' viewBox='0 0 24 24' width={size || width} {...props}>
		<path fill='currentColor' d='M8.422 20.618C10.178 21.54 11.056 22 12 22V12L2.638 7.073a3.196 3.196 0 0 0-.04.067C2 8.154 2 9.417 2 11.942v.117c0 2.524 0 3.787.597 4.801c.598 1.015 1.674 1.58 3.825 2.709z' />
		<path fill='currentColor' d='m17.577 4.432l-2-1.05C13.822 2.461 12.944 2 12 2c-.945 0-1.822.46-3.578 1.382l-2 1.05C4.318 5.536 3.242 6.1 2.638 7.072L12 12l9.362-4.927c-.606-.973-1.68-1.537-3.785-2.641' opacity='0.7' />
		<path fill='currentColor' d='M21.403 7.14a3.153 3.153 0 0 0-.041-.067L12 12v10c.944 0 1.822-.46 3.578-1.382l2-1.05c2.151-1.129 3.227-1.693 3.825-2.708c.597-1.014.597-2.277.597-4.8v-.117c0-2.525 0-3.788-.597-4.802' opacity='0.5' />
		<path fill='currentColor' d='m6.323 4.484l.1-.052l1.493-.784l9.1 5.005l4.025-2.011c.137.155.257.32.362.498c.15.254.262.524.346.825L17.75 9.964V13a.75.75 0 0 1-1.5 0v-2.286l-3.5 1.75v9.44A3.062 3.062 0 0 1 12 22c-.248 0-.493-.032-.75-.096v-9.44l-8.998-4.5c.084-.3.196-.57.346-.824a3.15 3.15 0 0 1 .362-.498l9.04 4.52l3.387-1.693z' />
	</svg>
);

export const AirdropIcon = ({size = 24, width, height, ...props}: IconSvgProps) => (
	<svg aria-hidden='true' focusable='false' height={size || height} role='presentation' viewBox='0 0 24 24' width={size || width} {...props}>
		<g fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' color='currentColor'>
			<path d='M20 8.933C20 14 14.461 18 12 18s-8-4-8-9.067C4 5.104 7.582 2 12 2s8 3.104 8 6.933' />
			<path d='M15 8.933C15 14 12.923 18 12 18s-3-4-3-9.067C9 5.104 10.343 2 12 2s3 3.104 3 6.933M9 20c0-.465 0-.698.051-.888a1.5 1.5 0 0 1 1.06-1.06C10.303 18 10.536 18 11 18h2c.465 0 .697 0 .888.051a1.5 1.5 0 0 1 1.06 1.06c.052.191.052.424.052.889s0 .698-.051.888a1.5 1.5 0 0 1-1.06 1.06C13.697 22 13.464 22 13 22h-2c-.465 0-.697 0-.888-.051a1.5 1.5 0 0 1-1.06-1.06C9 20.697 9 20.464 9 20' />
		</g>
	</svg>
);

export const RobotIcon = ({size = 24, width, height, ...props}: IconSvgProps) => (
	<svg aria-hidden='true' focusable='false' height={size || height} role='presentation' viewBox='0 0 15 15' width={size || width} {...props}>
		<path fill='none' stroke='currentColor' d='M7.5 2.5a5 5 0 0 1 5 5v6a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-6a5 5 0 0 1 5-5Zm0 0V0M4 11.5h7M.5 8v4m14-4v4m-9-2.5a1 1 0 1 1 0-2a1 1 0 0 1 0 2Zm4 0a1 1 0 1 1 0-2a1 1 0 0 1 0 2Z' />
	</svg>
);

export const SwapIcon = ({size = 24, width, height, ...props}: IconSvgProps) => (
	<svg aria-hidden='true' focusable='false' height={size || height} role='presentation' viewBox='0 0 24 24' width={size || width} {...props}>
		<g fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' color='currentColor'>
			<path d='M14 18a8 8 0 1 0 0-16a8 8 0 0 0 0 16M3.1 11a7.179 7.179 0 0 0 9.9 9.9' />
			<path d='M12 10h3.5M12 10V6.5h2M12 10v3.5h2m1.5-3.5c.828 0 1.5-.784 1.5-1.75s-.672-1.75-1.5-1.75H14m1.5 3.5c.828 0 1.5.784 1.5 1.75s-.672 1.75-1.5 1.75H14m0 0v1m0-8v-1' />
		</g>
	</svg>
);

export const UserIcon = ({size = 24, width, height, ...props}: IconSvgProps) => (
	<svg aria-hidden='true' focusable='false' height={size || height} role='presentation' viewBox='0 0 24 24' width={size || width} {...props}>
		<g fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' color='currentColor'>
			<path d='M13 21.95q-.493.05-1 .05C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10q0 .507-.05 1' />
			<path d='M7.5 17c1.402-1.469 3.521-2.096 5.5-1.806M14.495 9.5c0 1.38-1.12 2.5-2.503 2.5a2.5 2.5 0 0 1-2.504-2.5c0-1.38 1.12-2.5 2.504-2.5a2.5 2.5 0 0 1 2.503 2.5' />
			<circle cx='18.5' cy='18.5' r='3.5' />
		</g>
	</svg>
);

export const BankIcon = ({size = 24, width, height, ...props}: IconSvgProps) => (
	<svg aria-hidden='true' focusable='false' height={size || height} role='presentation' viewBox='0 0 24 24' width={size || width} {...props}>
		<path fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M2 8.57c0-1.197.482-1.93 1.48-2.486l4.11-2.287C9.743 2.6 10.82 2 12 2s2.257.6 4.41 1.797l4.11 2.287C21.517 6.64 22 7.373 22 8.57c0 .324 0 .487-.035.62c-.186.7-.821.811-1.434.811H3.469c-.613 0-1.247-.11-1.434-.811C2 9.056 2 8.893 2 8.569M11.996 7h.009M4 10v8.5M8 10v8.5m8-8.5v8.5m4-8.5v8.5m-1 0H5a3 3 0 0 0-3 3a.5.5 0 0 0 .5.5h19a.5.5 0 0 0 .5-.5a3 3 0 0 0-3-3' color='currentColor' />
	</svg>
);

export const LanguageIcon = ({size = 24, width, height, ...props}: IconSvgProps) => (
	<svg aria-hidden='true' focusable='false' height={size || height} role='presentation' viewBox='0 0 24 24' width={size || width} {...props}>
		<path
			fill='currentColor'
			d='M5.08 8h2.95c.32-1.25.78-2.45 1.38-3.56c-1.84.63-3.37 1.9-4.33 3.56m2.42 4c0-.68.06-1.34.14-2H4.26c-.16.64-.26 1.31-.26 2s.1 1.36.26 2h3.38c-.08-.66-.14-1.32-.14-2m-2.42 4a8 8 0 0 0 4.33 3.56A15.7 15.7 0 0 1 8.03 16zM12 4.04c-.83 1.2-1.48 2.53-1.91 3.96h3.82c-.43-1.43-1.08-2.76-1.91-3.96M18.92 8a8.03 8.03 0 0 0-4.33-3.56c.6 1.11 1.06 2.31 1.38 3.56zM12 19.96c.83-1.2 1.48-2.53 1.91-3.96h-3.82c.43 1.43 1.08 2.76 1.91 3.96m2.59-.4A8.03 8.03 0 0 0 18.92 16h-2.95a15.7 15.7 0 0 1-1.38 3.56M19.74 10h-3.38c.08.66.14 1.32.14 2s-.06 1.34-.14 2h3.38c.16-.64.26-1.31.26-2s-.1-1.36-.26-2M9.66 10c-.09.65-.16 1.32-.16 2s.07 1.34.16 2h4.68c.09-.66.16-1.32.16-2s-.07-1.35-.16-2z'
			opacity='0.3'
		/>
		<path
			fill='currentColor'
			d='M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2m6.93 6h-2.95a15.7 15.7 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.92 8M12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96M4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A8 8 0 0 1 5.08 16m2.95-8H5.08a8 8 0 0 1 4.33-3.56A15.7 15.7 0 0 0 8.03 8M12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96M14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2m.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56M16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2z'
		/>
	</svg>
);

export const CopyIcon = ({size = 24, width, height, ...props}: IconSvgProps) => (
	<svg aria-hidden='true' focusable='false' height={size || height} role='presentation' viewBox='0 0 24 24' width={size || width} {...props}>
		<path fill='currentColor' d='M6.6 11.397c0-2.726 0-4.089.843-4.936c.844-.847 2.201-.847 4.917-.847h2.88c2.715 0 4.073 0 4.916.847c.844.847.844 2.21.844 4.936v4.82c0 2.726 0 4.089-.844 4.936c-.843.847-2.201.847-4.916.847h-2.88c-2.716 0-4.073 0-4.917-.847c-.843-.847-.843-2.21-.843-4.936z' />
		<path fill='currentColor' d='M4.172 3.172C3 4.343 3 6.229 3 10v2c0 3.771 0 5.657 1.172 6.828c.617.618 1.433.91 2.62 1.048c-.192-.84-.192-1.996-.192-3.66v-4.819c0-2.726 0-4.089.843-4.936c.844-.847 2.201-.847 4.917-.847h2.88c1.652 0 2.8 0 3.638.19c-.138-1.193-.43-2.012-1.05-2.632C16.657 2 14.771 2 11 2C7.229 2 5.343 2 4.172 3.172' opacity='0.5' />
	</svg>
);

export const MiningIcon = ({size = 24, width, height, ...props}: IconSvgProps) => (
	<svg aria-hidden='true' focusable='false' height={size || height} role='presentation' viewBox='0 0 24 24' width={size || width} {...props}>
		<path
			fill='none'
			stroke='currentColor'
			strokeLinecap='round'
			strokeLinejoin='round'
			strokeWidth='1.5'
			d='M14.881 5.186C13.46 4.314 9.808 2.642 6.52 3.069c1.99 1.37 3.036 2.106 5.86 4.62m6.435 1.43c.872 1.422 2.544 5.073 2.117 8.361c-1.37-1.989-2.106-3.035-4.62-5.859m-5.838-.203l-7.05 7.05c-.572.572-.563 1.507.02 2.09c.582.582 1.518.59 2.09.019l7.049-7.05m-.596-4.301l2.788 2.787c.31.31.81.311 1.119.003l3.453-3.454a.79.79 0 0 0-.002-1.118l-2.788-2.788a.79.79 0 0 0-1.118-.002l-3.454 3.453a.79.79 0 0 0 .002 1.119'
			color='currentColor'
		/>
	</svg>
);
//
export const SquareIcon = ({size = 24, width, height, ...props}: IconSvgProps) => (
	<svg aria-hidden='true' focusable='false' height={size || height} role='presentation' viewBox='0 0 24 24' width={size || width} {...props}>
		<g fill='none' stroke='currentColor' strokeWidth='1.5'>
			<path d='M2 12c0-4.714 0-7.071 1.464-8.536C4.93 2 7.286 2 12 2s7.071 0 8.535 1.464C22 4.93 22 7.286 22 12s0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12Z' />
			<path strokeLinecap='round' strokeLinejoin='round' d='M9.5 8v8m0 0L7 13.25M9.5 16l2.5-2.75M14.5 16V8m0 0L12 10.75M14.5 8l2.5 2.75' />
		</g>
	</svg>
);

export const WriteIcon = ({size = 24, width, height, ...props}: IconSvgProps) => (
	<svg aria-hidden='true' focusable='false' height={size || height} role='presentation' viewBox='0 0 24 24' width={size || width} {...props}>
		<g fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' color='currentColor'>
			<path d='M10.55 3c-3.852.007-5.87.102-7.159 1.39C2 5.783 2 8.022 2 12.5s0 6.717 1.391 8.109C4.783 22 7.021 22 11.501 22c4.478 0 6.717 0 8.108-1.391c1.29-1.29 1.384-3.307 1.391-7.16' />
			<path d='M11.056 13C10.332 3.866 16.802 1.276 21.98 2.164c.209 3.027-1.273 4.16-4.093 4.684c.545.57 1.507 1.286 1.403 2.18c-.074.638-.506.95-1.372 1.576c-1.896 1.37-4.093 2.234-6.863 2.396' />
			<path d='M9 17c2-5.5 3.96-7.364 6-9' />
		</g>
	</svg>
);

export const ResetIcon = ({size = 24, width, height, ...props}: IconSvgProps) => (
	<svg aria-hidden='true' focusable='false' height={size || height} role='presentation' viewBox='0 0 24 24' width={size || width} {...props}>
		<path fill='currentColor' d='M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12h2q0 1.65.625 3.113t1.713 2.55t2.55 1.725t3.112.637q3.35 0 5.675-2.325T20 12.025T17.675 6.35T12 4.025q-2.225 0-4.038 1.088T5.1 8H8v2H2V4h2v2q1.375-1.825 3.45-2.912T12 2q2.075 0 3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m-3-6v-5h1v-1q0-.825.588-1.412T12 8t1.413.588T14 10v1h1v5zm2-5h2v-1q0-.425-.288-.712T12 9t-.712.288T11 10z' />
	</svg>
);

export const EyeIcon = ({size = 24, width, height, ...props}: IconSvgProps) => (
	<svg aria-hidden='true' focusable='false' height={size || height} role='presentation' viewBox='0 0 24 24' width={size || width} {...props}>
		<g fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'>
			<path d='M15 12a3 3 0 1 1-6 0a3 3 0 0 1 6 0' />
			<path d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7s-8.268-2.943-9.542-7' />
		</g>
	</svg>
);
export const ToolIcon = ({size = 24, width, height, ...props}: IconSvgProps) => (
	<svg aria-hidden='true' focusable='false' height={size || height} role='presentation' viewBox='0 0 24 24' width={size || width} {...props}>
		<g fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'>
			<path d='M15 12a3 3 0 1 1-6 0a3 3 0 0 1 6 0' />
			<path d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7s-8.268-2.943-9.542-7' />
		</g>
	</svg>
);

export const NothingIcon = ({size = 24, width, height, ...props}: IconSvgProps) => (
	<svg aria-hidden='true' focusable='false' height={size || height} role='presentation' viewBox='0 0 48 48' width={size || width} {...props}>
		<path fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' d='M38.5 5.5h-29a4 4 0 0 0-4 4v29a4 4 0 0 0 4 4h29a4 4 0 0 0 4-4v-29a4 4 0 0 0-4-4' />
		<circle cx='15.25' cy='32.75' r='.75' fill='currentColor' />
		<circle cx='15.25' cy='32.75' r='.75' fill='currentColor' />
		<circle cx='17.75' cy='32.75' r='.75' fill='currentColor' />
		<circle cx='15.25' cy='30.25' r='.75' fill='currentColor' />
		<circle cx='17.75' cy='30.25' r='.75' fill='currentColor' />
		<circle cx='15.25' cy='27.75' r='.75' fill='currentColor' />
		<circle cx='15.25' cy='27.75' r='.75' fill='currentColor' />
		<circle cx='17.75' cy='27.75' r='.75' fill='currentColor' />
		<circle cx='15.25' cy='25.25' r='.75' fill='currentColor' />
		<circle cx='17.75' cy='25.25' r='.75' fill='currentColor' />
		<circle cx='15.25' cy='22.75' r='.75' fill='currentColor' />
		<circle cx='15.25' cy='22.75' r='.75' fill='currentColor' />
		<circle cx='17.75' cy='22.75' r='.75' fill='currentColor' />
		<circle cx='15.25' cy='20.25' r='.75' fill='currentColor' />
		<circle cx='17.75' cy='20.25' r='.75' fill='currentColor' />
		<circle cx='15.25' cy='17.75' r='.75' fill='currentColor' />
		<circle cx='15.25' cy='17.75' r='.75' fill='currentColor' />
		<circle cx='17.75' cy='17.75' r='.75' fill='currentColor' />
		<circle cx='20.25' cy='20.25' r='.75' fill='currentColor' />
		<circle cx='22.75' cy='20.25' r='.75' fill='currentColor' />
		<circle cx='20.25' cy='17.75' r='.75' fill='currentColor' />
		<circle cx='20.25' cy='17.75' r='.75' fill='currentColor' />
		<circle cx='22.75' cy='22.75' r='.75' fill='currentColor' />
		<circle cx='25.25' cy='22.75' r='.75' fill='currentColor' />
		<circle cx='25.25' cy='25.25' r='.75' fill='currentColor' />
		<circle cx='27.75' cy='25.25' r='.75' fill='currentColor' />
		<circle cx='27.75' cy='27.75' r='.75' fill='currentColor' />
		<circle cx='15.25' cy='15.25' r='.75' fill='currentColor' />
		<circle cx='17.75' cy='15.25' r='.75' fill='currentColor' />
		<circle cx='30.25' cy='32.75' r='.75' fill='currentColor' />
		<circle cx='30.25' cy='32.75' r='.75' fill='currentColor' />
		<circle cx='32.75' cy='32.75' r='.75' fill='currentColor' />
		<circle cx='30.25' cy='30.25' r='.75' fill='currentColor' />
		<circle cx='32.75' cy='30.25' r='.75' fill='currentColor' />
		<circle cx='30.25' cy='27.75' r='.75' fill='currentColor' />
		<circle cx='30.25' cy='27.75' r='.75' fill='currentColor' />
		<circle cx='32.75' cy='27.75' r='.75' fill='currentColor' />
		<circle cx='30.25' cy='25.25' r='.75' fill='currentColor' />
		<circle cx='32.75' cy='25.25' r='.75' fill='currentColor' />
		<circle cx='30.25' cy='22.75' r='.75' fill='currentColor' />
		<circle cx='30.25' cy='22.75' r='.75' fill='currentColor' />
		<circle cx='32.75' cy='22.75' r='.75' fill='currentColor' />
		<circle cx='30.25' cy='20.25' r='.75' fill='currentColor' />
		<circle cx='32.75' cy='20.25' r='.75' fill='currentColor' />
		<circle cx='30.25' cy='17.75' r='.75' fill='currentColor' />
		<circle cx='30.25' cy='17.75' r='.75' fill='currentColor' />
		<circle cx='32.75' cy='17.75' r='.75' fill='currentColor' />
		<circle cx='30.25' cy='15.25' r='.75' fill='currentColor' />
		<circle cx='32.75' cy='15.25' r='.75' fill='currentColor' />
	</svg>
);

export const CoinIcon = ({size = 24, width, height, ...props}: IconSvgProps) => (
	<svg aria-hidden='true' focusable='false' height={size || height} role='presentation' viewBox='0 0 24 24' width={size || width} {...props}>
		<g fill='none'>
			<path fill='#FFAA33' d='M3 12a9 9 0 1 1 18 0a9 9 0 0 1-18 0' />
			<path fill='#000' fill-rule='evenodd' d='M12 18.375a6.375 6.375 0 1 0 0-12.75a6.375 6.375 0 0 0 0 12.75m-.75-8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125h1.5c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125z' clip-rule='evenodd' />
		</g>
	</svg>
);
