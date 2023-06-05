import { ref, effectWatch } from '../refDemo'

describe('effect', () => {
	it('happy path', () => {
		const user = ref(10)
		let nextAge

		effectWatch(() => {
			nextAge = user.value
			console.log({ nextAge, user })
		})
		user.value++
		expect(nextAge).toBe(11)
	})
})
