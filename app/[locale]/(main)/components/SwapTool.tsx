'use client';
import {useMemo, useState, useCallback, useEffect} from 'react';
import {Avatar, AvatarGroup, Button, Card, Input, Slider, Switch} from '@heroui/react';
import {cn} from '@heroui/react';
import {Select, SelectItem} from '@heroui/select';
import {useTranslations} from 'next-intl';
import {button} from '@/components';
import {SelectClass, InputClass} from '@components/class';
import {swapTokens, swapPairs, SwapPair, SwapToken} from '../view/data_test';

// ===== Types =====
interface SwapState {
	fromTokenSymbol: string;
	toTokenSymbol: string;
	amountIn: string;
	amountOut: string;
}

interface TokenInputProps {
	label: string;
	tokenSymbol: string;
	tokenOptions: SwapToken[];
	onTokenChange: (symbol: string) => void;
	amount: string;
	balance: string;
	onAmountChange: (amount: string) => void;
	onSliderChange: (percent: number) => void;
	readOnly?: boolean;
}

// ===== Helper Functions =====
const getTokenBySymbol = (symbol: string): SwapToken => swapTokens.find(token => token.symbol === symbol) ?? swapTokens[0];

const calculateRate = (fromSymbol: string, toSymbol: string): number => {
	const fromPrice = getTokenBySymbol(fromSymbol).price;
	const toPrice = getTokenBySymbol(toSymbol).price;
	return fromPrice / toPrice;
};

const formatAmount = (value: number): string => (Number.isFinite(value) ? value.toFixed(6) : '0');

// ===== Select Components =====
const TokenSelect = ({value, options, onChange}: {value: string; options: SwapToken[]; onChange: (symbol: string) => void}) => (
	<Select
		items={options}
		selectedKeys={[value]}
		aria-label='token'
		className='w-full'
		onSelectionChange={keys => {
			const symbol = Array.from(keys)[0] as string;
			onChange(symbol);
		}}
		classNames={SelectClass}>
		{item => (
			<SelectItem key={item.symbol} textValue={item.symbol}>
				<div className='flex items-center gap-2'>
					<Avatar alt={item.name} className='shrink-0' size='sm' src={item.icon} />
					<span className='text-small'>{item.symbol}</span>
				</div>
			</SelectItem>
		)}
	</Select>
);

// ===== Reusable Token Input Component =====
const TokenInput = ({label, tokenSymbol, tokenOptions, onTokenChange, amount, balance, onAmountChange, onSliderChange, readOnly = false}: TokenInputProps) => {
	const tSwap = useTranslations('swap');

	return (
		<div className='flex flex-col p-4 gap-2 border rounded-lg border-primary/20 bg-primary-background w-full'>
			<div className='flex justify-between gap-2 mb-2'>
				<p className='text-left text-primary-foreground/70'>{label}</p>
				<p className='text-sm text-primary-foreground/60'>{`${tSwap('balance')}: ${balance}`}</p>
			</div>
			<div className='flex w-full gap-2 mb-2'>
				<TokenSelect value={tokenSymbol} options={tokenOptions} onChange={onTokenChange} />
			</div>
			<Input placeholder={tSwap('placeholder_amount')} value={amount} onValueChange={onAmountChange} readOnly={readOnly} classNames={InputClass} />
			{!readOnly && (
				<Slider
					aria-label={`${label}-slider`}
					onChange={value => {
						const percent = Array.isArray(value) ? value[0] : value;
						onSliderChange(percent);
					}}
					size='sm'
					maxValue={1}
					step={0.1}
					defaultValue={0}
					className='w-full'
					color='primary'
				/>
			)}
		</div>
	);
};

