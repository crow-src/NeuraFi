import {SVG} from '@svgdotjs/svg.js';
import dayjs from 'dayjs';
import numeral from 'numeral';

export {get} from 'lodash';
export {numeral};
export {dayjs};

/** 高阶函数，自动捕获错误
 * Wraps an asynchronous function with error handling.
 * If the wrapped function throws an error, it returns an object with `success: false` and the error message.
 * Otherwise, it returns the result of the wrapped function.
 * @param fn - The asynchronous function to wrap.
 * @returns A new function that wraps the original function with error handling.
 */

// 主要用用api请求 ？？？
export function withCatch<T, Args extends any[]>(fn: (...args: Args) => Promise<T>): (...args: Args) => Promise<T | {success: false; error: string}> {
	return async (...args: Args) => {
		try {
			return await fn(...args);
		} catch (error) {
			console.error('err:', error);
			return {success: false, error: String(error)};
		}
	};
}

// 定义高阶函数，接受错误标题和一个可选的错误处理回调
export function withError({title, onStart, onComplete}: {title: string; onStart?: () => void; onComplete?: () => void}) {
	return function <F extends (...args: any[]) => Promise<any>>(asyncFunc: F): F {
		return async function (...args: Parameters<F>): Promise<Awaited<ReturnType<F>>> {
			try {
				onStart && onStart();
				return (await asyncFunc(...args)) as Awaited<ReturnType<F>>; // 明确返回类型为原函数的返回类型
			} catch (error) {
				console.error(`${title}:`, error);
				throw error;
			} finally {
				onComplete && onComplete();
			}
		} as unknown as F;
	};
}

/** 取出字符换前后 中间以指定符号填充
 * Obscures a given text by replacing characters in the middle with a specified replacement string.
 * @param text - The text to be obscured.//文本
 * @param frontLength - The number of characters to keep at the beginning of the text.//前面字符长度
 * @param backLength - The number of characters to keep at the end of the text.//后面字符长度
 * @param replaceWith - The string to replace the characters in the middle with. Default is '······'.//替换字符
 * @returns The obscured text.
 */
export const obsTxt = (text: string | undefined, frontLength: number, backLength: number, replaceWith: string = '······'): string => {
	if (!text) return 'None';
	// 确保 text 是字符串类型
	const textStr = String(text);
	return textStr.length <= frontLength + backLength ? textStr : `${textStr.substring(0, frontLength)}${replaceWith}${textStr.substring(textStr.length - backLength)}`;
};

/** 首字母大写
 * Capitalizes the first letter of a string.
 * @param str - The input string.
 * @returns The input string with the first letter capitalized.
 */
export function cap(str: string): string {
	return str ? str[0].toUpperCase() + str.slice(1) : '';
}

/** 创建一个 SVG 并可选择性地将其转换为 Data URL。
 * @param text 要转换为 SVG 文本的字符串。
 * @param size 自定义 SVG 大小，格式为 { width: number, height: number }。
 * @param returnDataURL 如果为 true，则返回 Data URL；如果为 false，则返回 SVG 字符串。默认为 false。
 * @param color 文本颜色。
 * @returns 根据 returnDataURL 参数返回 SVG 字符串或 Data URL。
 */
export const genSvg = ({text, settings = {}, returnDataURL = false}: {text: string; settings?: {color?: string; padding?: {x: number; y: number}; fontSize?: number}; returnDataURL?: boolean}): string => {
	const {color = 'yellow', padding: {x = 40, y = 40} = {}, fontSize = 16} = settings; // 默认设置
	const lineHeight = fontSize * 1.5;
	const draw = SVG().viewbox(0, 0, 200, 200);
	const textStyle = {family: 'Arial', size: fontSize, anchor: 'start', leading: '1.2em'}; // 设置文本属性一次，避免在循环中重复设置

	// 逐行绘制文本
	text.split('\n').reduce((yPos, line) => {
		draw.text(add => add.tspan(line).fill(color).move(x, yPos)).font(textStyle);
		return yPos + lineHeight;
	}, y); // 使用 reduce 而非 forEach，直接从初始 y 坐标开始递增

	const svgString = draw.svg();
	return returnDataURL ? `data:image/svg+xml,${encodeURIComponent(svgString)}` : svgString; // 简化返回逻辑
};

/** 处理数字的格式化(替换0)
 * Formats a number with omission of zeros in the decimal part.
 * @param numberStr - The number to format as a string.
 * @param minZerosToOmit - The minimum number of consecutive zeros to omit in the decimal part.
 * @returns The formatted number as a string.
 */
// 示例
// console.log(fmtZero('0.00000000123', 6)); // 输出：0.(0)[6]123
// console.log(fmtZero('0.0001023', 6)); // 输出：0.0001023
export function fmtZero(numberStr: string, minZerosToOmit: number): string {
	const [integerPart, decimalPart] = numberStr.split('.');

	if (decimalPart) {
		const match = decimalPart.match(new RegExp(`0{${minZerosToOmit},}`)); // 动态构建正则表达式来匹配至少 minZerosToOmit 个连续的零
		if (match) {
			const zerosCount = match[0].length; // 匹配到的连续零的个数
			const start = match.index!; // 匹配到的连续零的起始位置
			const end = start + zerosCount; // 匹配到的连续零的结束位置
			const formattedDecimal = decimalPart.substring(0, start) + '[' + zerosCount + ']' + decimalPart.substring(end); // 根据新格式替换连续零
			return `${integerPart}.${formattedDecimal}`;
		}
	}
	return numberStr; // 如果没有小数部分，或小数部分没有连续的零满足条件，直接返回原数值的字符串形式
}

