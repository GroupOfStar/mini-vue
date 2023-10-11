import { isObject } from "@mini-vue/shared";
import { track, trigger } from "./effect";
import { ReactiveFlags, reactive, readonly } from "./reactive";

const createGetter = (isReadonly = false, shallow = false) => {
  return function get(target, key, receiver) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly;
    } else if (key === ReactiveFlags.IS_SHALLOW_READONLY) {
      return shallow;
    }
    // 在触发 get 的时候进行依赖收集
    const res = Reflect.get(target, key, receiver);
    if (shallow) {
      return res;
    }
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }
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
const shallowReadonlyGet = createGetter(true, true);

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

export const shallowReadonlyHandlers = {
  ...readonlyHandlers,
  get: shallowReadonlyGet
};
