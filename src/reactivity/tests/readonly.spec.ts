import { isProxy, isReadOnly, readonly } from '../reactive'

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
	it('nest reactive', () => {
		const original = {
			nested: {
				foo: 1,
			},
			array: [{ bar: 2 }],
		}
		const observed = readonly(original)

		expect(isReadOnly(observed)).toBe(true)
		expect(isReadOnly(observed.nested)).toBe(true)
		expect(isProxy(observed.nested)).toBe(true)
		expect(isReadOnly(observed.nested.foo)).toBe(false)
		expect(isReadOnly(observed.array)).toBe(true)
		expect(isReadOnly(observed.array[0])).toBe(true)
	})
})
