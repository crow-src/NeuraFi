'use client';

import React, {useState, useEffect, useRef} from 'react';
import Image from 'next/image';
import {Button, Input, Card, CardBody, Avatar, Chip, Divider, Textarea} from '@heroui/react';
import {Icon} from '@iconify/react';
import {useTranslations} from 'next-intl';
import {useModalStore} from '@/app/store/useModalStore';

type CategoryColor = 'primary' | 'success' | 'warning' | 'danger' | 'secondary';

const CATEGORY_STYLES: Record<CategoryColor, {icon: string; text: string; card: string; ring: string}> = {
	primary: {icon: 'bg-primary/15 text-primary', text: 'text-primary', card: 'hover:border-primary/40', ring: 'ring-primary/30'},
	success: {icon: 'bg-success/15 text-success', text: 'text-success', card: 'hover:border-success/40', ring: 'ring-success/30'},
	warning: {icon: 'bg-warning/15 text-warning', text: 'text-warning', card: 'hover:border-warning/40', ring: 'ring-warning/30'},
	danger: {icon: 'bg-danger/15 text-danger', text: 'text-danger', card: 'hover:border-danger/40', ring: 'ring-danger/30'},
	secondary: {icon: 'bg-secondary/15 text-secondary', text: 'text-secondary', card: 'hover:border-secondary/40', ring: 'ring-secondary/30'}
};

interface ConversationCategory {
	id: 'general' | 'trading' | 'nft' | 'wallet' | 'technical';
	icon: string;
	color: CategoryColor;
	accent: string;
}

interface Message {
	id: string;
	content: string;
	isUser: boolean;
	timestamp: Date;
}

