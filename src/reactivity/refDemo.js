// @ts-nocheck
let curEffect
class Ref {
	_value
	effectList = []
	constructor(value) {
		this._value = value
	}

	get value() {
		console.log('get')
		this.depend()
		return this._value
	}

	set value(v) {
		console.log('set')
		this._value = v
		this.notice()
	}

	depend() {
		if (curEffect) this.effectList.push(curEffect)
	}

	notice() {
		this.effectList.forEach(effect => {
			effect()
		})
	}
}
export function ref(value) {
	return new Ref(value)
}

export function effectWatch(effect) {
	curEffect = effect
}

// let valueNext

// const user = new ref(10)
// effectWatch(() => {
// 	valueNext = user.value
// 	console.log('valueNext', valueNext)
// })

// user.value = 20

// console.log('user', user)
// console.log('valueNext', valueNext)
// user.value++
