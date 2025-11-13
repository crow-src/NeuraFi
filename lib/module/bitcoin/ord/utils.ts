/**
 * Prepends a '0' to an odd character length word to ensure it has an even number of characters.
 * @param {string} word - The input word.
 * @returns {string} - The word with a leading '0' if it's an odd character length; otherwise, the original word.
 */
export const zero2 = (word: string): string => {
	if (word.length % 2 === 1) {
		return '0' + word;
	} else {
		return word;
	}
};

/**
 * Converts an array of numbers to a hexadecimal string representation.将一个数组转换为十六进制字符串
 * @param {number[]} msg - The input array of numbers.
 * @returns {string} - The hexadecimal string representation of the input array.
 */
export const toHex = (msg: number[]): string => {
	let res = '';
	for (let i = 0; i < msg.length; i++) {
		res += zero2(msg[i].toString(16));
	}
	return res;
};

// 将一个数组分成多个子数组
export function chunks<T>(bin: T[], chunkSize: number): T[][] {
	const chunks: T[][] = [];
	let offset = 0;

	while (offset < bin.length) {
		// Use Buffer.slice to create a chunk. This method does not copy the memory;
		// it creates a new Buffer that references the original memory.
		const chunk = bin.slice(offset, offset + chunkSize);
		chunks.push(chunk);
		offset += chunkSize;
	}
	return chunks;
}

// 将一个Buffer转换为PushData
export function toPushData(data: Buffer): Buffer {
	const res: Array<Buffer> = [];
	const dLen = data.length;
	if (dLen < 0x4c) {
		const dLenBuff = Buffer.alloc(1);
		dLenBuff.writeUInt8(dLen);
		res.push(dLenBuff);
	} else if (dLen <= 0xff) {
		// OP_PUSHDATA1
		res.push(Buffer.from('4c', 'hex'));

		const dLenBuff = Buffer.alloc(1);
		dLenBuff.writeUInt8(dLen);
		res.push(dLenBuff);
	} else if (dLen <= 0xffff) {
		// OP_PUSHDATA2
		res.push(Buffer.from('4d', 'hex'));
		const dLenBuff = Buffer.alloc(2);
		dLenBuff.writeUint16LE(dLen);
		res.push(dLenBuff);
	} else {
		// OP_PUSHDATA4
		res.push(Buffer.from('4e', 'hex'));
		const dLenBuff = Buffer.alloc(4);
		dLenBuff.writeUint32LE(dLen);
		res.push(dLenBuff);
	}

	res.push(data);
	// return Buffer.concat(res);//原先代码
	return Buffer.concat(res as unknown as Uint8Array[]);
}

// 将公钥转换为xOnly公钥
export function toXOnly(pubkey: Buffer): Buffer {
	// 如果已经是32字节，直接返回（已经是x-only格式）
	if (pubkey.length === 32) {
		return pubkey;
	}

	// 如果是33字节的压缩公钥，去掉前缀字节
	if (pubkey.length === 33) {
		return pubkey.subarray(1, 33);
	}

	// 如果是65字节的未压缩公钥，去掉前缀字节和y坐标
	if (pubkey.length === 65) {
		return pubkey.subarray(1, 33);
	}

	// 其他情况，尝试去掉第一个字节（假设有前缀）
	if (pubkey.length > 1) {
		return pubkey.subarray(1);
	}

	// 如果只有1字节或更少，直接返回
	return pubkey;
}

// 将一个字符串转换为base26编码的bigint
export function base26Encode(input: string): bigint {
	let result = 0n;

	for (let i = 0; i < input.length; i++) {
		const charCode = BigInt(input.charCodeAt(i) - 'A'.charCodeAt(0));

		const iInv = BigInt(input.length) - 1n - BigInt(i);

		if (iInv == 0n) {
			result += charCode;
		} else {
			const base = 26n ** iInv;
			result += base * (charCode + 1n);
		}
	}
	return result;
}

// 将一个base26编码的bigint转换为字符串
export function base26Decode(s: bigint): string {
	if (s === 340282366920938463463374607431768211455n) {
		return 'BCGDENLQRQWDSLRUGSNLBTMFIJAV';
	}
	s += 1n;
	const symbol = [];
	while (s > 0) {
		const i = (s - 1n) % 26n;
		symbol.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(Number(i)));
		s = (s - 1n) / 26n;
	}
	return symbol.reverse().join('');
}

// 将一个bigint转换为leb128编码的数组
export function encodeLEB128(value: bigint): number[] {
	const bytes = [];
	let more = true;

	while (more) {
		let byte = Number(value & BigInt(0x7f)); // Get the lowest 7 bits
		value >>= BigInt(7);
		if (value === BigInt(0)) {
			more = false; // No more data to encode
		} else {
			// More bytes to come
			byte |= 0x80; // Set the continuation bit
		}
		bytes.push(byte);
	}
	// Convert array to Buffer
	return bytes;
}
// 将一个leb128编码的数组转换为bigint
export function decodeLEB128(buf: number[]): {n: bigint; len: number} {
	let n = BigInt(0);
	for (let i = 0; i < buf.length; i++) {
		const byte = BigInt(buf[i]);

		if (i > 18) throw new Error('Overlong');

		const value = byte & BigInt(0b0111_1111);

		if (i == 18 && (value & BigInt(0b0111_1100)) != BigInt(0)) throw new Error('Overflow');

		n |= value << (BigInt(7) * BigInt(i));

		if ((byte & BigInt(0b1000_0000)) == BigInt(0)) {
			return {n, len: i + 1};
		}
	}

	throw new Error('Unterminated');
}

// 符文名称间隔方法
// 将符文名称间隔添加到符文名称中
export function applySpacers(str: string, spacers: number): string {
	let res = '';
	for (let i = 0; i < str.length; i++) {
		res += str.charAt(i);

		if (spacers > 0) {
			// Get the least significant bit
			const bit = spacers & 1;

			if (bit === 1) {
				res += '•';
			}
			// Right shift the number to process the next bit
			spacers >>= 1;
		}
	}

	return res;
}
// 获取符文名称间隔在符文名称中的位置
export function getSpacersVal(str: string): number {
	let res = 0;
	let spacersCnt = 0;

	for (let i = 0; i < str.length; i++) {
		const char = str.charAt(i);

		if (char === '•') {
			res += 1 << (i - 1 - spacersCnt);
			spacersCnt++;
		}
	}
	return res;
}
// 删除符文名称间隔
export function removeSpacers(rune: string): string {
	return rune.replace(/[•]+/g, '');
}
