// <"base" | "tab" | "tabList" | "tabContent" | "cursor" | "panel" | "tabWrapper"> |

export const AccordionClass = {
	// base: 'w-full bg-transparent',
	// wrapper: 'w-full bg-transparent p-0',
	// label: ' text-primary'
	// wrapper: 'w-full bg-green-400',
	base: 'p-0 w-full / rounded-md mx-0',
	title: 'font-normal text-medium text-primary', // 这是标题
	trigger: 'px-2 rounded-md h-10 flex items-center text-primary', // 这是标题
	indicator: 'text-medium text-primary', // 这是下拉箭头
	content: 'text-small'
};

// export const TabsClass = {
// 	// base: 'bg-transparent', //
// 	base: 'bg-transparent motion-preset-rebound-down p-0 m-0 flex flex-col', //
// 	tabWrapper: 'bg-transparent m-0', //
// 	tabList: 'bg-transparent m-0 p-0 rounded-xs shrink-0', // m-0 p-0
// 	tab: 'rounded-t-md rounded-b-none border border-primary-border/30 bg-linear-to-br from-primary/20 to-primary-secondary/10 shadow-md shadow-black',
// 	tabContent: 'w-full group-data-[selected=true]:text-primary text-primary-foreground', // border border-primary-border/30
// 	panel: 'w-full bg-transparent p-0 h-full flex-1', //
// 	cursor: 'w-full bg-primary/20  rounded-t-md rounded-b-none' // bg-linear-to-br from-primary-secondary to-primary
// };

export const TabsClass = {
	tabList: 'gap-6 w-full relative rounded-none p-0 border-divider',
	cursor: 'w-full bg-primary-secondary',
	tab: 'max-w-fit px-0 h-12 flex-1',
	tabContent: 'group-data-[selected=true]:text-primary-secondary',
	panel: 'w-full bg-transparent p-0 h-full flex-1'
};

export const TabsClassB = {
	base: 'bg-background motion-preset-rebound-down p-1 rounded-md', //
	tabWrapper: 'bg-transparent m-0 ', //
	tabList: 'bg-transparent m-0 p-0 rounded-xs w-full', // m-0 p-0
	tab: 'rounded-md bg-primary-background shadow-md  w-full',
	tabContent: 'w-full group-data-[selected=true]:text-primary text-primary-foreground', // border border-primary-border/30
	panel: 'w-full bg-transparent p-0 h-full', //
	cursor: 'w-full bg-primary rounded-md' // bg-linear-to-br from-primary-secondary to-primary
};

export const TableClass = {
	th: 'bg-transparent', // 这是表头
	td: 'w-full', // 这是表体
	// tr: 'w-full', //这是表行
	thead: 'bg-transparent', //
	// table: 'min-h-full h-full',
	base: 'flex flex-col h-full w-full', // 最外部的的div bg-red-400
	// sortIcon: 'text-primary-foreground/60 ', //排序图标样式
	// wrapper: 'flex flex-col justify-center items-center bg-transparent shadow-none min-h-full h-full p-0 m-0 w-full', //这个是包裹内部组件的div
	table: 'w-full h-full', // bg-green-400
	emptyWrapper: 'w-full h-full', // 空表样式
	tbody: 'w-full', // 表体样式
	tfoot: 'bg-red-400 w-full' // 底部组件
};

export const SelectClass = {
	base: 'w-full border border-primary-border/30 rounded-md bg-background/50 px-2', // 改不了字体颜色
	mainWrapper: 'h-full bg-background/50 rounded-md flex items-center justify-center ', //
	trigger: 'bg-transparent', // 这是下拉箭头
	listboxWrapper: 'text-sm text-primary-foreground border border-primary-border/30 rounded-md bg-background/50 ', //
	label: 'text-xs text-primary-foreground/60', // 标题背景可以改，文本颜色不行
	description: 'text-xs text-primary-foreground/40' // 必须在primary 下才能改颜色
	// value: 'text-primary-foreground', // 必须在primary 下才能改颜色

	// popoverContent: 'text-xs text-primary-foreground/40' //
	// innerWrapper: 'text-primary-foreground', //改不了字体颜色 标题和文本的背景
	// listbox: 'text-xs text-primary-foreground' //这里能改列表字体颜色
};
// 无框选择框
export const SelectClassB = {
	base: 'max-w-32 bg-transparent', //
	trigger: ['bg-transparent', 'dark:bg-transparent', 'backdrop-blur-xl', 'backdrop-saturate-200', 'hover:bg-primary/10', 'dark:hover:bg-primary/10', 'group-data-[focus=true]:bg-green-400/10', 'dark:group-data-[focus=true]:bg-green-400/10', 'cursor-text!'],
	listboxWrapper: 'max-h-[400px] bg-transparent'
};

