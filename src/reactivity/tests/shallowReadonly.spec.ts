import { shallowReadonly, isReadOnly, isProxy } from '../reactive'

describe('shallowReadonly', () => {
	test('should not make non-reactive properties readonly', () => {
		const props = shallowReadonly({ n: { foo: 1 } })
		expect(isReadOnly(props)).toBe(true)
		expect(isReadOnly(props.n)).toBe(false)
	})
	it('shuold make nested value shallowReadonly', () => {
		// not set
		const original = { foo: 1, bar: { baz: 2 } }
		const wrapped = shallowReadonly(original)
		expect(isReadOnly(wrapped)).toBe(true)
		expect(isProxy(wrapped)).toBe(true)
		expect(isReadOnly(original)).toBe(false)

		expect(wrapped.foo).toBe(1)
	})
})
