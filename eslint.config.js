import {FlatCompat} from '@eslint/eslintrc';
import pluginJs from '@eslint/js';
import pluginImport from 'eslint-plugin-import';
import pluginReact from 'eslint-plugin-react';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import securityPlugin from 'eslint-plugin-security';
import prettier from 'eslint-plugin-prettier';
import unicorn from 'eslint-plugin-unicorn';
import sonarjs from 'eslint-plugin-sonarjs';
import unusedImports from 'eslint-plugin-unused-imports';

const compat = new FlatCompat({
	baseDirectory: import.meta.dirname // 创建兼容层以支持旧版 ESLint 配置格式
});

/** @type {import('eslint').Linter.Config[]} */
export default [
	{files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}']}, // 指定要检查的文件类型
	{ignores: ['.next/', 'node_modules/', 'out/', 'build/', 'dist/', '*.config.js', '*.config.ts', '*.config.mjs']}, // 忽略不需要检查的文件和目录
	{
		languageOptions: {
			// 语言选项配置
			globals: {...globals.browser, ...globals.node}, // 全局变量配置（浏览器环境 + Node.js 环境）
			parser: '@typescript-eslint/parser', // 指定 TypeScript 解析器
			parserOptions: {
				// 解析器选项
				project: './tsconfig.json', // TypeScript 项目配置文件路径
				ecmaFeatures: {
					jsx: true // 启用 JSX 语法支持
				}
			}
		},
		settings: {
			// 插件设置
			react: {
				version: 'detect' // React 版本自动检测
			},
			'import/resolver': {
				// 导入解析器配置
				typescript: {
					alwaysTryTypes: true,
					project: './tsconfig.json'
				}
			},
			next: {
				rootDir: './' // Next.js 根目录设置
			}
		},
		plugins: {
			// 启用的插件列表
			import: pluginImport, // 导入/导出规则
			security: securityPlugin, // 安全检查插件
			prettier: prettier, // 代码格式化插件
			unicorn: unicorn, // 代码质量插件
			react: pluginReact, // React 相关规则
			sonarjs: sonarjs, // SonarJS 代码质量检查
			'unused-imports': unusedImports // 未使用导入检查
		}
	},
	pluginJs.configs.recommended, // 基础 JavaScript 推荐配置
	pluginReact.configs.flat.recommended, // React 推荐配置（扁平配置格式）
	securityPlugin.configs.recommended, // 安全插件推荐配置
	...tseslint.configs.recommended, // TypeScript ESLint 推荐配置
	...compat.extends('next/core-web-vitals', 'next/typescript'), // Next.js 核心 Web 指标和 TypeScript 配置
	{
		rules: {
			// 自定义规则配置
			// ========== 代码格式化规则（临时关闭） ==========
			// 'prettier/prettier': 'warn', // Prettier 集成规则（警告级别）（临时关闭）

			// ========== 代码质量规则 ==========
			'sonarjs/no-commented-code': 'off', // 禁用注释代码检查（允许注释掉的代码）

			// ========== 未使用导入规则（临时放宽） ==========
			// 'unused-imports/no-unused-imports': 'error', // 删除未使用的导入语句

			// 'unused-imports/no-unused-vars': [ // 未使用变量检查（以下划线开头的变量除外）
			// 	'warn',
			// 	{
			// 		vars: 'all', // 检查所有变量
			// 		varsIgnorePattern: '^_', // 忽略以下划线开头的变量
			// 		args: 'after-used', // 检查函数参数
			// 		argsIgnorePattern: '^_' // 忽略以下划线开头的参数
			// 	}
			// ],

			// ========== 文件命名规则 ==========
			// 'unicorn/filename-case': [ // 文件名必须使用 kebab-case 格式（短横线分隔）
			// 	'error',
			// 	{
			// 		case: 'kebabCase',
			// 		ignore: ['^.*\\.config\\.(js|ts|mjs)$', '^.*\\.d\\.ts$'] // 忽略配置文件和类型定义文件
			// 	}
			// ],

			// ========== 自定义代码风格规则（临时放宽） ==========
			// 'spaced-comment': ['error', 'always', {exceptions: ['-', '+']}], // 注释必须有空格分隔
			// 'key-spacing': ['error', {beforeColon: false, afterColon: true}], // 对象键值对的冒号后必须有空格，前面不能有空格
			'no-useless-rename': 'error', // 禁止无用的重命名

			// ========== 导入/导出规则 ==========
			'import/no-mutable-exports': 'error', // 禁止可变导出
			'import/order': [
				// 导入语句排序规则
				'error',
				{
					groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'], // 导入分组顺序：内置模块 -> 外部模块 -> 内部模块 -> 父级目录 -> 同级目录 -> 索引文件
					pathGroups: [
						// 特殊路径分组
						{
							pattern: 'react', // React 放在最前面
							group: 'external',
							position: 'before'
						},
						{
							pattern: '{next,next/**}', // Next.js 相关模块
							group: 'external',
							position: 'before'
						},
						{
							pattern: '@/**', // 项目内部模块（使用 @ 别名）
							group: 'internal',
							position: 'before'
						}
					],
					pathGroupsExcludedImportTypes: [],
					//'newlines-between': 'always', // 不同分组间必须有空行
					alphabetize: {
						// 字母排序
						order: 'asc', // 升序排列
						caseInsensitive: true // 忽略大小写
					}
				}
			],
			//'import/newline-after-import': 'error', // 导入语句后必须有空行
			'import/no-unresolved': [
				// 导入路径必须能解析（临时放宽）
				'error',
				{
					caseSensitive: true // 区分大小写
				}
			],
			//'no-duplicate-imports': ['error', {includeExports: true}], // 禁止重复导入（临时放宽）
			//'import/no-cycle': ['error', {maxDepth: 2}], // 禁止循环依赖（最大深度为 2）（临时放宽）

			// ========== 空格和标点符号规则（临时放宽） ==========
			// 'no-trailing-spaces': 'error', // 禁止行尾空格
			// 'no-multiple-empty-lines': ['error', {max: 1, maxEOF: 1}], // 限制连续空行数量
			'space-before-function-paren': [
				// 函数括号前的空格规则
				'error',
				{
					anonymous: 'always', // 匿名函数必须有空格
					named: 'never', // 命名函数不能有空格
					asyncArrow: 'always' // 异步箭头函数必须有空格
				}
			],
			//'space-in-parens': ['error', 'never'], // 括号内不能有空格
			'array-bracket-spacing': ['error', 'never'], // 数组括号内不能有空格
			//'object-curly-spacing': ['error', 'always'], // 对象花括号内必须有空格
			//'func-call-spacing': ['error', 'never'], // 函数调用时括号前不能有空格
			'computed-property-spacing': ['error', 'never'], // 计算属性括号内不能有空格

			// ========== 命名约定（临时放宽） ==========
			// 'no-underscore-dangle': ['error', {allow: ['_id', '__dirname']}], // 禁止变量名以下划线开头或结尾（允许特殊情况）

			// ========== 复杂度控制（临时放宽限制） ==========
			complexity: ['warn', {max: 100}], // 圈复杂度限制
			'max-lines': ['warn', {max: 1000, skipBlankLines: true, skipComments: true}], // 文件最大行数限制
			'max-depth': ['warn', 6], // 代码块最大嵌套深度

			// ========== TypeScript 特定规则（临时放宽） ==========
			'@typescript-eslint/prefer-nullish-coalescing': 'warn', // 优先使用空值合并操作符 (??) 而不是逻辑或 (||)
			'@typescript-eslint/no-unnecessary-type-assertion': 'warn', // 禁止不必要的类型断言
			'@typescript-eslint/no-unnecessary-condition': 'off', // 禁用不必要的条件检查（已关闭）
			'@typescript-eslint/no-explicit-any': 'off', // 允许使用 any 类型（临时放宽）
			'@typescript-eslint/no-unused-vars': 'off', // 禁用 TypeScript 的未使用变量检查（使用 unused-imports 插件替代）
			'@typescript-eslint/ban-ts-comment': 'off', // 允许使用 @ts-ignore 注释（临时放宽）
			'@typescript-eslint/triple-slash-reference': 'off', // 允许三斜杠引用（Next.js 生成的文件）

			// ========== React 相关规则（临时放宽） ==========
			'react/jsx-no-useless-fragment': ['warn', {allowExpressions: true}], // 警告无用的 React Fragment
			'react/react-in-jsx-scope': 'off', // Next.js 不需要显式导入 React
			'react/jsx-pascal-case': [
				// JSX 组件名必须使用 PascalCase
				'error',
				{
					allowAllCaps: false, // 不允许全大写
					ignore: [] // 无例外
				}
			],
			// 'react/no-unstable-nested-components': ['error', {allowAsProps: true}], // 防止在组件内部定义不稳定的嵌套组件（临时放宽）
			'react/jsx-no-constructed-context-values': 'error', // 防止在 JSX 中直接创建上下文值对象（影响性能）
			//'react/no-array-index-key': 'warn', // 警告使用数组索引作为 key（临时放宽）
			'react/prop-types': 'off', // TypeScript 项目中禁用 prop-types 检查

			// ========== SonarJS 代码质量规则 ==========
			//'sonarjs/no-commented-code': 'warn', // 检测注释掉的代码

			// ========== 通用规则（临时放宽） ==========
			// 'no-console': 'warn', // 警告使用 console 语句（临时关闭）
			'no-debugger': 'error', // 禁止使用 debugger
			'no-case-declarations': 'off', // 允许 case 块中的变量声明（临时关闭）
			'security/detect-object-injection': 'off', // 关闭对象注入安全检查（在受控环境中是安全的）
			'security/detect-possible-timing-attacks': 'off', // 关闭时序攻击检测（在非敏感数据比较中是安全的）
			'security/detect-non-literal-regexp': 'off', // 关闭非字面量正则表达式检测（在受控环境中是安全的）
			'no-constant-condition': 'off', // 允许常量条件（临时关闭）
			'@typescript-eslint/no-unused-expressions': 'off' // 允许未使用的表达式（临时关闭）
		}
	}
];