export const AutocompleteClass = {
	base: 'w-full border border-primary-border/30 rounded-md bg-background/50 text-sm', // bg-background/50
	listboxWrapper: 'rounded-md text-sm text-primary-foreground' // bg-primary
};

export const ListboxPropsClass = {
	base: ['rounded-medium', 'text-primary-foreground', 'transition-opacity', 'data-[hover=true]:text-primary-foreground', 'dark:data-[hover=true]:bg-default-50', 'data-[pressed=true]:opacity-70', 'data-[hover=true]:bg-default-200', 'data-[selectable=true]:focus:bg-default-100', 'data-[focus-visible=true]:ring-default-500']
};

export const ProgressClass = {
	base: 'w-full',
	track: 'drop-shadow-md border border-default ',
	indicator: 'bg-linear-to-r from-primary to-primary-secondary ',
	label: 'tracking-wider font-medium text-primary-foreground',
	value: 'text-primary-foreground/60 text-sm'
};

// export const InputClass = {
// 	base: 'w-full border border-primary-border/30 rounded-md bg-primary-background p-0',
// 	input: 'text-small text-primary-foreground border-none w-full',
// 	mainWrapper: 'bg-background/50 rounded-md py-1 w-full',
// 	// labelWrapper: 'bg-transparent',
// 	inputWrapper: ['bg-background/50', 'rounded-md', 'backdrop-blur-xl', 'backdrop-saturate-200', 'hover:bg-green-400/10', 'dark:hover:bg-green-400/10', 'group-data-[focus=true]:bg-green-400/10', 'dark:group-data-[focus=true]:bg-green-400/10', 'cursor-text!', 'w-full'],
// 	label: 'text-primary-foreground/60 text-xs'
// };

export const InputClass = {
	base: 'w-full border border-primary-border/30 rounded-md bg-primary-background p-0 focus-within:border-primary hover:border-primary/60 transition-colors',
	input: 'text-primary text-base font-semibold border-none w-full focus:outline-none focus:ring-0 focus:border-none py-3 px-3',
	mainWrapper: 'bg-background/50 rounded-md w-full', // 移除 py-1
	// labelWrapper: 'bg-transparent',
	inputWrapper: [
		'bg-background/50',
		'rounded-md',
		'backdrop-blur-xl',
		'backdrop-saturate-200',
		'hover:bg-primary/10', // 改为主色
		'dark:hover:bg-primary/10', // 改为主色
		'group-data-[focus=true]:bg-primary/10', // 改为主色
		'dark:group-data-[focus=true]:bg-primary/10', // 改为主色
		'cursor-text!',
		'w-full',
		'min-h-[48px]' // 增加最小高度
	],
	label: 'text-primary-foreground/60 text-xs'
};
// 无框输入框
export const InputClassB = {
	base: 'bg-transparent w-full',
	input: ['text-primary-foreground', 'text-right', 'text-2xl', 'bg-transparent'],
	inputWrapper: ['bg-transparent', 'dark:bg-transparent', 'backdrop-blur-xl', 'backdrop-saturate-200', 'hover:bg-primary/10', 'dark:hover:bg-primary/10', 'group-data-[focus=true]:bg-green-400/10', 'dark:group-data-[focus=true]:bg-green-400/10', 'cursor-text!']
};

export const TextareaClass = {
	input: 'text-sm text-primary-foreground',
	inputWrapper: 'w-full border border-primary-border/30 bg-primary-background rounded-md',
	base: 'w-full'
};

