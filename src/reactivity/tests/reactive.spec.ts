import { isReactive, reactive, readonly } from '../reactive'
import { effect, stop } from '../effect'

describe('reactive', () => {
	it('happy path', () => {
		const original = {
			foo: 10,
		}
		const observed = reactive(original)
		let next
		effect(() => {
			next = observed.foo
		})

		observed.foo++
		// console.log(observed)

		expect(next).toBe(11)
	})

	it('should return runner when call effect', () => {
		let foo = 10
		const runner = effect(() => {
			foo++
			return 'foo'
		})
		expect(foo).toBe(11)
		const r = runner()
		expect(foo).toBe(12)
		expect(r).toBe('foo')
	})
	it('scheduler', () => {
		// 1.通过effect 的传入第二个参数(Object), 带有scheduler(function类型)
		// 2.effect 第一次执行时，执行一个参数fn（function类型）
		// 3.当响应式对象set update 不会执行fn，而是执行scheduler
		// 4.如果执行runner 时会再次执行fn

		let dummy
		let run: any

		const scheduler = jest.fn(() => {
			run = runner
		})
		const obj = reactive({ foo: 1 })
		const runner = effect(
			() => {
				dummy = obj.foo
			},
			{ scheduler }
		)

		expect(scheduler).not.toHaveBeenCalled()
		expect(dummy).toBe(1)
		// should be called on first trigger
		obj.foo++
		expect(scheduler).toHaveBeenCalledTimes(1)
		// // should not run yet
		expect(dummy).toBe(1) // // manually run
		run() // // should have run
		expect(dummy).toBe(2)
	})

	it('stop', () => {
		// 1.通过effect 的传入第二个参数(Object), 带有scheduler(function类型)
		// 2.effect 第一次执行时，执行一个参数fn（function类型）
		// 3.当响应式对象set update 不会执行fn，而是执行scheduler
		// 4.如果执行runner 时会再次执行fn

		let dummy, nextProp
		const obj = reactive({ prop: 1 })
		const runner = effect(() => {
			dummy = obj.prop
		})
		obj.prop = 2
		expect(dummy).toBe(2)
		stop(runner)
		obj.prop++
		expect(dummy).toBe(2)

		// stopped effect should still be manually callable
		runner()

		expect(dummy).toBe(3)

		effect(() => {
			nextProp = obj.prop + 1
		})
		expect(nextProp).toBe(4)
	})
	it('onStop', () => {
		const obj = reactive({ foo: 1 })
		const onStop = jest.fn()
		let dummy
		const runner = effect(
			() => {
				dummy = obj.foo
			},
			{ onStop }
		)

		stop(runner)
		expect(onStop).toBeCalledTimes(1)
	})

	it('isReactive', () => {
		const original = { foo: 10 }
		const observed = reactive(original)
		const readonly2 = readonly(original)
		expect(isReactive(observed)).toBe(true)
		expect(isReactive(original)).toBe(false)
		expect(isReactive(1)).toBe(false)
	})
})
