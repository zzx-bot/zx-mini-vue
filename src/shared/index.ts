export const extend = Object.assign

export const isObject = value => {
	return value !== null && typeof value === 'object'
}
export const hasChanged = (val, newValue) => Object.is(val, newValue)
