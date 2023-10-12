export const isObject = (val: any) => {
  return val !== null && typeof val === "object";
};

export const extend = Object.assign;

export const hasChanged = (newValue: any, oldValue: any) => {
  return !Object.is(newValue, oldValue);
};
