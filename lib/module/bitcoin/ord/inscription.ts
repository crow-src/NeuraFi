import {script, Stack} from 'bitcoinjs-lib';
import {OPS} from 'bitcoinjs-lib/src/ops';

/**
 * Ordinals 铭文字段标签枚举
 */
export enum InscriptionTag {
	ContentType = 1,
	Pointer = 2,
	Parent = 3,
	Metadata = 5,
	Metaprotocol = 7,
	ContentEncoding = 9,
	Delegate = 11
}

/**
 * 常见的 MIME 类型
 */
export enum InscriptionType {
	TEXT = 'text/plain;charset=utf-8',
	JSON = 'application/json',
	HTML = 'text/html;charset=utf-8',
	SVG = 'image/svg+xml',
	PNG = 'image/png',
	JPEG = 'image/jpeg',
	GIF = 'image/gif',
	WEBP = 'image/webp',
	PDF = 'application/pdf',
	ZIP = 'application/zip'
}

/**
 * 铭文初始化参数
 */
export interface InscriptionOptions {
	contentType: string;
	body: string | Buffer;
	pointer?: number; // 可选的指针字段，指定铭文应该铭刻在哪个聪上
}

/**
 * Ordinals 铭文封装类
 */
export class Inscription {
	private fields: [number, Buffer][] = [];
	private body: Buffer = Buffer.alloc(0);
	private contentType: string;
	private pointer?: number; // 指针字段

	constructor(options: InscriptionOptions) {
		// 不再添加 content-type 字段，因为版本字段已经包含了
		this.body = typeof options.body === 'string' ? Buffer.from(options.body, 'utf8') : options.body;
		this.contentType = options.contentType;
		this.pointer = options.pointer; // 保存指针值
	}

	/**
	 * 编码信封（不包含公钥验证）
	 * @returns 编码后的信封 Buffer
	 */
	encodeEnvelope(): Buffer {
		// 根据参考实现构建铭文脚本（不包含公钥验证部分）
		const inscriptionBuilder: Stack = [];

		inscriptionBuilder.push(OPS.OP_0);
		inscriptionBuilder.push(OPS.OP_IF);
		inscriptionBuilder.push(Buffer.from('ord'));
		inscriptionBuilder.push(0x01);
		inscriptionBuilder.push(0x01);
		inscriptionBuilder.push(Buffer.from(this.contentType));

		// // 如果指定了指针，添加指针字段（标签2）
		// if (this.pointer !== undefined) {
		// 	console.log('=== 添加指针字段 ===');
		// 	console.log('指针值:', this.pointer);
		// 	console.log('指针标签:', InscriptionTag.Pointer);
		// 	inscriptionBuilder.push(0x02); // 标签2
		// 	const encodedPointer = this.encodePointer(this.pointer); // 编码指针值
		// 	if (typeof encodedPointer === 'number') {
		// 		console.log('编码后的指针(数字):', encodedPointer);
		// 	} else {
		// 		console.log('编码后的指针(Buffer):', encodedPointer.toString('hex'));
		// 	}
		// 	inscriptionBuilder.push(encodedPointer as StackElement); // 显式转换为StackElement
		// 	console.log('=== 指针字段添加完成 ===');
		// }

		inscriptionBuilder.push(OPS.OP_0);

		const maxChunkSize = 520;
		const body = this.body;
		const bodySize = body.length;
		for (let i = 0; i < bodySize; i += maxChunkSize) {
			let end = i + maxChunkSize;
			if (end > bodySize) {
				end = bodySize;
			}
			inscriptionBuilder.push(body.subarray(i, end));
		}
		inscriptionBuilder.push(OPS.OP_ENDIF);

		const inscriptionScript = script.compile(inscriptionBuilder);
		return inscriptionScript;
	}

