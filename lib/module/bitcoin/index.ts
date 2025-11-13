export * from './inscription';
export * from './rune';
export * from './utils';

export type OperationType = 'deploy' | 'mint' | 'transfer';
export type AgreementType = 'Sat' | 'BRC-20' | 'Runes';
export type Network = 'livenet' | 'testnet' | 'regtest' | undefined;
export type AddressType = 'P2PKH' | 'P2SH' | 'P2WPKH' | 'P2WSH' | 'P2TR' | 'UNKNOWN';

export interface Output {
	address: string;
	value: number; // 单位是 Satoshis
}
