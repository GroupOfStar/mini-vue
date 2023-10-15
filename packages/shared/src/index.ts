export const isObject = (val: any) => {
  return val !== null && typeof val === "object";
};

export const extend = Object.assign;

export const hasChanged = (newValue: any, oldValue: any) => {
  return !Object.is(newValue, oldValue);
};

export const hasOwn = (target: any, key: string) => {
  return Object.prototype.hasOwnProperty.call(target, key);
};

export { ShapeFlags } from "./ShapeFlags";
