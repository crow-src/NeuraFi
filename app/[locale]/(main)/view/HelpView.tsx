'use client';
import React, {useState, useEffect, useRef} from 'react';
import {Button, Input, Card, CardBody, CardHeader, Avatar, Chip, Divider, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Textarea} from '@heroui/react';
import {Icon} from '@iconify/react';

// ===== AI对话页面 =====
export function HelpView() {
	const [selectedConversation, setSelectedConversation] = useState<string>('general');
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputValue, setInputValue] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const {isOpen, onOpen, onClose} = useDisclosure();

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const handleSendMessage = async () => {
		if (!inputValue.trim() || isLoading) return;

		const newMessage: Message = {
			id: Date.now().toString(),
			content: inputValue,
			isUser: true,
			timestamp: new Date()
		};

		setMessages(prev => [...prev, newMessage]);
		setInputValue('');
		setIsLoading(true);

		// 模拟AI回复
		setTimeout(() => {
			const aiResponse: Message = {
				id: (Date.now() + 1).toString(),
				content: generateAIResponse(inputValue, selectedConversation),
				isUser: false,
				timestamp: new Date()
			};
			setMessages(prev => [...prev, aiResponse]);
			setIsLoading(false);
		}, 1500);
	};

	const generateAIResponse = (userMessage: string, category: string) => {
		const responses = {
			general: ['您好！我是Agon的AI助手，很高兴为您服务。请问有什么可以帮助您的吗？', '我了解您的问题。让我为您详细解答一下...', '这是一个很好的问题！根据我的了解，建议您...', '感谢您的咨询。我可以为您提供以下建议...'],
			trading: ['关于交易问题，我建议您先了解基本的交易规则和风险。', '交易时请注意市场波动，建议设置止损点。', '您可以查看我们的交易指南来了解更多详情。', '交易前请确保您已经完成了身份验证。'],
			nft: ['NFT盲盒是数字收藏品的一种形式，每个盲盒都有独特的属性。', '您可以在市场上交易您的NFT，或者将其兑换为代币。', 'NFT的稀有度决定了它的价值，传说级NFT通常更有价值。', '购买NFT前请确认卖家的信誉和NFT的真实性。'],
			wallet: ['钱包安全非常重要，请务必保管好您的私钥。', '建议使用硬件钱包来存储大额资产。', '定期备份您的钱包，避免资产丢失。', '不要向任何人透露您的私钥或助记词。'],
			technical: ['技术问题通常与网络连接或浏览器设置有关。', '请尝试刷新页面或清除浏览器缓存。', '如果问题持续存在，请联系我们的技术支持团队。', '确保您的浏览器版本是最新的。']
		};

		const categoryResponses = responses[category as keyof typeof responses] || responses.general;
		return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	const clearConversation = () => {
		setMessages([]);
	};

	const conversationCategories = [
		{
			id: 'general',
			name: '通用问题',
			icon: 'mdi:help-circle',
			description: '常见问题和一般性咨询',
			color: 'primary'
		},
		{
			id: 'trading',
			name: '交易相关',
			icon: 'mdi:chart-line',
			description: '交易规则、策略和风险管理',
			color: 'success'
		},
		{
			id: 'nft',
			name: 'NFT盲盒',
			icon: 'mdi:package-variant',
			description: 'NFT购买、交易和兑换',
			color: 'warning'
		},
		{
			id: 'wallet',
			name: '钱包安全',
			icon: 'mdi:shield-check',
			description: '钱包使用和安全建议',
			color: 'danger'
		},
		{
			id: 'technical',
			name: '技术支持',
			icon: 'mdi:cog',
			description: '技术问题和故障排除',
			color: 'secondary'
		}
	];

	return (
		<div className='h-screen w-full flex flex-col lg:flex-row'>
			{/* 主对话区域 */}
			<div className='flex-1 flex flex-col h-full min-h-0'>
				{/* 对话头部 */}
				<div className='flex items-center justify-between p-4 border-b border-default-200 flex-shrink-0'>
					<div className='flex items-center gap-3'>
						<div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center'>
							<Icon icon='mdi:robot' className='w-6 h-6 text-white' />
						</div>
						<div>
							<h2 className='text-lg font-semibold'>Agon AI助手</h2>
							<p className='text-sm text-primary-foreground'>{conversationCategories.find(cat => cat.id === selectedConversation)?.name}</p>
						</div>
					</div>
					<div className='flex items-center gap-2'>
						<Button variant='ghost' size='sm' onPress={clearConversation} startContent={<Icon icon='mdi:delete-sweep' className='w-4 h-4' />}>
							清空对话
						</Button>
						<Button variant='ghost' size='sm' onPress={onOpen} startContent={<Icon icon='mdi:cog' className='w-4 h-4' />}>
							设置
						</Button>
					</div>
				</div>

				{/* 消息区域 */}
				<div className='flex-1 overflow-y-auto p-4 space-y-4 min-h-0'>
					{messages.length === 0 ? (
						<div className='flex items-center justify-center h-full'>
							<div className='text-center'>
								<div className='w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4'>
									<Icon icon='mdi:robot' className='w-8 h-8 text-white' />
								</div>
								<h3 className='text-lg font-semibold mb-2'>欢迎使用Agon AI助手</h3>
								<p className='text-primary-foreground mb-4'>我可以帮助您解答关于交易、NFT、钱包等各种问题</p>
								<div className='flex flex-wrap gap-2 justify-center'>
									{conversationCategories.slice(0, 3).map(category => (
										<Button
											key={category.id}
											variant='bordered'
											size='sm'
											onPress={() => {
												setSelectedConversation(category.id);
												setInputValue(`我想了解${category.name}相关的问题`);
											}}
											startContent={<Icon icon={category.icon} className='w-4 h-4' />}>
											{category.name}
										</Button>
									))}
								</div>
							</div>
						</div>
					) : (
						messages.map(message => <MessageBubble key={message.id} message={message} />)
					)}
					{isLoading && (
						<div className='flex items-start gap-3'>
							<Avatar icon={<Icon icon='mdi:robot' className='w-5 h-5' />} className='bg-gradient-to-r from-blue-500 to-purple-600 text-white' size='sm' />
							<div className='bg-default-100 rounded-lg p-3 max-w-[70%]'>
								<div className='flex items-center gap-2'>
									<div className='flex gap-1'>
										<div className='w-2 h-2 bg-default-400 rounded-full animate-bounce'></div>
										<div className='w-2 h-2 bg-default-400 rounded-full animate-bounce' style={{animationDelay: '0.1s'}}></div>
										<div className='w-2 h-2 bg-default-400 rounded-full animate-bounce' style={{animationDelay: '0.2s'}}></div>
									</div>
									<span className='text-sm text-primary-foreground'>AI正在思考...</span>
								</div>
							</div>
						</div>
					)}
					<div ref={messagesEndRef} />
				</div>

				{/* 输入区域 */}
				<div className='border-t border-default-200 p-4 flex-shrink-0'>
					<div className='flex gap-2'>
						<Textarea placeholder='输入您的问题...' value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={handleKeyPress} className='flex-1' minRows={1} maxRows={4} disabled={isLoading} />
						<Button color='primary' onPress={handleSendMessage} disabled={!inputValue.trim() || isLoading} isLoading={isLoading} className='px-6'>
							{!isLoading && <Icon icon='mdi:send' className='w-4 h-4' />}
						</Button>
					</div>
					<div className='flex items-center justify-between mt-2 text-xs text-primary-foreground'>
						<span>按 Enter 发送，Shift + Enter 换行</span>
						<span>{inputValue.length}/1000</span>
					</div>
				</div>
			</div>

			{/* 对话分类侧边栏 - 大屏幕显示 */}
			<div className='hidden lg:block w-80 border-l border-default-200 bg-default-50 flex-shrink-0'>
				<div className='p-4'>
					<h3 className='text-lg font-semibold mb-4'>对话分类</h3>
					<div className='space-y-2'>
						{conversationCategories.map(category => (
							<Card key={category.id} className={`cursor-pointer transition-all ${selectedConversation === category.id ? 'ring-2 ring-primary bg-primary-50' : 'hover:bg-default-100'}`} onPress={() => setSelectedConversation(category.id)}>
								<CardBody className='p-3'>
									<div className='flex items-center gap-3'>
										<div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${category.color}-100`}>
											<Icon icon={category.icon} className={`w-5 h-5 text-${category.color}`} />
										</div>
										<div className='flex-1'>
											<h4 className='font-medium'>{category.name}</h4>
											<p className='text-sm text-primary-foreground'>{category.description}</p>
										</div>
									</div>
								</CardBody>
							</Card>
						))}
					</div>
				</div>
			</div>

			{/* 设置弹窗 */}
			<Modal isOpen={isOpen} onClose={onClose} size='md'>
				<ModalContent>
					<ModalHeader>AI助手设置</ModalHeader>
					<ModalBody>
						<div className='space-y-4'>
							<div>
								<h4 className='font-semibold mb-2'>对话分类</h4>
								<div className='grid grid-cols-1 gap-2'>
									{conversationCategories.map(category => (
										<Button
											key={category.id}
											variant={selectedConversation === category.id ? 'solid' : 'bordered'}
											color={category.color as any}
											size='sm'
											onPress={() => {
												setSelectedConversation(category.id);
												onClose();
											}}
											startContent={<Icon icon={category.icon} className='w-4 h-4' />}
											className='justify-start'>
											{category.name}
										</Button>
									))}
								</div>
							</div>
							<Divider />
							<div>
								<h4 className='font-semibold mb-2'>其他设置</h4>
								<div className='space-y-2'>
									<Button variant='bordered' size='sm' onPress={clearConversation} startContent={<Icon icon='mdi:delete-sweep' className='w-4 h-4' />} className='w-full justify-start'>
										清空所有对话
									</Button>
									<Button variant='bordered' size='sm' startContent={<Icon icon='mdi:download' className='w-4 h-4' />} className='w-full justify-start'>
										导出对话记录
									</Button>
								</div>
							</div>
						</div>
					</ModalBody>
					<ModalFooter>
						<Button variant='ghost' onPress={onClose}>
							关闭
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
}

// 消息气泡组件
function MessageBubble({message}: {message: Message}) {
	return (
		<div className={`flex items-start gap-3 ${message.isUser ? 'flex-row-reverse' : ''}`}>
			<Avatar icon={message.isUser ? <Icon icon='mdi:account' className='w-5 h-5' /> : <Icon icon='mdi:robot' className='w-5 h-5' />} className={message.isUser ? 'bg-primary text-white' : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'} size='sm' />
			<div className={`max-w-[70%] ${message.isUser ? 'flex flex-col items-end' : ''}`}>
				<div className={`rounded-lg p-3 ${message.isUser ? 'bg-primary text-white' : 'bg-default-100 text-foreground'}`}>
					<p className='text-sm whitespace-pre-wrap'>{message.content}</p>
				</div>
				<span className='text-xs text-primary-foreground mt-1'>{message.timestamp.toLocaleTimeString()}</span>
			</div>
		</div>
	);
}

// 类型定义
interface Message {
	id: string;
	content: string;
	isUser: boolean;
	timestamp: Date;
}