	/**
	 * 编码指针值
	 * @param pointer 指针值
	 * @returns 编码后的指针（数字或Buffer）
	 */
	private encodePointer(pointer: number): number | Buffer {
		console.log('=== encodePointer 调试信息 ===');
		console.log('输入的指针值:', pointer);
		console.log('指针值类型:', typeof pointer);

		// 如果指针值很小（0-16），直接返回数字字面量
		if (pointer >= 0 && pointer <= 16) {
			console.log('使用数字字面量:', pointer);
			console.log('=== encodePointer 调试结束 ===');
			return pointer;
		}

		// 对于较大的值，使用小端序字节数组
		const buffer = Buffer.alloc(8);
		buffer.writeUInt32LE(pointer, 0);
		console.log('原始8字节buffer:', buffer.toString('hex'));

		// 移除尾随的零字节（根据Ordinals规范）
		let lastNonZero = 0;
		for (let i = 0; i < buffer.length; i++) {
			if (buffer[i] !== 0) {
				lastNonZero = i;
			}
		}
		console.log('最后一个非零字节的索引:', lastNonZero);

		const result = buffer.slice(0, lastNonZero + 1);
		console.log('最终编码结果:', result.toString('hex'));
		console.log('最终编码长度:', result.length, '字节');
		console.log('=== encodePointer 调试结束 ===');

		return result;
	}

	/**
	 * 获取完整的铭文脚本（包含公钥验证）
	 * @param publicKey 公钥
	 * @returns 完整的脚本 Buffer
	 */
	getFullScript(publicKey: Buffer): Buffer {
		// 确保使用32字节的x-only公钥
		let pubKey = publicKey;
		if (pubKey.length === 33) {
			pubKey = pubKey.slice(1);
		}

		// 直接构建完整脚本，避免双重编译
		const inscriptionBuilder: Stack = [];

		inscriptionBuilder.push(pubKey);
		inscriptionBuilder.push(OPS.OP_CHECKSIG);
		inscriptionBuilder.push(OPS.OP_0);
		inscriptionBuilder.push(OPS.OP_IF);
		inscriptionBuilder.push(Buffer.from('ord'));
		inscriptionBuilder.push(0x01);
		inscriptionBuilder.push(0x01);
		inscriptionBuilder.push(Buffer.from(this.contentType));

		// // 如果指定了指针，添加指针字段（标签2）
		// if (this.pointer !== undefined) {
		// 	console.log('=== getFullScript 添加指针字段 ===');
		// 	console.log('指针值:', this.pointer);
		// 	inscriptionBuilder.push(0x02); // 标签2
		// 	const encodedPointer = this.encodePointer(this.pointer); // 编码指针值
		// 	if (typeof encodedPointer === 'number') {
		// 		console.log('编码后的指针(数字):', encodedPointer);
		// 	} else {
		// 		console.log('编码后的指针(Buffer):', encodedPointer.toString('hex'));
		// 	}
		// 	inscriptionBuilder.push(encodedPointer as StackElement);
		// 	console.log('=== getFullScript 指针字段添加完成 ===');
		// }

		inscriptionBuilder.push(OPS.OP_0);

		const maxChunkSize = 520;
		const body = this.body;
		const bodySize = body.length;
		for (let i = 0; i < bodySize; i += maxChunkSize) {
			let end = i + maxChunkSize;
			if (end > bodySize) {
				end = bodySize;
			}
			inscriptionBuilder.push(body.subarray(i, end));
		}
		inscriptionBuilder.push(OPS.OP_ENDIF);

		const fullScript = script.compile(inscriptionBuilder);
		return fullScript;
	}

	/**
	 * 获取排序后的字段列表
	 */
	getSortedFields(): [number, Buffer][] {
		return [...this.fields].sort((a, b) => a[0] - b[0]);
	}

	/**
	 * 获取正文内容
	 */
	getBody(): Buffer {
		return this.body;
	}

	/**
	 * 获取指针值
	 */
	getPointer(): number | undefined {
		return this.pointer;
	}

	/**
	 * 检查是否包含指针
	 */
	hasPointer(): boolean {
		return this.pointer !== undefined;
	}
}
