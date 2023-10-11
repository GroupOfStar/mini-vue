import {
  mutableHandlers,
  readonlyHandlers,
  shallowReadonlyHandlers
} from "./baseHandlers";

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
  IS_SHALLOW = "__v_isShallow",
  IS_REF = "__v_isRef",
  RAW = "__v_raw"
}

function createActiveObject(raw: any, baseHandlers) {
  return new Proxy(raw, baseHandlers);
}

export const reactive = (raw: any) => {
  return createActiveObject(raw, mutableHandlers);
};

export const readonly = (raw: any) => {
  return createActiveObject(raw, readonlyHandlers);
};

export const shallowReadonly = (raw: any) => {
  return createActiveObject(raw, shallowReadonlyHandlers);
};

export const isReactive = value => !!value[ReactiveFlags.IS_REACTIVE];

export const isReadonly = value => !!value[ReactiveFlags.IS_READONLY];

export const isShallowReadonly = (raw: any) => !!raw[ReactiveFlags.IS_SHALLOW];

export const isProxy = (value: any) => {
  return isReactive(value) || isReadonly(value) || isShallowReadonly(value);
};
