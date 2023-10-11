import { extend } from "@mini-vue/shared";

let activeEffect;
let shouldTrack;

class ReactiveEffect {
  private _fn: any;
  public deps: Array<Set<any>> = [];
  public active = true;
  public onStop?: () => void;
  constructor(fn, public scheduler?) {
    this._fn = fn;
  }
  run() {
    if (!this.active) {
      return this._fn();
    }
    shouldTrack = true;
    activeEffect = this;
    const result = this._fn();
    shouldTrack = false;
    return result;
  }
  stop() {
    if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}

function cleanupEffect(effect) {
  if (effect.deps.length) {
    for (let i = 0; i < effect.deps.length; i++) {
      effect.deps[i].delete(effect);
    }
    effect.deps.length = 0;
  }
}

function isTracking() {
  return shouldTrack && activeEffect !== undefined;
}

const targetMap = new Map();
export const track = (target, key) => {
  if (isTracking()) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      depsMap = new Map();
      targetMap.set(target, depsMap);
    }
    let dep: Set<any> = depsMap.get(key);
    if (!dep) {
      dep = new Set();
      depsMap.set(key, dep);
    }
    // 不在dep中
    if (!dep.has(activeEffect)) {
      dep.add(activeEffect);
      activeEffect.deps.push(dep);
    }
  }
};

export const trigger = (target, key) => {
  const depsMap = targetMap.get(target);
  const dep = depsMap.get(key);

  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
};

export const effect = (fn, options: any = {}) => {
  const { scheduler } = options;
  const _effect = new ReactiveEffect(fn, scheduler);
  extend(_effect, options);
  _effect.run();
  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
};

export const stop = runner => {
  runner.effect.stop();
};
