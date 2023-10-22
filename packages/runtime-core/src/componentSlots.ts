import { ShapeFlags } from '@mini-vue/shared'
import { ComponentInternalInstance, Data } from './component'
import { RawSlots, VNode } from './vNode'

export const initSlots = (
  instance: ComponentInternalInstance,
  children?: VNode | VNode[] | RawSlots
) => {
  const { vNode, slots } = instance
  if (vNode.shapeFlags & ShapeFlags.SLOTS_CHILDREN) {
    normalizeObjectSlots(children, slots)
  }
}

function normalizeObjectSlots(
  children: VNode | RawSlots | VNode[] | undefined,
  slots: ComponentInternalInstance['slots']
) {
  if (children) {
    Object.entries(children as VNode[] | RawSlots).forEach(([key, value]) => {
      slots[key] =
        typeof value === 'function'
          ? (props: Data) => normalizeSlotValue(value(props))
          : normalizeSlotValue(value)
    })
  }
}

function normalizeSlotValue(value: VNode): VNode[] {
  return Array.isArray(value) ? value : [value]
}
