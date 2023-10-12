export const isObject = (val: any) => {
  return val !== null && typeof val === "object";
};

export const extend = Object.assign

export const hasChanged = (newVal: any, oldVal: any) => {
  return !Object.is(newVal, oldVal)
}
