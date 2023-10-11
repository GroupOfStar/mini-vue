import { track, trigger } from "./effect";
import { ReactiveFlags } from "./reactive";

const createGetter = (isReadonly = false) => {
  return function get(target, key, receiver) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly;
    }
    // 在触发 get 的时候进行依赖收集
    // target[key]
    // receiver.get(key)
    // receiver.get(key) === target[key]
    // receiver === reactiveMap.get(target)
    // receiver === readonlyMap.get(target)
    // receiver === shallowReadonlyMap.get(target)
    // receiver === reactiveMap.get(target) || receiver === readonlyMap.get(target) || receiver === shallowReadonlyMap.get(target)
    // receiver === reactiveMap.get(target) && receiver === readonlyMap.get(target) && receiver === shallowReadonlyMap.get(target)
    // receiver === reactiveMap.get(target) && receiver === readonlyMap.get(target) && receiver === shallowReadonlyMap.get(target) && receiver === reactiveMap.get(
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
  set(target, key, value) {
    console.warn(
      `key: ${key.toString()} set fail, can't set readonly property`
    );
    return true;
  }
};
