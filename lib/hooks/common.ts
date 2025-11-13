import {useEffect, useState, useCallback, useMemo, useRef} from 'react';
import {useDropzone} from 'react-dropzone';
import {download, createFileFromText} from '@/lib/utils';

// 用于在输入框中实现防抖效果
export function useDebounce<T>(initialValue: T, delay: number): [T, T, (value: T, updateDebounced?: boolean) => void] {
	const [value, setValue] = useState<T>(initialValue); // 原始值
	const [debouncedValue, setDebouncedValue] = useState<T>(initialValue); // 防抖值
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		// 只有在需要更新延迟值时才设置延时任务
		timeoutRef.current = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		// 清除延时器
		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, [value, delay]);

	// 提供一个设置函数，允许用户更新 value
	const setValueFunc = useCallback((newValue: T, updateDebounced: boolean = true) => {
		setValue(newValue);
		if (!updateDebounced) {
			// 如果不需要更新延迟值，立即取消任何未完成的延时操作并更新 debouncedValue
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
			setDebouncedValue(newValue); // 立即更新 debouncedValue
		}
	}, []);

	return [value, debouncedValue, setValueFunc];
}

// 根据参数禁用状态钩子 ，所有参数都为true 则返回假 否则返回真
export function useDisabled(...params: any[]) {
	return params.some(param => !param);
}

// 检测操作是否禁止的hook，直接返回禁止消息
export function useOperationDisabled<T extends Record<string, {condition: boolean; message: string}[]>>(
	conditionsMap: T
): {
	[K in keyof T]: string | null;
} {
	return useMemo(() => {
		const result: any = {};

		Object.entries(conditionsMap).forEach(([key, conditions]) => {
			const isDisabled = conditions.some(({condition}) => !condition);
			const disabledMessage = isDisabled ? (conditions.find(({condition}) => !condition)?.message ?? '操作被禁止') : null;

			result[key] = disabledMessage;
		});

		return result;
	}, [conditionsMap]);
}

// 简化的文件处理 hook
export function useFileHandler(onProcessedText?: (text: string) => void) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [processedText, setProcessedText] = useState<string>('');

	// 处理文件内容
	const processFileContent = (content: string, fileName: string): string => {
		const lines = content.split('\n').filter(line => line.trim()); // 分割行
		// 根据文件类型确定分隔符和处理方式
		const fileConfig = (() => {
			const ext = fileName.toLowerCase().split('.').pop();
			switch (ext) {
				case 'csv':
					return {delimiter: ',', hasHeader: true, removeQuotes: true};
				case 'xlsx':
				case 'xls':
					return {delimiter: '\t', hasHeader: true, removeQuotes: false};
				case 'txt':
					return {delimiter: null, hasHeader: false, removeQuotes: false};
				default:
					return {delimiter: null, hasHeader: false, removeQuotes: false};
			}
		})();

		// 如果是纯文本文件（无分隔符），直接返回
		if (!fileConfig.delimiter) return fileConfig.hasHeader ? lines.slice(1).join('\n') : content;

		// 处理结构化文件（CSV/Excel）
		const dataLines = fileConfig.hasHeader ? lines.slice(1) : lines;

		return dataLines
			.map(line => {
				const columns = line.split(fileConfig.delimiter).map(col => (fileConfig.removeQuotes ? col.trim().replace(/"/g, '') : col.trim()));
				if (columns.length >= 1) {
					const address = columns[0];
					const amount = columns[1] || '';
					return amount ? `${address}=${amount}` : address;
				}
				return '';
			})
			.filter(line => line)
			.join('\n');
	};

	// 文件上传
	const onDrop = async (acceptedFiles: File[]) => {
		if (acceptedFiles && acceptedFiles.length > 0) {
			const file = acceptedFiles[0];
			try {
				const content = await new Promise<string>((resolve, reject) => {
					const reader = new FileReader();
					reader.onload = () => {
						resolve(reader.result as string);
					};
					reader.onerror = () => {
						reject(new Error('文件读取失败'));
					};
					reader.readAsText(file);
				});
				const processedText = processFileContent(content, file.name);
				setProcessedText(processedText);
				// 如果提供了回调函数，则调用它
				onProcessedText?.(processedText); // 加载数据完成调用
			} catch (error) {
				console.error('文件处理失败:', error);
			}
		}
	};

	const {getRootProps, getInputProps, open} = useDropzone({
		onDrop,
		accept: {
			'text/csv': ['.csv'],
			'application/vnd.ms-excel': ['.xls'],
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
			'text/plain': ['.txt']
		},
		noClick: true, // 禁用默认点击行为
		noKeyboard: true // 禁用键盘事件
	});

	return {
		fileInputRef,
		open,
		getRootProps,
		getInputProps,
		processedText,
		download,
		createFileFromText
	};
}

// 使用间隔更新
interface UseIntervalUpdateOptions {
	interval?: number; // 更新间隔，单位毫秒，默认1000ms
	immediate?: boolean; // 是否立即执行一次，默认假
}

export const useIntervalUpdate = (options: UseIntervalUpdateOptions = {}) => {
	const {interval = 5000, immediate = false} = options;
	const [currentTime, setCurrentTime] = useState(() => Date.now());

	useEffect(() => {
		if (immediate) {
			setCurrentTime(Date.now());
		}

		const timer = setInterval(() => {
			setCurrentTime(Date.now());
		}, interval);

		return () => clearInterval(timer);
	}, [interval, immediate]);

	return currentTime;
};
