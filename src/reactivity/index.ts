// @ts-nocheck
var curEffect

export function Reactive(obj) {
	var agent = {}
	var effects = []

	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			this.key = obj.value

			Reflect.defineProperty(agent, key, {
				get() {
					console.log('get')
					depend()
					return this.key
				},

				set(v) {
					console.log('set')
					this.key = v
					notice()
				},
			})
		}
	}

	// 1.收集依赖
	function depend() {
		if (curEffect) {
			effects.push(curEffect)
		}
	}

	// 2.触发依赖
	function notice() {
		effects.forEach(fn => {
			fn()
		})
	}

	return agent
}
export function effectWatch(effect) {
	curEffect = effect
	effect()
}

const reactive = new Reactive({
	value: 10,
})

let valueNext

effectWatch(() => {
	valueNext = reactive.value
	console.log('effect valueNext', valueNext)
})

reactive.value = 20

// console.log('valueNext', valueNext)

reactive.value++
