import { createVNode } from "./vNode";

export const h = (type, props, children) => {
  return createVNode(type, props, children);
};
