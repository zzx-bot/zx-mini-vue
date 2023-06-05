class ReactiveEffect {
	_fn: any

	constructor(fn) {
		this._fn = fn
	}
	run() {
		this._fn()
	}
}

const targetMaps = new Map()
let activeEffect

export function effect(fn) {
	const _effect = new ReactiveEffect(fn)
	activeEffect = _effect
	_effect.run()
}

export function track(target, key) {
	let dep = getDep(target, key)
	dep.add(activeEffect)
}

export function trigger(target, key) {
	let dep = getDep(target, key)
	for (const effect of dep) {
		effect.run()
	}
}

function getDep(target, key) {
	let depsMap = targetMaps.get(target)
	if (!depsMap) {
		depsMap = new Map()
		targetMaps.set(target, depsMap)
	}
	let dep = depsMap.get(key)
	if (!dep) {
		dep = new Set()
		depsMap.set(key, dep)
	}
	return dep
}
