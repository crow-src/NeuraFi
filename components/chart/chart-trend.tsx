'use client';
import type { EChartsOption } from 'echarts';
import { CandlestickChart, BarChart, LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, VisualMapComponent, DataZoomComponent, TitleComponent, ToolboxComponent, LegendComponent, BrushComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import ReactECharts from 'echarts-for-react';

echarts.use([CandlestickChart, BarChart, LineChart, GridComponent, TooltipComponent, VisualMapComponent, DataZoomComponent, TitleComponent, ToolboxComponent, LegendComponent, BrushComponent, CanvasRenderer]); // 注册所需的ECharts组件
const upColor = '#67c80a';
const downColor = '#C80A0A';

// 数据类型
export interface NewChartDataItem {
	open: number;
	high: number;
	low: number;
	close: number;
	timestamp: string;
	_id: string;
}

// 表格的参数 Props 类型
export const TrendChart = ({ name, data }: {name: string; data: NewChartDataItem[]}) => {
	// 数据分割
	const splitData = (rawData: NewChartDataItem[]) => {
		const categoryData: string[] = []; // 类别数据
		const values: number[][] = [];
		const volumes: number[][] = [];
		rawData.forEach((item, index) => {
			const date = new Date(item.timestamp).toISOString().split('T')[0];
			categoryData.push(date);
			values.push([item.open, item.close, item.low, item.high]);
			volumes.push([index, index, item.open > item.close ? 1 : -1]); // 这里假设了成交量数据不可用，需要根据实际情况调整
		});
		return { categoryData, values, volumes };
	};

	// 计算移动平均线
	const calculateMA = (dayCount: number, data: {values: number[][]}) => {
		const result: number[] = [];
		for (let i = 0; i < data.values.length; i++) {
			if (i < dayCount) {
				result.push(NaN); // 对于不足以计算MA的部分，使用NaN表示
				continue;
			}
			let sum = 0;
			for (let j = 0; j < dayCount; j++) {
				sum += data.values[i - j][1];
			} // 假设第二个值是close值
			result.push(parseFloat((sum / dayCount).toFixed(3)));
		}
		return result;
	};

	const processedData = splitData(data); // 使用解构出的dat

	// 图表配置
	const option: EChartsOption = {
		title: { text: name, left: 0 }, // 标题设置：文本内容及其在容器中的位置
		backgroundColor: 'rgba(0, 0, 0, 0)', // 图标背景颜色透明

		animation: false, // 关闭初始动画效果
		legend: {
			// 图例组件的配置
			bottom: 6, // 图例组件距离容器下侧的距离
			left: 'center', // 图例组件在容器中的位置
			data: ['Dow-Jones index', 'MA5', 'MA10', 'MA20', 'MA30'], // 图例的数据数组
			// backgroundColor: '#ff7f50' // 图例的背景颜色
			textStyle: { color: '#ffaa33' } // 图例的文字样式设置
		},

		tooltip: {
			// 提示框组件的配置
			trigger: 'axis', // 触发类型：坐标轴触发
			axisPointer: { type: 'cross' }, // 坐标轴指示器的配置// 十字准线指示器
			borderWidth: 1, // 提示框的边框宽度
			backgroundColor: 'rgba(18, 18, 18, 0.8)', // 提示框的背景颜色
			borderColor: '#ffaa33', // 提示框的边框颜色
			padding: 10, // 提示框内边距
			textStyle: { color: '#ffaa33' }, // 提示框文字的样式设置
			position: function (pos, params, el, elRect, size) {
				// 提示框的位置
				const obj: Record<string, number> = { top: 10 };
				obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
				return obj;
			}
		},

		axisPointer: {
			// 坐标轴指示器（axisPointer）的全局公用设置
			link: [{ xAxisIndex: 'all' }], // 连接所有x轴的指示器
			label: { backgroundColor: '#777' } // 指示器标签的背景颜色
		},

		toolbox: {
			// 工具栏的配置
			show: true, // 显示工具栏
			feature: {
				// 工具栏中的工具按钮配置
				dataZoom: { yAxisIndex: false }, // 数据区域缩放。选择y轴不受缩放控制
				brush: { type: ['lineX', 'clear'] } // 区域选择工具配置
				// textStyle: { color: '#ffaa33' }, // 提示框文字的样式设置
			}
		},
		brush: {
			// 区域选择设置
			xAxisIndex: 'all', // 选择所有x轴
			brushLink: 'all', // 将选中状态与所有系列联动
			outOfBrush: { colorAlpha: 0.1 } // 未被选择的数据的透明度
		},

		// 左下角的图例
		visualMap: {
			// 视觉映射组件配置
			show: false, // 不显示视觉映射组件
			seriesIndex: 5, // 指定映射的系列索引
			dimension: 2, // 指定映射的维度
			pieces: [
				{ value: 1, color: downColor },
				{ value: -1, color: upColor }
			] // 自定义分段式视觉映射
		},

		grid: [
			// 网格配置，用于放置图表的网格
			{ left: '4%', right: '4%', height: '70%' }, // 主图表的网格位置
			{ left: '4%', right: '4%', top: '80%', height: '10%' } // 副图表（如成交量图）的网格位置
		],

		xAxis: [
			{
				// 主图的X轴配置
				type: 'category', // 类别轴，适用于离散的类别数据
				data: processedData.categoryData, // 类别数据，这里是处理过的日期数据
				boundaryGap: false, // 设置为false确保数据点在两个刻度之间显示，而不是直接在刻度上
				axisLine: { onZero: false }, // 控制轴线是否在0刻度上，这里设置为false表示不强制轴线在0刻度
				splitLine: { show: false }, // 不显示分割线，使图表更简洁
				min: 'dataMin', // 设置X轴的最小值为数据中的最小值，确保图表的数据完整显示
				max: 'dataMax', // 设置X轴的最大值为数据中的最大值
				axisPointer: { z: 100 } // 设置坐标轴指示器（如鼠标悬停时的信息框）的Z轴深度，确保它在最上层显示
			},
			{
				// 成交量图的X轴配置，因为它是副图，所以需要特别设置
				type: 'category', // 同样是类别轴
				gridIndex: 1, // 指定该轴属于哪一个grid，因为是副图，这里设置为1
				data: processedData.categoryData, // 类别数据同样是日期
				boundaryGap: false, // 同主图，保证数据点显示在两个刻度之间
				axisLine: { onZero: false }, // 同主图，不强制轴线在0刻度
				axisTick: { show: false }, // 不显示轴刻度，使得副图看起来更为简洁
				splitLine: { show: false }, // 不显示分割线
				axisLabel: { show: false }, // 不显示轴标签，因为副图通常不需要显示具体的日期标签
				min: 'dataMin', // 最小值同主图
				max: 'dataMax' // 最大值同主图
			}
		],
		yAxis: [
			// Y轴的配置
			{
				// 第一个Y轴（主图）
				scale: true, // 自动缩放
				splitArea: {
					show: true, // 显示分割区域
					areaStyle: { color: ['#181818', '#202020'] } // 背景分割区域的颜色
				},
				splitLine: { show: false }
			},
			{
				// 第二个Y轴（成交量图）
				scale: true,
				gridIndex: 1,
				splitNumber: 2, // 仅显示两个刻度
				axisLabel: { show: false }, // 不显示轴标签
				axisLine: { show: false }, // 不显示轴线
				axisTick: { show: false }, // 不显示轴刻度
				splitLine: { show: false } // 不显示分割线
			}
		],
		dataZoom: [
			// 数据区域缩放
			{
				// 内置型数据区域缩放组件
				type: 'inside',
				xAxisIndex: [0, 1], // 控制两个x轴
				start: 98, // 起始位置（百分比）
				end: 100 // 结束位置（百分比）
			},

			{
				// 滑动条型数据区域缩放组件
				show: true,
				xAxisIndex: [0, 1],
				type: 'slider',
				top: '90%', // 位置
				start: 98, // 起始位置（百分比）
				end: 100, // 结束位置（百分比）
				handleSize: '80%', // 滑动条的大小
				// backgroundColor: '#ffaa33',
				// fillerColor: '#ffaa33', // 滑动条的颜色
				borderColor: '#ffaa33' // 滑动条的边框颜色

				// labelFormatter: '', // 标签格式化
				// showDetail: false // 不显示详细信息
			}
		],
		series: [
			{
				// K线图系列配置
				name: 'Dow-Jones index',
				type: 'candlestick',
				data: processedData.values,
				itemStyle: {
					color: upColor, // 上涨颜色
					color0: downColor, // 下跌颜色
					borderColor: undefined, // 边框颜色
					borderColor0: undefined // 边框颜色
				}
			},

			// 移动平均线系列配置
			{ name: 'MA5', type: 'line', data: calculateMA(5, processedData), smooth: true, lineStyle: { opacity: 0.5 } },
			{ name: 'MA10', type: 'line', data: calculateMA(10, processedData), smooth: true, lineStyle: { opacity: 0.5 } },
			{ name: 'MA20', type: 'line', data: calculateMA(20, processedData), smooth: true, lineStyle: { opacity: 0.5 } },
			{ name: 'MA30', type: 'line', data: calculateMA(30, processedData), smooth: true, lineStyle: { opacity: 0.5 } },
			// 成交量柱状图系列配置
			{ name: 'Volume', type: 'bar', xAxisIndex: 1, yAxisIndex: 1, data: processedData.volumes }
		]
	};

	return <ReactECharts option={option} style={{ height: '700px', width: '100%' }} className='w-full h-full' />;
};
