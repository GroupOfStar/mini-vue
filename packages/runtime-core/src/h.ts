import { CreateVNode, createVNode } from './vNode'

export const h: CreateVNode = (type, props, children) => {
  return createVNode(type, props, children)
}