// ===== Main SwapTool Component =====
export const SwapTool = ({selectedPair}: {selectedPair?: SwapPair | null}) => {
	const tSwap = useTranslations('swap');
	const [isPrivate, setIsPrivate] = useState(true);
	const [isFunding, setIsFunding] = useState(false);
	const [swapState, setSwapState] = useState<SwapState>({
		fromTokenSymbol: selectedPair?.baseSymbol ?? 'ETH',
		toTokenSymbol: selectedPair?.quoteSymbol ?? 'USDC',
		amountIn: '0',
		amountOut: '0'
	});

	const recalcAmountOut = useCallback((amount: string, fromSymbol: string, toSymbol: string) => {
		const numeric = parseFloat(amount || '0');
		if (!numeric || !Number.isFinite(numeric)) return '0';
		const rate = calculateRate(fromSymbol, toSymbol);
		return formatAmount(numeric * rate);
	}, []);

	useEffect(() => {
		if (!selectedPair) return;
		setSwapState(prev => ({
			...prev,
			fromTokenSymbol: selectedPair.baseSymbol,
			toTokenSymbol: selectedPair.quoteSymbol,
			amountOut: recalcAmountOut(prev.amountIn, selectedPair.baseSymbol, selectedPair.quoteSymbol)
		}));
	}, [selectedPair, recalcAmountOut]);

	const handleInputChange = useCallback(
		(value: string) => {
			setSwapState(prev => ({
				...prev,
				amountIn: value,
				amountOut: recalcAmountOut(value, prev.fromTokenSymbol, prev.toTokenSymbol)
			}));
		},
		[recalcAmountOut]
	);

	const handleTokenChange = useCallback(
		(symbol: string, isFrom: boolean) => {
			setSwapState(prev => {
				const next = {...prev};
				if (isFrom) next.fromTokenSymbol = symbol;
				else next.toTokenSymbol = symbol;
				next.amountOut = recalcAmountOut(next.amountIn, next.fromTokenSymbol, next.toTokenSymbol);
				return next;
			});
		},
		[recalcAmountOut]
	);

	const handleSliderChange = useCallback(
		(percent: number) => {
			const balance = parseFloat(getTokenBySymbol(swapState.fromTokenSymbol).balance);
			const newAmount = formatAmount(balance * percent);
			handleInputChange(newAmount);
		},
		[swapState.fromTokenSymbol, handleInputChange]
	);

	const handleSwap = () => {
		if (!parseFloat(swapState.amountIn)) return;
		alert(`交换成功: ${swapState.amountIn} ${swapState.fromTokenSymbol} -> ${swapState.amountOut} ${swapState.toTokenSymbol}`);
	};

	const fromTokenOptions = useMemo(() => swapTokens, []);
	const toTokenOptions = useMemo(() => swapTokens, []);
	const fromBalance = getTokenBySymbol(swapState.fromTokenSymbol).balance;
	const toBalance = getTokenBySymbol(swapState.toTokenSymbol).balance;

	const tradingPairInfo = useMemo(() => {
		const pair = selectedPair ?? swapPairs.find(p => p.baseSymbol === swapState.fromTokenSymbol && p.quoteSymbol === swapState.toTokenSymbol);
		const price = pair?.price ?? calculateRate(swapState.fromTokenSymbol, swapState.toTokenSymbol);
		const changePct = pair?.changePct ?? 0;
		return {
			symbol: `${swapState.fromTokenSymbol}/${swapState.toTokenSymbol}`,
			price,
			changePct,
			volume: pair?.volume ?? '—'
		};
	}, [selectedPair, swapState.fromTokenSymbol, swapState.toTokenSymbol]);

	return (
		<div className='flex flex-col h-full'>
			<div className='flex gap-2 mb-4'>
				<AvatarGroup isBordered max={2}>
					<Avatar radius='full' size='sm' src={getTokenBySymbol(swapState.fromTokenSymbol).icon} />
					<Avatar radius='full' size='sm' src={getTokenBySymbol(swapState.toTokenSymbol).icon} />
				</AvatarGroup>
				<div className='flex flex-col'>
					<p className='text-lg font-semibold text-primary'>{tradingPairInfo.symbol}</p>
					<div className='flex items-center gap-2 mt-1'>
						<span className='text-sm font-medium'>${tradingPairInfo.price.toFixed(2)}</span>
						<span className={`text-xs ${tradingPairInfo.changePct >= 0 ? 'text-success' : 'text-danger'}`}>
							{tradingPairInfo.changePct >= 0 ? '+' : ''}
							{(tradingPairInfo.changePct * 100).toFixed(2)}%
						</span>
						<span className='text-xs text-primary-foreground/60'>Vol {tradingPairInfo.volume}</span>
					</div>
				</div>
			</div>

			<div className='flex-col space-y-4 w-full text-xs h-full'>
				<TokenInput label={tSwap('from')} tokenSymbol={swapState.fromTokenSymbol} tokenOptions={fromTokenOptions} onTokenChange={symbol => handleTokenChange(symbol, true)} amount={swapState.amountIn} balance={fromBalance} onAmountChange={handleInputChange} onSliderChange={percent => handleSliderChange(percent)} />
				<TokenInput label={tSwap('to')} tokenSymbol={swapState.toTokenSymbol} tokenOptions={toTokenOptions} onTokenChange={symbol => handleTokenChange(symbol, false)} amount={swapState.amountOut} balance={toBalance} onAmountChange={_value => undefined} onSliderChange={_percent => undefined} readOnly />

				<div className='flex items-center justify-between mb-4'>
					<Switch isSelected={isPrivate} onValueChange={setIsPrivate} color='primary' size='sm'>
						{tSwap('privacy_trading')}
					</Switch>
					<Switch isSelected={isFunding} onValueChange={setIsFunding} color='primary' size='sm'>
						{tSwap('funding')}
					</Switch>
				</div>

				{isFunding && (
					<div className='flex gap-2 w-full'>
						<Card className='flex-1 p-3 border-primary/20'>
							<p className='text-xs text-primary-foreground/60 text-left'>{tSwap('funding_amount')}</p>
							<p className='text-lg font-semibold text-primary'>1000.00 $</p>
						</Card>
						<Card className='flex-1 p-3 border-primary/20'>
							<p className='text-xs text-primary-foreground/60 text-left'>{tSwap('interest_rate')}</p>
							<p className='text-lg font-semibold text-primary-secondary'>6.25%</p>
						</Card>
					</div>
				)}

				<Button className={cn(button(), 'text-black')} onPress={handleSwap} isDisabled={!parseFloat(swapState.amountIn)}>
					{tSwap('swap')}
				</Button>
			</div>
		</div>
	);
};
