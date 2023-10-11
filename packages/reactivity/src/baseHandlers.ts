// export const mutableHandlers = {
//   get: (target, key, receiver) => {
//     const isExistInReactiveMap = () =>
//       key === ReactiveFlags.RAW && receiver === reactiveMap.get(target);

import { c } from "vitest/dist/reporters-5f784f42";
import { track, trigger } from "./effect";

//     const isExistInReadonlyMap = () =>
//       key === ReactiveFlags.RAW && receiver === readonlyMap.get(target);

//     const isExistInShallowReadonlyMap = () =>
//       key === ReactiveFlags.RAW && receiver === shallowReadonlyMap.get(target);

//     if (key === ReactiveFlags.IS_REACTIVE) {
//       return !isReadonly;
//     } else if (key === ReactiveFlags.IS_READONLY) {
//       return isReadonly;
//     } else if (
//       isExistInReactiveMap() ||
//       isExistInReadonlyMap() ||
//       isExistInShallowReadonlyMap()
//     ) {
//       return target;
//     }

//     const res = Reflect.get(target, key, receiver);

//     // 问题：为什么是 readonly 的时候不做依赖收集呢
//     // readonly 的话，是不可以被 set 的， 那不可以被 set 就意味着不会触发 trigger
//     // 所有就没有收集依赖的必要了

//     if (!isReadonly) {
//       // 在触发 get 的时候进行依赖收集
//       track(target, "get", key);
//     }

//     if (shallow) {
//       return res;
//     }

//     if (isObject(res)) {
//       // 把内部所有的是 object 的值都用 reactive 包裹，变成响应式对象
//       // 如果说这个 res 值是一个对象的话，那么我们需要把获取到的 res 也转换成 reactive
//       // res 等于 target[key]
//       return isReadonly ? readonly(res) : reactive(res);
//     }

//     return res;
//   }
// };

const createGetter = (isReadonly = false) => {
  return function get(target, key, receiver) {
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
