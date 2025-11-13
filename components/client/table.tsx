'use client';
import React, {useCallback, useMemo, useState} from 'react';

import {Button, Chip, Spinner, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Pagination, Progress, Table, TableBody, TableBodyProps, TableCell, TableColumn, TableHeader, TableHeaderProps, TableProps, TableRow, User} from '@heroui/react';
import {Icon} from '@iconify/react';

import {ProgressClass, PaginationClass, UserClass, CheckboxClassA} from '@/components';
import {SvgSpinnersBlocksShuffle3, NothingIcon} from '@/components/icons';
import {cap, dayjs, get, numeral, obsTxt, fixDec} from '@/lib';

// 可空参数类型
export interface BaseTableProps {
	tabColumns: {name: string; uid: string; sortable?: boolean}[]; // 列定义
	tabStatusOptions: {name: string; uid: string}[]; // 状态选项
	tabFilterValue?: string; // 过滤值
	tabSelectedKeys?: string[]; // 选中的键
	tabVisibleColumns?: string[]; // 可见的列
	tabStatusFilter?: string; // 状态过滤
	tabRowsPerPage?: number; // 每页行数
	tabSortDescriptor?: {column: string; direction: string}; // 排序描述符
	tabPage?: number; // 当前页码
	isLoading?: boolean; // 是否加载中
	display?: {
		nodata?: string; // 无数据文本
		search?: string;
		status?: string;
		columns?: string;
	}; // 无数据文本
	onRowAction: (key: any) => void; // 行操作
}

