export const isObject = (val: any) => {
  return val !== null && typeof val === "object";
};

export const extend = Object.assign
