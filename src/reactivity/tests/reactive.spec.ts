import { reactive } from '../reactive'
import { effect } from '../effect'

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
})
