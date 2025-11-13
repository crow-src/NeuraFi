// Option 类型实现，用于安全地表示"可能有值"或"无值"的场景
// 类似于 Rust/Scala/FP 语言中的 Option/Maybe 类型

/**
 * Option 接口，定义了 Option 类型的基本行为
 * @template T Option 包裹的值类型
 */
interface IOption<T> {
	/**
	 * 判断当前 Option 是否有值
	 * @returns {boolean} 有值返回 true，无值返回 false
	 */
	isSome: () => boolean;
	/**
	 * 获取 Option 包裹的值
	 * @returns {T} 有值时返回值，无值时返回 null
	 */
	value: () => T;
}

/**
 * None 类，表示"无值"的 Option
 * 实现 IOption<null>
 */
class None implements IOption<null> {
	constructor() {}
	/**
	 * 无值，始终返回 false
	 */
	isSome(): boolean {
		return false;
	}
	/**
	 * map 方法，无论传入什么函数，始终返回新的 None
	 * @param f 任意函数（不会被调用）
	 * @returns {None}
	 */
	map(f: (a: never) => unknown): None {
		return new None();
	}
	/**
	 * 获取值，始终返回 null
	 */
	value(): null {
		return null;
	}
}

/**
 * Some<T> 类，表示"有值"的 Option
 * 实现 IOption<T>
 * @template T 包裹的值类型
 */
class Some<T> implements IOption<T> {
	private readonly _value: T;

	/**
	 * 构造函数，传入要包裹的值
	 * @param value 需要包裹的值
	 */
	constructor(value: T) {
		this._value = value;
	}

	/**
	 * 有值，始终返回 true
	 */
	isSome(): boolean {
		return true;
	}

	/**
	 * map 方法，对包裹的值应用函数 f，返回新的 Some 包裹结果
	 * @param f 处理函数
	 * @returns {Some<S>} 新的 Some 实例
	 */
	map<S>(f: (a: T) => S): Some<S> {
		return new Some(f(this.value()));
	}

	/**
	 * 获取包裹的值
	 * @returns {T}
	 */
	value(): T {
		return this._value;
	}
}

/**
 * some 工厂函数，创建一个有值的 Option（Some）
 * @param t 需要包裹的值
 * @returns {Some<T>} Some 实例
 */
export function some<T>(t: T): Some<T> {
	return new Some(t);
}

/**
 * none 工厂函数，创建一个无值的 Option（None）
 * @returns {None} None 实例
 */
export function none(): None {
	return new None();
}

/**
 * Option<T> 类型，表示 None 或 Some<T>
 * @template T Option 包裹的值类型
 */
export type Option<T> = None | Some<T>;