export const DateRangePickerClass = {
	inputWrapper: 'bg-background rounded-md border border-primary-border/30',
	input: 'text-sm text-primary-foreground'
};

// 翻页器
export const PaginationClass = {
	// base: 'w-full items-center justify-center bg-primary/10',
	cursor: 'text-black rounded-none',
	item: 'text-primary-foreground border border-primary-border/30 ',
	// wrapper: 'items-center justify-center',

	prev: 'text-primary-foreground border border-primary-border/30 rounded-md', // 这是上一页
	next: 'text-primary-foreground border border-primary-border/30 rounded-md', // 这是下一页
	forwardIcon: 'text-primary-foreground ', // 这是向前箭头
	ellipsis: 'text-primary-foreground border border-primary-border/30 rounded-md' // 这是省略号

	// chevronNext: 'text-primary-foreground border border-primary-border/30 rounded-md'
	// Partial<Record<'base' | 'wrapper' | 'prev' | 'next' | 'item' | 'cursor' | 'forwardIcon' | 'ellipsis' | 'chevronNext', string>>
};

export const AvatarClass = {
	base: 'bg-linear-to-br from-primary to-primary-secondary text-black font-black ',
	icon: 'text-black'
};

export const UserClass = {
	name: 'text-primary-foreground text-sm',
	description: 'text-primary-foreground/60 text-xs'
};

export const ToastClass = {
	base: 'flex w-full md:max-w-xl  border-1 border-primary ',
	progressTrack: 'bg-primary/20 border-1 border-primary',
	progressIndicator: 'bg-primary-secondary border-primary'
};

export const CheckboxClass = {
	base: 'border-1 border-primary-border/30 bg-primary-background hover:bg-primary-group rounded-md ',
	label: 'text-primary-foreground text-sm ',
	icon: 'text-black ',
	wrapper: 'rounded-xs ' // 选择框
};
//
export const CheckboxClassA = {
	// base: 'border-1 border-primary-border/30  hover:border-primary-border rounded-md  ',
	// wrapper: 'border-1 border-primary-border/30 rounded-md ',
	label: 'text-primary-foreground text-sm',
	icon: 'text-black'
};
// Partial<Record<"base"｜ "wrapper"｜ "icon"｜ "label", string>>
export const CheckboxGroupClass = {
	wrapper: 'w-max flex flex-nowrap gap-6 p-2',
	label: 'text-primary-foreground text-sm'
};

// Partial<Record<"base"｜ "wrapper"｜ "thumb"｜ "label" ｜ "startContent" ｜ "endContent" ｜ "thumbIcon" , string>>
export const SwitchClass = {
	base: 'p-0',
	label: 'text-primary-foreground text-sm whitespace-nowrap',
	wrapper: 'rounded-md bg-primary/30 data-[selected=true]:bg-primary', // 开关背景  未选中时为白色，选中时为绿色
	thumb: 'bg-primary-background rounded-xs', // 按钮
	thumbIcon: 'text-green-400 text-xs' // 按钮图标
};

export const SliderClass = {
	base: 'p-0 w-full',
	// base: 'p-0',
	label: 'text-primary-foreground text-sm text-primary-foreground',
	// labelWrapper: 'p-0',
	value: 'text-primary-foreground text-sm'
	// track: "border-s-secondary-100",
	// filler: "bg-linear-to-r from-secondary-100 to-secondary-500",
};

export const SkeletonClass = {
	// base: 'rounded-md  bg-primary'
	base: 'rounded-md bg-primary/10! [&:before]:bg-primary/20! [&:after]:bg-primary! [--skeleton-background]:bg-primary [--skeleton-highlight]:bg-primary' //
	//content: 'bg-primary/10' //
};

// 芯片
export const ChipClass = {
	base: 'border-1 border-white/30',
	content: 'text-white/90 text-small font-semibold'
};

// 圆形进度条
export const CircularProgressClass = {
	svg: 'w-32 h-32 drop-shadow-md',
	indicator: 'stroke-white',
	track: 'stroke-white/10',
	value: 'text-2xl font-semibold text-white'
};