// 不可空参数类型，继承于可空参数类型
export interface CommonTableProps extends BaseTableProps {
	data: any[]; // 数据是泛型 T 的数组
	ariaLabel: string;
}
// 组合表格
export function CommonTable({data, ariaLabel, onRowAction, tabColumns, tabStatusOptions, tabFilterValue, tabSelectedKeys, tabVisibleColumns, tabStatusFilter, tabRowsPerPage, tabSortDescriptor, tabPage, isLoading, display}: CommonTableProps) {
	const columns = useMemo(() => tabColumns, [tabColumns]); // 表格列
	const statusOptions = useMemo(() => tabStatusOptions, [tabStatusOptions]); // 状态选项

	const [filterValue, setFilterValue] = useState(tabFilterValue ?? ''); // 默认搜索值
	const [selectedKeys, setSelectedKeys] = useState(new Set(tabSelectedKeys ?? [])); // 默认选中的行
	const [visibleColumns, setVisibleColumns] = useState(new Set(tabVisibleColumns ?? ['name', 'status', 'actions'])); // 默认显示的列
	const [statusFilter, setStatusFilter] = useState(tabStatusFilter ?? 'all'); // 默认显示所有状态
	const [rowsPerPage, setRowsPerPage] = useState(tabRowsPerPage ?? 30); // 默认每页显示5条数据
	const [sortDescriptor, setSortDescriptor] = useState(tabSortDescriptor ?? {column: 'id', direction: 'ascending'});
	const [page, setPage] = useState(tabPage ?? 1);

	const pages = Math.ceil(data.length / rowsPerPage);
	const hasSearchFilter = Boolean(filterValue);

	/** 表头 */
	const headerColumns = useMemo(() => {
		if (visibleColumns.has('all')) return columns; // 返回显示所有列
		return columns.filter(column => visibleColumns.has(column.uid)); // 返回显示指定列
	}, [visibleColumns, columns]); // 当选择默认显示的列改变时、当列数据改变时 重新渲染

	/** 过滤数据 */
	const filteredItems = useMemo(() => {
		let filteredTokens = [...data]; // 复制 展开数据
		if (hasSearchFilter) {
			filteredTokens = filteredTokens.filter(user => user.name.toLowerCase().includes(filterValue.toLowerCase()));
		} // 如果有搜索条件，过滤数据
		if (statusFilter !== 'all' && Array.from(statusFilter).length !== statusOptions.length) {
			filteredTokens = filteredTokens.filter(user => Array.from(statusFilter).includes(user.status as string));
		} // 如果有状态条件，过滤数据
		return filteredTokens;
	}, [data, filterValue, statusFilter, hasSearchFilter, statusOptions.length]); // 当数据改变时、当搜索条件改变时、当状态条件改变时 重新渲染

	/** 每页显示的数据 */
	const items = useMemo(() => {
		const start = (page - 1) * rowsPerPage; // 计算开始位置
		const end = start + rowsPerPage; // 计算结束位置
		return filteredItems.slice(start, end); // 返回每页显示的数据
	}, [page, filteredItems, rowsPerPage]); // 当数据改变时、当页码改变时、当每页显示的行数改变时 重新渲染

	/** 排序数据 */
	const sortedItems = useMemo(() => {
		return [...items].sort((a, b) => {
			const first = a[sortDescriptor.column as keyof typeof a] ?? ''; // 找到第一个
			const second = b[sortDescriptor.column as keyof typeof b] ?? ''; // 找到第二个
			const cmp = first < second ? -1 : first > second ? 1 : 0; // 比较 然后返回-1 0 1
			return sortDescriptor.direction === 'descending' ? -cmp : cmp; // 排序
		});
	}, [sortDescriptor, items]);

	// 当列改变时、当数据改变时、当搜索条件改变时、当状态条件改变时、当页码改变时、当每页显示的行数改变时 重新渲染
	const onRowsPerPageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
		setRowsPerPage(Number(e.target.value));
		setPage(1);
	}, []); // 选择每页显示的行数

	// 当搜索框值改 页码 显示行数改变时 重新渲染
	const onSearchChange = useCallback((value: React.SetStateAction<string>) => {
		if (value) {
			setFilterValue(value);
			setPage(1);
		} else {
			setFilterValue('');
		}
	}, []); // 搜索框值改变

	// 表格顶部组件区域
	const topContent = useMemo(() => {
		return (
			<div className='flex flex-col gap-4 bg-transparent'>
				<div className='flex items-end justify-between gap-3'>
					{/* 筛选框 */}
					<Input
						isClearable
						classNames={{base: 'w-full', inputWrapper: 'border border-primary-border/30'}}
						placeholder={display?.search ?? 'Search by name...'} // 搜索框提示
						size='sm'
						startContent={<Icon icon='solar:rounded-magnifer-linear' className='text-primary-foreground/30' />} // 搜索图标 左侧图标
						value={filterValue} // 搜索框值
						variant='bordered' // 变体:边框
						onClear={() => setFilterValue('')} // 清除搜索框值
						onValueChange={onSearchChange} // 搜索框值改变
						className='text-primary-foreground/30 border-foreground/30'
					/>

					<div className='flex gap-3'>
						{/* 状态筛选下拉菜单 */}
						<Dropdown>
							<DropdownTrigger className='hidden sm:flex'>
								<Button endContent={<Icon icon='solar:double-alt-arrow-down-bold-duotone' />} size='sm' variant='flat' className='text-primary-foreground bg-primary-background'>
									{display?.status ?? 'Status'}
								</Button>
							</DropdownTrigger>
							<DropdownMenu disallowEmptySelection aria-label='Table Columns' closeOnSelect={false} selectedKeys={statusFilter} selectionMode='multiple' onSelectionChange={key => setStatusFilter(key as string)}>
								{statusOptions.map(status => (
									<DropdownItem key={status.uid} className='capitalize'>
										{cap(status.name)}
									</DropdownItem>
								))}
							</DropdownMenu>
						</Dropdown>

						{/* 字段筛选 下拉菜单 */}
						<Dropdown>
							<DropdownTrigger className='hidden sm:flex'>
								<Button endContent={<Icon icon='solar:double-alt-arrow-down-bold-duotone' />} size='sm' variant='flat' className='text-primary-foreground bg-primary-background'>
									{display?.columns ?? 'Columns'}
								</Button>
							</DropdownTrigger>
							<DropdownMenu disallowEmptySelection aria-label='Table Columns' closeOnSelect={false} selectedKeys={visibleColumns} selectionMode='multiple' onSelectionChange={key => setVisibleColumns(key as Set<string>)}>
								{columns.map(column => (
									<DropdownItem key={column.uid} className='capitalize'>
										{cap(column.name)}
									</DropdownItem>
								))}
							</DropdownMenu>
						</Dropdown>
					</div>
				</div>

				<div className='flex items-center justify-between'>
					<span className='text-primary-foreground/50 text-small'>Total {data.length} items</span>
					<label className='flex items-center text-primary-foreground/50 text-small'>
						Rows per page:
						{/* 选择每页显示的行数 组合框*/}
						<select className='bg-transparent outline-hidden foreground/50 text-small' onChange={onRowsPerPageChange}>
							<option value='30'>30</option>
							<option value='60'>60</option>
							<option value='100'>100</option>
						</select>
					</label>
				</div>
			</div>
		);
	}, [filterValue, statusFilter, visibleColumns, onSearchChange, onRowsPerPageChange, data.length, columns, statusOptions, display]);

	// ---表格底部组件区域---
	const bottomContent = useMemo(() => {
		return (
			// 分页按钮
			<div className='flex items-center justify-between px-2 py-2'>
				<Pagination showControls classNames={{cursor: 'bg-primary text-[#000000]'}} isDisabled={hasSearchFilter} page={page} total={pages} variant='light' onChange={setPage} />
				<span className='text-small text-primary-foreground/50'>{`${selectedKeys.size} of ${items.length} selected`}</span>
			</div>
		);
	}, [selectedKeys, items.length, page, pages, hasSearchFilter]);

	// 表格样式
	const classNames = useMemo(
		() => ({
			base: ['w-full', 'h-full', 'max-w-full'],
			wrapper: ['w-full', 'h-full', 'bg-primary-ground', 'border', 'border-primary-border/30', 'overflow-hidden'],
			th: ['bg-transparent', 'text-primary-foreground/50', 'border-none'],
			td: ['border-none'],
			tr: ['border-none'],
			thead: ['shrink-0', 'border-none'], // 表头不收缩
			tbody: ['flex-1', 'overflow-auto', 'border-none'], // 表体可滚动并占满剩余空间
			tfoot: ['border-none']
		}),
		[]
	);

	// ----------------------表格组件----------------------
	return (
		<div className='w-full h-full flex flex-col overflow-hidden max-h-full'>
			<Table
				aria-label={ariaLabel} // 自定义单元格的示例表
				topContent={topContent} // 顶部组件
				topContentPlacement='outside' // 顶部组件在表格外
				bottomContent={bottomContent} // 底部内容
				bottomContentPlacement='outside' // 底部内容在表格外
				checkboxesProps={{classNames: {wrapper: 'after:bg-foreground after:text-background text-background'}}} // 复选框属性
				selectedKeys={selectedKeys} // 选中的行
				selectionMode='single' // 单选模式s
				sortDescriptor={sortDescriptor as any} // 排序
				onSelectionChange={(key: any) => setSelectedKeys(key.toString())} // 选择改变
				onSortChange={(key: any) => setSortDescriptor(key)} // 排序改变
				classNames={classNames}
				onRowAction={onRowAction}
				// (key) => {router.push(`${ariaLabel}/${key}`)}
			>
				{/* 表头 */}
				<TableHeader columns={headerColumns}>
					{column => (
						<TableColumn key={column.uid} align={column.uid === 'name' || 'token' ? 'start' : 'center'} allowsSorting={column.sortable}>
							{column.name}
						</TableColumn>
					)}
				</TableHeader>

				{/* 表格内容 */}
				<TableBody
					items={sortedItems}
					isLoading={isLoading}
					loadingContent={<SvgSpinnersBlocksShuffle3 className='text-primary-foreground' width={48} />}
					emptyContent={
						<div className='flex items-center justify-center'>
							<NothingIcon className='text-[#ffaa33]/10' size={128} />
						</div>
					}>
					{/* 这里有变动 style={{ textAlign: 'left' }}*/}
					{(item: any) => <TableRow key={item.slug}>{(columnKey: any) => <TableCell className='text-sm'>{renderCell(item, columnKey)}</TableCell>}</TableRow>}
				</TableBody>
			</Table>
		</div>
	);
}

