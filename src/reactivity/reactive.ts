import { ReactiveFlags, mutableHandlers, readonlyHandlers } from './baseHandlers'

export function reactive(target) {
	return createActiveObject(target, mutableHandlers)
}

export function readonly(target) {
	return createActiveObject(target, readonlyHandlers)
}
export function isReactive(value) {
	// value不是Proxy对象 是undefined的时候 取反
	// 兼容之前的
	return !!value[ReactiveFlags.IS_REACTIVE]
}
export function isReadOnly(value) {
	// value不是Proxy对象 是undefined的时候 取反
	// 兼容之前的
	return !!value[ReactiveFlags.IS_READONLY]
}

function createActiveObject(target, baseHandlers) {
	return new Proxy(target, baseHandlers)
}
