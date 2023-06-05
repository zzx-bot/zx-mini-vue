/**
 * 依赖类
 */

interface effectOption {
	scheduler?: Function
	onStop?: Function
}
class ReactiveEffect {
	_fn: Function
	onStop: Function | undefined
	scheduler: Function | undefined
	deps: Set<ReactiveEffect>[] = []
	active = true

	constructor(fn: Function, option?: effectOption) {
		this._fn = fn
		if (option) {
			this.scheduler = option.scheduler
			this.onStop = option.onStop
		}
	}
	run() {
		return this._fn()
	}
	stop() {
		if (this.onStop) {
			this.onStop()
		}
		if (this.active) {
			clearEffect(this)
			this.active = false
		}
	}
}
function clearEffect(effect: ReactiveEffect) {
	effect.deps.forEach(dep => {
		dep.delete(effect)
	})
}

const targetMaps = new Map()
let activeEffect

// 新建一个依赖
export function effect(fn: Function, option: effectOption = {}) {
	const _effect = new ReactiveEffect(fn, option)
	activeEffect = _effect
	_effect.run()
	const runner: any = _effect.run.bind(_effect)
	runner.effect = _effect
	return runner
}
// 依赖搜集
export function track(target, key) {
	if (!activeEffect) return

	let dep = getDep(target, key)
	dep.add(activeEffect)
	activeEffect.deps.push(dep)
	activeEffect = null
}
// 触发依赖
export function trigger(target, key) {
	let dep = getDep(target, key)
	for (const effect of dep) {
		if (effect.scheduler) effect.scheduler()
		else effect.run()
	}
}
// 从map中 取依赖
function getDep(target, key) {
	let depsMap = targetMaps.get(target)
	if (!depsMap) {
		depsMap = new Map()
		targetMaps.set(target, depsMap)
	}
	let dep = depsMap.get(key)
	if (!dep) {
		dep = new Set<ReactiveEffect>()
		depsMap.set(key, dep)
	}
	return dep
}

export function stop(runner: any) {
	runner.effect.stop()
}
