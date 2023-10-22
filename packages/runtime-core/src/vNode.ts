import { ShapeFlags } from '@mini-vue/shared'
import { ComponentOptions } from './createApp'
import { Data } from './component'

export type VNodeTypes = string | Symbol | ComponentOptions

export type RawSlots = {
  [name: string]: VNode | ((props?: Data) => VNode)
}

export type VNodeChild =
  | undefined
  | string
  | VNode
  | VNode[]
  | RawSlots
  | ((props: Data) => VNode)

export interface VNode {
  type: VNodeTypes
  props: Data
  children: VNodeChild
  shapeFlags: ShapeFlags
  el?: HTMLElement | Text
  key?: string
}

export type CreateVNode = (
  type: VNodeTypes,
  props: Data,
  children: VNodeChild
) => VNode

export const Fragment = Symbol('Fragment')

export const Text = Symbol('Text')

function getShapeFlags(type: VNodeTypes) {
  return typeof type === 'string'
    ? ShapeFlags.ELEMENT
    : ShapeFlags.STATEFUL_COMPONENT
}

export const createVNode: CreateVNode = (type, props = {}, children) => {
  const vNode = {
    type,
    shapeFlags: getShapeFlags(type),
    props,
    children
  }

  // children
  if (typeof children === 'string') {
    vNode.shapeFlags = vNode.shapeFlags | ShapeFlags.TEXT_CHILDREN
  } else if (Array.isArray(children)) {
    vNode.shapeFlags = vNode.shapeFlags | ShapeFlags.ARRAY_CHILDREN
  }

  normalizeChildren(vNode, children)

  return vNode
}

export function normalizeChildren(vNode: any, children: VNodeChild) {
  if (typeof children === 'object') {
    // 暂时主要是为了标识出 slots_children 这个类型来
    // 暂时我们只有 element 类型和 component 类型的组件
    // 所以我们这里除了 element ，那么只要是 component 的话，那么children 肯定就是 slots 了
    if (vNode.shapeFlags & ShapeFlags.ELEMENT) {
      // 如果是 element 类型的话，那么 children 肯定不是 slots
    } else {
      // 这里就必然是 component 了,
      vNode.shapeFlags |= ShapeFlags.SLOTS_CHILDREN
    }
  }
}

export const createTextVNode = (text: string) => {
  return createVNode(Text, {}, text)
}
