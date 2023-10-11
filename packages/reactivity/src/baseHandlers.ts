import { track, trigger } from "./effect";
import { ReactiveFlags } from "./reactive";

const createGetter = (isReadonly = false) => {
  return function get(target, key, receiver) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    }
    if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly;
    }

    // 收集依赖，返回值
    // 这里返回的是一个函数，调用这个函数就是触发依赖的函数
    const res = Reflect.get(target, key, receiver);
    if (!isReadonly) {
      track(target, key);
    }
    return res;
  };
};

const createSetter = () => {
  return function set(target, key, value, receiver) {
    const res = Reflect.set(target, key, value, receiver);
    trigger(target, key);
    return res;
  };
};

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);

export const mutableHandlers = {
  get,
  set
};

export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key, value, receiver) {
    console.warn(`key:${key} set failed, target is readonly`);
    return true;
  }
};
