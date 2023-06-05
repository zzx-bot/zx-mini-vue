import { isReadOnly, readonly } from '../reactive'

describe('readonly', () => {
	it('happy path', () => {
		// not set
		const original = { foo: 1, bar: { baz: 2 } }
		const wrapped = readonly(original)
		expect(wrapped).not.toBe(original)
		expect(wrapped.bar.baz).toBe(2)
	})
	it('warn then call', () => {
		// mock 创建一个假的方法
		console.warn = jest.fn()
		const original = {
			foo: 10,
		}
		const observed = readonly(original)

		observed.foo = 11
		// console.warn()

		expect(console.warn).toBeCalled()
	})
	it('shuold make nested value readonly', () => {
		// not set
		const original = { foo: 1, bar: { baz: 2 } }
		const wrapped = readonly(original)
		expect(isReadOnly(wrapped)).toBe(true)
		expect(isReadOnly(original)).toBe(false)
		expect(wrapped.foo).toBe(1)
	})
})
