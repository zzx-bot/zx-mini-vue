import { ReactiveEffect, trackEffect } from './effect'

class ComputedRefImpl {
	private _getter: any
	private _dirty: boolean = true
	private _value: any
	_effect: ReactiveEffect

	constructor(getter) {
		this._getter = getter
		this._effect = new ReactiveEffect(getter, () => {
			if (!this._dirty) {
				this._dirty = true
			}
		})
	}
	get value() {
		// 初始调用一次后  缓存上次值

		// 当依赖的值发生改变时  this._dirty =true
		if (this._dirty) {
			this._dirty = false
			this._value = this._effect.run()
		}
		return this._value
	}
}

export function computed(getter) {
	return new ComputedRefImpl(getter)
}
