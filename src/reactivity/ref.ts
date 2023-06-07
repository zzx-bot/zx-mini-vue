import { hasChanged, isObject } from '../shared'
import { mutableHandlers } from './baseHandlers'
import { trackEffect, triggerEffect } from './effect'
import { reactive } from './reactive'

class RefImpl {
	_value: any
	dep: any
	_rawValue: any
	__v_isRef = true
	__v_isShallow = false
	constructor(value) {
		this._rawValue = value
		this._value = convert(value)

		this.dep = new Set()
	}
	get value() {
		trackEffect(this.dep, false)
		return this._value
	}
	set value(newValue) {
		// 更新值相等  不在触发依赖
		if (hasChanged(newValue, this._rawValue)) return
		this._rawValue = newValue
		this._value = convert(newValue)
		triggerEffect(this.dep)
	}
}

export function ref(value) {
	return new RefImpl(value)
}
export function isRef(value) {
	return !!value.__v_isRef
}

export function unRef(value) {
	return isRef(value) ? value._rawValue : value
}
export function proxyRefs(target) {
	if (!isObject(target)) return target

	return new Proxy(target, {
		get(target, key, receiver) {
			return unRef(Reflect.get(target, key, receiver))
		},
		set(target, key, newValue, receiver) {
			if (isRef(target[key]) && !isRef(newValue)) {
				target[key].value = newValue
				return true
			} else {
				return Reflect.set(target, key, newValue, receiver)
			}
		},
	})
}

function convert(value) {
	return isObject(value) ? reactive(value) : value
}