CommonTable.displayName = 'CommonTable';

interface CustomTableHeaderProps<T> extends Omit<TableHeaderProps<T>, 'children'> {
	children?: TableHeaderProps<T>['children']; // 重置为可选
}

interface CustomTableBodyProps<T> extends Omit<TableBodyProps<T>, 'children'> {
	children?: TableBodyProps<T>['children']; // //重置为可选
}

export function BaseTable<T>({table, tableHeader, tableBody, data, pageSize = 100, onPageChange}: {table: TableProps; tableHeader: CustomTableHeaderProps<T>; tableBody: CustomTableBodyProps<T>; data: any; pageSize?: number; onPageChange?: (page: number) => void}) {
	const [currentPage, setCurrentPage] = useState(1);

	// 使用 useMemo 计算分页数据
	const paginationData = useMemo(() => {
		const total = Math.ceil(data.length / pageSize); // 总页数
		const start = (currentPage - 1) * pageSize;
		const end = start + pageSize;
		const currentData = data.slice(start, end); //
		return {total, currentData, currentPage};
	}, [data, currentPage, pageSize]);

	// 从 table props 中分离出 key
	const {key: tableKey, ...tableProps} = table;

	return (
		<div className='w-full h-full flex flex-col  max-h-full'>
			<Table
				key={tableKey}
				selectionMode='single' // 默认单选
				label={table?.key ?? 'table'}
				aria-label={typeof table?.key === 'string' ? table.key : 'table'}
				classNames={{
					// wrapper: 'w-full h-full overflow-auto border-none bg-transparent m-0 p-0 custom-scrollbar max-h-full', // 禁止横向滚动
					th: 'bg-transparent border-none',
					td: 'border-none',
					tr: 'border-none',
					base: 'flex flex-col h-full w-full max-h-full border-none', // 添加 max-h-full
					emptyWrapper: 'w-full h-full', // 空表样式
					table: `w-full border-none max-h-full ${paginationData.currentData?.length > 0 ? '' : 'h-full'}`, // 有数据时设置 min-h-0 和 flex-1
					tbody: 'w-full overflow-auto flex-1 border-none max-h-full', // 表体可滚动并占满剩余空间
					thead: 'border-none',
					tfoot: 'border-none'
				}}
				// classNames={TableClass}
				isCompact
				fullWidth
				// showControls
				removeWrapper
				color='primary'
				checkboxesProps={{classNames: CheckboxClassA, radius: 'full', color: 'primary'}}
				bottomContent={
					data.length > pageSize ? (
						<div className='flex justify-center w-full'>
							<Pagination
								color='primary'
								isCompact
								showControls
								// variant='bordered'
								size='sm'
								classNames={PaginationClass}
								total={paginationData.total}
								page={paginationData.currentPage}
								onChange={e => {
									setCurrentPage(e);
									onPageChange?.(e);
								}}
							/>
						</div>
					) : null
				}
				{...tableProps}>
				<TableHeader {...tableHeader}>
					{(column: any) => (
						<TableColumn className='text-primary-foreground/60' key={column.uid} align={column.uid === 'name' || 'token' ? 'start' : 'center'} allowsSorting={column.sortable}>
							{column.name}
						</TableColumn>
					)}
				</TableHeader>
				<TableBody
					{...tableBody}
					items={paginationData.currentData}
					loadingContent={<Spinner color='primary' />}
					emptyContent={<NothingIcon className='m-auto text-primary/10' size={128} />}

					// emptyContent='No rows to display.'
				>
					{paginationData.currentData?.map((item: any, index: number) => (
						<TableRow key={index}>{columnKey => <TableCell className='text-sm'>{renderCell(item, columnKey)}</TableCell>}</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

BaseTable.displayName = 'BaseTable';

// const createTableColumns = (): Record<string, TableColumn[]> => ({
// 	account: [
// 		{name: 'ID', uid: 'id', sortable: false, width: '60px'},
// 		{name: '名称', uid: 'name', sortable: true, width: '120px'},
// 		{name: '账户合约', uid: 'address', sortable: false, width: '200px'},
// 		{name: '所属钱包', uid: 'owner', sortable: true, width: '200px'},
// 		{name: '账户资金', uid: 'balance', sortable: true, width: '120px', align: 'end'},
// 		{name: '存单数量', uid: 'depositsLength', sortable: true, width: '100px', align: 'end'},
// 		{name: '存单总额', uid: 'depositsTotal', sortable: true, width: '100px', align: 'end'},
// 		{name: '团队名称', uid: 'teamName', sortable: true, width: '100px'},
// 		{name: '团队地址', uid: 'team', sortable: true, width: '100px'},
// 		{name: '状态', uid: 'isBlacklist', sortable: true, width: '100px', align: 'center'}
// 		// {name: '操作', uid: 'actions', sortable: false, width: '120px', align: 'center'}
// 	],
// 	team: [
// 		{name: 'ID', uid: 'id', sortable: false, width: '60px'},
// 		{name: '团队名称', uid: 'name', sortable: true, width: '200px'},
// 		{name: '团队地址', uid: 'address', sortable: false, width: '200px'},
// 		{name: '团队长', uid: 'owner', sortable: true, width: '100px', align: 'center'},
// 		{name: '团队人数', uid: 'teamSize', sortable: true, width: '100px', align: 'center'},
// 		{name: '团队业绩', uid: 'performance', sortable: true, width: '120px', align: 'end'}
// 		// {name: '操作', uid: 'actions', sortable: false, width: '120px', align: 'center'}
// 	],
// 	deposit: [
// 		{name: 'ID', uid: 'id', sortable: false, width: '60px'},
// 		{name: '账户合约', uid: 'account', sortable: true, width: '150px'},
// 		{name: '用户钱包', uid: 'account', sortable: true, width: '150px'},
// 		{name: '存单金额', uid: 'amount', sortable: true, width: '120px', align: 'end'},
// 		{name: '利率', uid: 'interestRate', sortable: true, width: '80px', align: 'center'},
// 		{name: '状态', uid: 'status', sortable: true, width: '100px', align: 'center'},
// 		{name: '所属团队', uid: 'team', sortable: true, width: '100px'},
// 		{name: '创建时间', uid: 'createTime', sortable: true, width: '120px'},
// 		{name: '到期时间', uid: 'maturityTime', sortable: true, width: '120px'}
// 		// {name: '操作', uid: 'actions', sortable: false, width: '120px', align: 'center'}
// 	],
// 	event: [
// 		{name: 'ID', uid: 'id', sortable: false, width: '60px'},
// 		{name: '事件名称', uid: 'name', sortable: true, width: '120px'},
// 		{name: '事件类型', uid: 'type', sortable: true, width: '100px', align: 'center'},
// 		{name: '地址', uid: 'address', sortable: true, width: '100px', align: 'center'},
// 		{name: '数值', uid: 'amount', sortable: true, width: '100px', align: 'center'},
// 		{name: '事件时间', uid: 'time', sortable: true, width: '120px'}
// 	]
// });

// 读取
export function renderCell(data: any, columnKey: any) {
	// const cellValue = data[columnKey]; //获取item内具体的值
	const cellValue = get(data, columnKey); // 获取item内具体的值
	switch (columnKey) {
		//case 'team':
		// case 'team':

		case 'team':
		case 'owner':
		case 'address':
			return obsTxt(data?.address, 4, 6);

		case 'txid':
			return obsTxt(data?.txid, 6, 6);

		case 'balance':
			return fixDec(data.balance / 100000000, 6);

		case 'total':
			return numeral(data?.max).format('0.[00]a').toUpperCase();

		case 'timestamp':
			return <p className='text-xs text-primary-foreground/50'>{dayjs.unix(data.deployBlocktime ?? cellValue ?? 0).format('YY/MM/DD HH:mm')}</p>;

		case 'price': // 价值
			return <div className='flex flex-col items-end'>{numeral(cellValue).format('$0,0.00')}</div>;

		case 'progress': // 进度
			const progressValue = Number(data.minted) / Number(data.max) || Number(data.mints) / Number(data.supply);
			const displayValue = progressValue < 0.0001 ? 0 : progressValue;
			return (
				<div className='flex items-center gap-1'>
					<div className='w-10'>
						<Progress aria-labelledby={'progress'} size='sm' classNames={ProgressClass} value={displayValue * 100} className='w-full' />
					</div>
					<p className='text-xs text-primary-foreground-primary-foreground text-right min-w-[20px]'>{displayValue < 1e-6 ? '0.00%' : displayValue >= 1 ? '100%' : numeral(displayValue).format('00.00%')}</p>
				</div>
			);

		case 'isBlacklist':
		case 'status': // 状态 这里要设置状态的样子
			return (
				<Chip className='gap-1 capitalize border-none text-primary-foreground/50' color={cellValue ? 'danger' : 'success'} size='sm' variant='dot'>
					{cellValue}
				</Chip>
			);

		case 'joinDate': // 日期
			return (
				<>
					{' '}
					{new Date(cellValue).toLocaleString('zh-CN', {
						year: '2-digit',
						month: '2-digit',
						day: '2-digit',
						hour: '2-digit',
						minute: '2-digit'
					})}
				</>
			);

		default:
			return cellValue;
	}
}
