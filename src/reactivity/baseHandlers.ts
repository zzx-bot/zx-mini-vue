import { extend, isObject } from '../shared'
import { track, trigger } from './effect'
import { reactive, readonly } from './reactive'
export enum ReactiveFlags {
	IS_REACTIVE = '__is_reactive',
	IS_READONLY = '__is_readonly',
}

const get = createGetter()
const set = createSetter()

const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

function createGetter(isreadonly = false, isShallow = false) {
	return function get(target, key, receiver) {
		if (key === ReactiveFlags.IS_REACTIVE) {
			return !isreadonly
		} else if (key === ReactiveFlags.IS_READONLY) {
			return isreadonly
		}

		const result = Reflect.get(target, key, receiver)
		if (isShallow) return result

		if (isObject(result)) {
			// 包装子对象 为reactive
			return isreadonly ? readonly(result) : reactive(result)
		}
		if (!isreadonly) {
			track(target, key)
		}
		return result
	}
}
function createSetter() {
	return function set(target, key, newValue, receiver) {
		const result = Reflect.set(target, key, newValue, receiver)

		trigger(target, key)
		return result
	}
}

export const mutableHandlers = {
	get,
	set,
}
export const readonlyHandlers = {
	get: readonlyGet,
	set: function set(target, key) {
		console.warn(`key${key} set 失败，因为${target}是readonly`)
		return true
	},
}

export const shallowHandlers = extend({}, readonlyHandlers, { get: shallowReadonlyGet })
