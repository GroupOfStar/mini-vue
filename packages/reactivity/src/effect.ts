import { extend } from "@mini-vue/shared";

interface ReactiveEffect {
  active?: boolean;
  deps: Dep[];
  run: Function;
  scheduler?: () => void;
  stop?: (runner: ReactiveEffect) => void;
  onStop?: () => void;
}

type Dep = Set<ReactiveEffect>;

type KeyToDepMap = Map<any, Dep>;

/** 收集的依赖 */
const reactiveMap = new WeakMap<object, KeyToDepMap>();

/** effect */
let activeEffect: ReactiveEffect;
let shouldTrack = true;

function isTracking() {
  return activeEffect && shouldTrack;
}

/** 依赖收集 */
export const track = (target, key: any) => {
  if (isTracking()) {
    let depsMap = reactiveMap.get(target);
    if (!depsMap) {
      depsMap = new Map();
      reactiveMap.set(target, depsMap);
    }
    let dep = depsMap.get(key);
    if (!dep) {
      dep = new Set();
      depsMap.set(key, dep);
    }
    if (!dep.has(activeEffect)) {
      dep.add(activeEffect);
      activeEffect.deps.push(dep);
    }
  }
};

/** 触发依赖 */
export const trigger = (target, key) => {
  const depsMap = reactiveMap.get(target);
  const dep = depsMap?.get(key);
  if (dep) {
    for (const effect of dep) {
      if (effect.scheduler) {
        effect.scheduler();
      } else {
        effect.run();
      }
    }
  }
};

/** 副作用收集 */
const effectMap = new WeakMap<Function, ReactiveEffect>();

export const effect = (fn: Function, options: any = {}) => {
  activeEffect = { run: fn, deps: [] };
  extend(activeEffect, options);
  effectMap.set(fn, activeEffect);
  fn();
  return fn;
};

export const stop = (runner: Function) => {
  const effect = effectMap.get(runner);
  if (effect) {
    if (effect.deps.length) {
      for (let i = 0; i < effect.deps.length; i++) {
        effect.deps[i].delete(effect);
      }
      effect.deps.length = 0;
    }
    if (effect.onStop) {
      effect.onStop();
    }
    effect.active = false;
    shouldTrack = false;
  }
};
