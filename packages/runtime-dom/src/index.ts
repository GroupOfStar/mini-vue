import { createRenderer } from '@mini-vue/runtime-core'
import type { ComponentOptions, RendererOptions } from '@mini-vue/runtime-core'

const createElement: RendererOptions['createElement'] = function (type) {
  return document.createElement(type)
}

const patchProp: RendererOptions['patchProp'] = function (
  el,
  key,
  prevValue,
  nextValue
) {
  const isOn = (key: string) => /^on[A-Z]/.test(key)
  if (isOn(key)) {
    el.addEventListener(key.slice(2).toLowerCase(), nextValue as EventListener)
  } else {
    el.setAttribute(key, nextValue as string)
  }
}

const insert: RendererOptions['insert'] = function (el, parent) {
  parent.append(el)
}

const renderer = createRenderer({
  createElement,
  patchProp,
  insert
})

export function createApp(rootComponent: ComponentOptions) {
  return renderer.createApp(rootComponent)
}
