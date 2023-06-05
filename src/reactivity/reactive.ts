// @ts-nocheck
import { track, trigger } from './effect'
export function reactive(target) {
	return new Proxy(target, {
		get(target, key, receiver) {
			track(target, key)
			return Reflect.get(target, key, receiver)
		},
		set(target, key, newValue, receiver) {
			const result = Reflect.set(target, key, newValue, receiver)
			trigger(target, key)
			return result
		},
	})
}
