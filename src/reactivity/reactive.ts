import { ReactiveFlags, mutableHandlers, readonlyHandlers, shallowHandlers } from './baseHandlers'

export function reactive(target) {
	return createActiveObject(target, mutableHandlers)
}

export function readonly(target) {
	return createActiveObject(target, readonlyHandlers)
}

export function shallowReadonly(target) {
	return createActiveObject(target, shallowHandlers)
}

export function isReactive(value) {
	// value不是Proxy对象 是undefined的时候 取反
	// 兼容Proxy对象
	return !!value[ReactiveFlags.IS_REACTIVE]
}
export function isReadOnly(value) {
	// value不是Proxy对象 是undefined的时候 取反
	// 兼容Proxy对象
	return !!value[ReactiveFlags.IS_READONLY]
}

export function isProxy(value) {
	return isReactive(value) || isReadOnly(value)
}
function createActiveObject(target, baseHandlers) {
	return new Proxy(target, baseHandlers)
}
