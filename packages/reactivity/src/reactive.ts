import { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers } from "./baseHandlers";

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
  IS_SHALLOW_READONLY = "__v_isShallowReadonly",
  IS_REF = "__v_isRef",
  RAW = "__v_raw"
}

export const reactive = (raw: any) => {
  return new Proxy(raw, mutableHandlers);
};

export const readonly = (raw: any) => {
  return new Proxy(raw, readonlyHandlers);
};


export const shallowReadonly = (raw: any) => {
  return new Proxy(raw, shallowReadonlyHandlers);
};

export const isReactive = (value: any) => {
  return !!value[ReactiveFlags.IS_REACTIVE];
};

export const isReadonly = (value: any) => {
  return !!value[ReactiveFlags.IS_READONLY];
};

export const isShallowReadonly = (value: any) => {
  return !!value[ReactiveFlags.IS_SHALLOW_READONLY];
}

export const isPorxy = (value: any) => {
  return isReactive(value) || isReadonly(value) || isShallowReadonly(value);
}