// ===== AI对话页面 =====
export function HelpView() {
	const t = useTranslations('chat');
	const [selectedConversation, setSelectedConversation] = useState<string>('general');
	const [categoryQuery, setCategoryQuery] = useState('');
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputValue, setInputValue] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const {showModal, closeModal} = useModalStore();

	const quickPrompts = (t.raw('prompts') as string[]) ?? [];

	const conversationCategories: ConversationCategory[] = [
		{
			id: 'general',
			icon: 'mdi:help-circle',
			color: 'primary',
			accent: 'from-primary/15 via-primary/5 to-transparent'
		},
		{
			id: 'trading',
			icon: 'mdi:chart-line',
			color: 'success',
			accent: 'from-success/15 via-success/5 to-transparent'
		},
		{
			id: 'nft',
			icon: 'mdi:package-variant',
			color: 'warning',
			accent: 'from-warning/20 via-warning/5 to-transparent'
		},
		{
			id: 'wallet',
			icon: 'mdi:shield-check',
			color: 'danger',
			accent: 'from-danger/15 via-danger/5 to-transparent'
		},
		{
			id: 'technical',
			icon: 'mdi:cog',
			color: 'secondary',
			accent: 'from-secondary/20 via-secondary/5 to-transparent'
		}
	];

	const getCategoryName = (id: ConversationCategory['id']) => t(`categories.${id}.name`);
	const getCategoryDescription = (id: ConversationCategory['id']) => t(`categories.${id}.description`);

	const filteredCategories = conversationCategories.filter(cat => (getCategoryName(cat.id) + getCategoryDescription(cat.id)).toLowerCase().includes(categoryQuery.toLowerCase()));
	const activeCategory = conversationCategories.find(cat => cat.id === selectedConversation);

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
		const categoryResponses = (t.raw(`responses.${category}`) as string[]) ?? [];
		const fallbackResponses = (t.raw('responses.general') as string[]) ?? [];
		const pool = categoryResponses.length > 0 ? categoryResponses : fallbackResponses;
		return pool[Math.floor(Math.random() * pool.length)];
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

	const handleQuickPrompt = (prompt: string) => {
		setInputValue(prompt);
	};

	const openSettingsModal = () => {
		const body = (
			<div className='space-y-4'>
				<div>
					<h4 className='font-semibold mb-2'>{t('settings.categories')}</h4>
					<div className='grid grid-cols-1 gap-2'>
						{conversationCategories.map(category => (
							<Button
								key={category.id}
								variant={selectedConversation === category.id ? 'solid' : 'bordered'}
								color={category.color as any}
								size='sm'
								onPress={() => {
									setSelectedConversation(category.id);
									closeModal();
								}}
								startContent={<Icon icon={category.icon} className='w-4 h-4' />}
								className='justify-start'>
								{getCategoryName(category.id)}
							</Button>
						))}
					</div>
				</div>
				<Divider />
				<div>
					<h4 className='font-semibold mb-2'>{t('settings.other')}</h4>
					<div className='space-y-2'>
						<Button variant='bordered' size='sm' onPress={clearConversation} startContent={<Icon icon='mdi:delete-sweep' className='w-4 h-4' />} className='w-full justify-start'>
							{t('buttons.clear_all')}
						</Button>
						<Button variant='bordered' size='sm' startContent={<Icon icon='mdi:download' className='w-4 h-4' />} className='w-full justify-start'>
							{t('buttons.export')}
						</Button>
					</div>
				</div>
				<Button variant='ghost' onPress={closeModal} className='text-primary-foreground w-full'>
					{t('buttons.close')}
				</Button>
			</div>
		);

		showModal({label: t('settings.title'), body});
	};

	return (
		<div className='relative flex h-screen w-full flex-col overflow-hidden bg-linear-to-br from-background via-background/80 to-default-100/40'>
			<div className='pointer-events-none absolute inset-0 opacity-70'>
				<div className='absolute -top-32 -right-10 h-80 w-80 rounded-full bg-primary/10 blur-[140px]' />
				<div className='absolute bottom-0 left-10 h-80 w-80 rounded-full bg-secondary/10 blur-[130px]' />
			</div>

			<div className='relative z-10 flex h-full w-full flex-col gap-4  lg:flex-row'>
				<div className='flex min-h-0 flex-1 flex-col rounded-2xl border border-primary-border/70 bg-background/80 shadow-xl backdrop-blur'>
					<div className='rounded-t-2xl border-b border-primary-border/60 bg-background/70 px-6 py-4 backdrop-blur'>
						<div className='flex items-center justify-between'>
							<div className='flex items-center gap-4'>
								<div className='relative h-14 w-14'>
									<div className='absolute inset-0 rounded-2xl bg-linear-to-br from-primary/30 to-secondary/20 blur-lg' />
									<div className='relative h-full w-full rounded-2xl border border-primary/30 bg-content1/60 p-2'>
										<Image src='/favicon-256x256.png' alt='NeuraFi Logo' fill sizes='56px' className='rounded-xl object-contain' />
									</div>
								</div>
								<div>
									<div className='flex items-center gap-3'>
										<h2 className='text-xl font-semibold tracking-tight'>{t('hero.title')}</h2>
										<Chip size='sm' color='success' variant='flat'>
											{t('status.online')}
										</Chip>
										<Chip size='sm' variant='bordered' color='primary'>
											{activeCategory ? getCategoryName(activeCategory.id) : t('categories.general.name')}
										</Chip>
									</div>
									<p className='text-sm text-primary-foreground'>{t('hero.features')}</p>
								</div>
							</div>
							<div className='flex items-center gap-2 text-primary-foreground'>
								<Button variant='flat' size='sm' onPress={clearConversation} startContent={<Icon icon='mdi:refresh' className='w-4 h-4' />}>
									{t('buttons.clear')}
								</Button>
								<Button variant='light' size='sm' onPress={openSettingsModal} startContent={<Icon icon='mdi:tune' className='w-4 h-4' />}>
									{t('buttons.settings')}
								</Button>
							</div>
						</div>
					</div>

					<div className='custom-scrollbar flex-1 min-h-0 space-y-4 overflow-y-auto px-6 py-6'>
						{messages.length === 0 ? (
							<div className='flex h-full items-center justify-center'>
								<Card className='max-w-xl border border-primary-border/60 bg-content1/80 p-6 text-center shadow-lg backdrop-blur'>
									<CardBody className='space-y-4'>
										<div className='mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-r from-primary to-secondary text-primary-foreground shadow-lg'>
											<Icon icon='mdi:robot-excited' className='h-8 w-8' />
										</div>
										<div>
											<h3 className='mb-1 text-xl font-semibold text-primary'>{t('empty.title')}</h3>
											<p className='text-sm text-primary-foreground/80'>{t('empty.subtitle')}</p>
										</div>
										<div className='flex flex-wrap justify-center gap-2'>
											{conversationCategories.slice(0, 3).map(category => (
												<Button
													key={category.id}
													variant='bordered'
													className='text-primary'
													size='sm'
													onPress={() => {
														setSelectedConversation(category.id);
														const categoryName = getCategoryName(category.id);
														setInputValue(t('input_template', {category: categoryName}));
													}}
													startContent={<Icon icon={category.icon} className='w-4 h-4' />}>
													{getCategoryName(category.id)}
												</Button>
											))}
										</div>
									</CardBody>
								</Card>
							</div>
						) : (
							messages.map(message => <MessageBubble key={message.id} message={message} />)
						)}

						{isLoading && (
							<div className='flex items-start gap-3'>
								<Avatar icon={<Icon icon='mdi:robot' className='w-5 h-5' />} className='bg-linear-to-r from-primary to-secondary text-primary-foreground shadow-lg' size='sm' />
								<div className='max-w-[70%] rounded-2xl bg-content1/80 px-4 py-3 shadow-inner'>
									<div className='flex items-center gap-3 text-sm text-primary-foreground'>
										<span className='flex gap-1'>
											<span className='h-2 w-2 animate-bounce rounded-full bg-primary' />
											<span className='h-2 w-2 animate-bounce rounded-full bg-primary' style={{animationDelay: '0.1s'}} />
											<span className='h-2 w-2 animate-bounce rounded-full bg-primary' style={{animationDelay: '0.2s'}} />
										</span>
										{t('loading')}
									</div>
								</div>
							</div>
						)}
						<div ref={messagesEndRef} />
					</div>

					<div className='rounded-b-2xl border-t border-primary-border/60 bg-background/80 px-6 py-4 backdrop-blur'>
						<div className='mb-3 flex flex-wrap gap-2'>
							{quickPrompts.map(prompt => (
								<Chip key={prompt} size='sm' variant='flat' className='cursor-pointer' onClick={() => handleQuickPrompt(prompt)}>
									{prompt}
								</Chip>
							))}
						</div>
						<Card className='border border-primary-border/70 bg-content1/80 shadow-lg backdrop-blur'>
							<CardBody className='space-y-3'>
								<div className='flex gap-2'>
									<Textarea placeholder={t('input.placeholder')} value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={handleKeyPress} className='flex-1' minRows={1} maxRows={4} disabled={isLoading} />
									<Button color='primary' onPress={handleSendMessage} disabled={!inputValue.trim() || isLoading} isLoading={isLoading} className='px-6'>
										{!isLoading && <Icon icon='mdi:send' className='w-4 h-4' />}
									</Button>
								</div>
								<div className='flex items-center justify-between text-xs text-primary-foreground/80'>
									<span>{t('input.hint')}</span>
									<span>{t('input.counter', {count: inputValue.length, max: 1000})}</span>
								</div>
							</CardBody>
						</Card>
					</div>
				</div>

				<div className='hidden w-80 shrink-0 flex-col rounded-2xl border border-primary-border/70 bg-background/80 px-4 py-6 shadow-xl backdrop-blur lg:flex'>
					<div className='mb-4 flex items-center justify-between'>
						<h3 className='text-lg font-semibold'>{t('sections.categories')}</h3>
						<Chip size='sm' variant='flat'>
							{t('sections.count', {count: conversationCategories.length})}
						</Chip>
					</div>
					<Input size='sm' placeholder={t('search.placeholder')} value={categoryQuery} onChange={e => setCategoryQuery(e.target.value)} startContent={<Icon icon='mdi:magnify' className='h-4 w-4 text-primary-foreground' />} className='mb-4' />
					<div className='custom-scrollbar space-y-3 overflow-y-auto pr-1'>
						{filteredCategories.map(category => {
							const styles = CATEGORY_STYLES[category.color];
							const active = selectedConversation === category.id;
							return (
								<Card key={category.id} className={`cursor-pointer border border-primary-border/60 bg-content1/70 transition-all duration-200 ${styles.card} ${active ? `ring-2 ${styles.ring} shadow-lg` : ''}`} onPress={() => setSelectedConversation(category.id)}>
									<CardBody className='p-3'>
										<div className='flex items-center gap-3'>
											<div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${styles.icon}`}>
												<Icon icon={category.icon} className='h-5 w-5' />
											</div>
											<div className='flex-1'>
												<div className='flex items-center justify-between'>
													<h4 className='font-medium'>{getCategoryName(category.id)}</h4>
													<Icon icon='mdi:chevron-right' className={`h-4 w-4 ${styles.text}`} />
												</div>
												<p className='text-xs text-primary-foreground'>{getCategoryDescription(category.id)}</p>
											</div>
										</div>
									</CardBody>
								</Card>
							);
						})}
						{filteredCategories.length === 0 && <p className='text-center text-sm text-primary-foreground/70'>{t('sections.none')}</p>}
					</div>
				</div>
			</div>
		</div>
	);
}

function MessageBubble({message}: {message: Message}) {
	const timeString = message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});

	return (
		<div className={`flex items-start gap-3 ${message.isUser ? 'flex-row-reverse' : ''}`}>
			<Avatar icon={message.isUser ? <Icon icon='mdi:account-circle' className='w-5 h-5' /> : <Icon icon='mdi:robot' className='w-5 h-5' />} className={message.isUser ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-linear-to-r from-primary to-secondary text-primary-foreground shadow-lg'} size='sm' />
			<div className={`max-w-[70%] ${message.isUser ? 'flex flex-col items-end' : ''}`}>
				<div className={`rounded-2xl px-4 py-3 shadow-sm ${message.isUser ? 'bg-primary text-primary-foreground' : 'bg-content1/80 text-primary-foreground'}`}>
					<p className='whitespace-pre-wrap text-sm leading-relaxed'>{message.content}</p>
				</div>
				<span className='mt-1 text-xs text-primary-foreground/70'>{timeString}</span>
			</div>
		</div>
	);
}
