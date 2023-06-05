import { isObject } from '../shared'
import { track, trigger } from './effect'
import { reactive } from './reactive'
export enum ReactiveFlags {
	IS_REACTIVE = '__is_reactive',
	IS_READONLY = '__is_readonly',
}

const get = createGetter()
const set = createSetter()

const readonlyGet = createGetter(true)

function createGetter(isreadonly = false) {
	return function get(target, key, receiver) {
		if (key === ReactiveFlags.IS_REACTIVE) {
			return !isreadonly
		} else if (key === ReactiveFlags.IS_READONLY) {
			return isreadonly
		}
		if (!isreadonly) {
			track(target, key)
		}
		return Reflect.get(target, key, receiver)
	}
}
function createSetter() {
	return function set(target, key, newValue, receiver) {
		const result = Reflect.set(target, key, newValue, receiver)
		if (isObject(result)) reactive(result)
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