// 定义一个函数，用于格式化数字
export function fmtK(value: number | string): string {
	const num = Number(value);
	return isNaN(num) || Math.abs(num) < 100
		? String(value)
		: numeral(num / 1000)
				.format('0,0.0')
				.replace('.0', '') + 'K';
}

// 处理数字显示 小数点后保留指定位数
export function fixDec(value: string | number, maxDecimals: number): string {
	const number = Number(value); // 将输入值转换为数字
	if (isNaN(number)) return '0.00'; // 如果不是有效数字，则返回'0'
	return new Intl.NumberFormat('en-US', {maximumFractionDigits: maxDecimals, useGrouping: false}).format(number); // 使用国际数字格式化，保留最多 maxDecimals 位小数
}

// 下载文件
export const download = (url: string): boolean => {
	if (!url) return false;

	try {
		const link = document.createElement('a');
		link.href = url;
		link.download = '';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		return true;
	} catch (error) {
		return false;
	}
};
// 将文本转换为文件并生成下载链接
export const createFileFromText = (text: string, fileType: 'csv' | 'tsv' | 'txt' = 'csv', headers?: string[], fileName?: string): string => {
	// 解析文本行
	const lines = text.split('\n').filter(line => line.trim());
	// 根据文件类型确定配置
	const config = (() => {
		switch (fileType) {
			case 'csv':
				return {delimiter: ',', mimeType: 'text/csv;charset=utf-8;', extension: '.csv'};
			case 'tsv':
				return {delimiter: '\t', mimeType: 'text/tab-separated-values;charset=utf-8;', extension: '.tsv'};
			case 'txt':
				return {delimiter: null, mimeType: 'text/plain;charset=utf-8;', extension: '.txt'};
			default:
				return {delimiter: ',', mimeType: 'text/csv;charset=utf-8;', extension: '.csv'};
		}
	})();

	let fileContent: string[];

	if (config.delimiter) {
		//如果分隔符存在
		// 结构化文件（CSV/TSV）
		fileContent = lines.map(line => {
			// 检查是否是 address=amount 格式
			if (line.includes('=')) {
				const [address, amount] = line.split('=');
				return `"${address.trim()}"${config.delimiter}"${amount.trim()}"`;
			}
			// 如果只是地址，添加空金额列
			return `"${line.trim()}"${config.delimiter}""`;
		});

		// 添加标题行
		if (headers && headers.length > 0) {
			fileContent.unshift(headers.map(header => `"${header}"`).join(config.delimiter));
		} else {
			fileContent.unshift(`"地址"${config.delimiter}"数量"`);
		}
	} else {
		fileContent = lines; // 纯文本文件
	}

	const blob = new Blob([fileContent.join('\n')], {type: config.mimeType}); // 创建 Blob
	const url = URL.createObjectURL(blob); // 生成下载链接
	return url;
};

// ==================== 数值处理相关工具函数 ====================

/**
 * 限制数值在指定范围内
 * @param value 输入值
 * @param min 最小值
 * @param max 最大值
 * @returns 限制后的值
 */
export const clampValue = (value: number, min: number, max: number): number => {
	return Math.min(Math.max(value, min), max);
};

/**
 * 格式化数字 - 避免科学计数法显示，并对Slider值进行四舍五入
 * @param value 数值
 * @returns 格式化后的字符串
 */
export const formatNumber = (value: number): string => {
	// 对于非常小的数字，使用 toFixed 避免科学计数法
	if (Math.abs(value) < 0.000001 && value !== 0) {
		return value.toFixed(8);
	}

	// 对 Slider 产生的值进行四舍五入，保留合适的小数位数
	// 根据数值大小动态调整小数位数
	let decimalPlaces = 0;
	if (Math.abs(value) < 0.01) {
		decimalPlaces = 8; // 很小的数字保留8位小数
	} else if (Math.abs(value) < 0.1) {
		decimalPlaces = 6; // 小于0.1的数字保留6位小数
	} else if (Math.abs(value) < 1) {
		decimalPlaces = 4; // 小于1的数字保留4位小数
	} else if (Math.abs(value) < 10) {
		decimalPlaces = 3; // 小于10的数字保留3位小数
	} else if (Math.abs(value) < 100) {
		decimalPlaces = 2; // 小于100的数字保留2位小数
	} else {
		decimalPlaces = 1; // 大数字保留1位小数
	}

	// 四舍五入并转换为字符串
	return value.toFixed(decimalPlaces);
};

// 格式化数字
export const formatNumberT = (value: number | undefined): string => {
	if (value === undefined || value === null || isNaN(value)) {
		return '0';
	}
	return value.toLocaleString();
};

// 格式化日期
export const formatDate = (date: Date) => {
	return new Intl.DateTimeFormat('zh-CN', {
		year: '2-digit',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit'
	}).format(date);
};

// 复制到粘贴板
export const copyText = async (text: string): Promise<boolean> => {
	try {
		// 解码 HTML 实体
		const tempDiv = document.createElement('div');
		tempDiv.innerHTML = text;
		const decodedText = tempDiv.textContent ?? tempDiv.innerText ?? '';

		// 移除所有空白字符
		const cleanText = decodedText.replace(/\s+/g, '');
		await navigator.clipboard.writeText(cleanText);
		return true;
	} catch (err) {
		return false;
	}
};

// 金额格式化
export const fmtMoney = (n: number | string, masked: boolean): string => {
	if (masked) return '••••';
	// 如果是字符串，先转换为数字
	const num = typeof n === 'string' ? parseFloat(n) : n;
	// 检查是否为有效数字
	if (isNaN(num)) return '0.00';
	const abs = Math.abs(num);
	const fixed = abs >= 100 ? num.toLocaleString(undefined, {maximumFractionDigits: 2}) : num.toFixed(2);
	return fixed;
};
// 百分比
export const pct = (n: number): string => `${(n * 100).toFixed(2)}%`;
