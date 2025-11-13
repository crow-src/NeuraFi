import {heroui} from '@heroui/react';
import motion from 'tailwindcss-motion';

/** @type {import('tailwindcss').Config} */

export default {
	content: [
		// "./pages/**/*.{js,ts,jsx,tsx,mdx}",
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
		'./node_modules/tailwindcss-motion/**/*.js' // ✅ 可能需要加上
	],

	safelist: ['grid-cols-1', 'grid-cols-2', 'grid-cols-3', 'grid-cols-4', 'grid-cols-5', 'grid-cols-6', 'grid-cols-7', 'grid-cols-8', 'grid-cols-9', 'grid-cols-10', 'grid-cols-11', 'grid-cols-12'],

	theme: {
		extend: {
			fontFamily: {
				heading: 'var(--font-sans), sans-serif',
				sans: 'var(--font-quicksand), sans-serif'
			},

			keyframes: {
				'scrolling-banner': {from: {transform: 'translateX(0)'}, to: {transform: 'translateX(calc(-50% - var(--gap)/2))'}},
				'scrolling-banner-vertical': {from: {transform: 'translateY(0)'}, to: {transform: 'translateY(calc(-50% - var(--gap)/2))'}}
			},
			animation: {
				'scrolling-banner': 'scrolling-banner var(--duration) linear infinite',
				'scrolling-banner-vertical': 'scrolling-banner-vertical var(--duration) linear infinite'
			},

			fontSize: {
				xxs: '0.5rem',
				tiny: '0.75rem', // 12px when base is 16px - HeroUI 辅助文本需要
				small: '0.875rem' // 14px when base is 16px - HeroUI 需要这个值
			}
		}
	},
	darkMode: 'class',
	plugins: [
		function ({addUtilities}) {
			const newUtilities = {
				'.flex-center': {
					display: 'flex',
					flexDirection: 'row', //水平
					alignItems: 'center', //这是垂直居中
					justifyContent: 'center', //这是水平居中
					width: '100%', //
					height: '100%' //
					// gap: '0.5rem', // Tailwind 的 gap-2 对应 0.5rem
				},
				'.flex-col-center': {
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					width: '100%',
					height: '100%'
					// gap: '0.5rem',
				}
			};

			addUtilities(newUtilities, ['responsive']);
		},
		heroui({
			themes: {
				light: {
					colors: {
						background: '#e5e5e5', // 浅灰色背景
						foreground: '#171717', // 深灰色文字
						primary: {
							DEFAULT: '#d4d4d4', // 中浅灰
							background: '#f5f5f5', // 比背景色更浅的灰色
							ground: '#d4d4d4', // 中灰色地面
							foreground: '#171717', // 深灰色前景文字
							border: '#737373', // 中等灰色边框
							secondary: '#737373' // 中等灰色
						}
					}
				},
				dark: {
					colors: {
						background: '#171717', // 深灰色背景
						foreground: '#ffffff', // 白色文字
						primary: {
							DEFAULT: '#262626', // 深灰
							background: '#1e1e1e', // 比背景色浅一点的灰色
							ground: '#222222', // 深灰地面
							foreground: '#dbdbdb', // 浅灰色前景文字
							border: '#adadad', // 亮灰色边框
							secondary: '#ffaa33' // 亮灰色
						}
					}
				}
			}
		}),
		motion // ✅ 放在最后，确保 motion 插件的类不会被 heroui 主题覆盖
	]
};
