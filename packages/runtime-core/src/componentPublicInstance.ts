import { hasOwn } from '@mini-vue/shared'
import { ComponentInternalInstance } from './component'

const publicPropertiesMap = {
  $el: (i: ComponentInternalInstance) => i.vNode.el,
  $slots: (i: ComponentInternalInstance) => i.slots
}

interface ComponentRenderContext {
  _: ComponentInternalInstance
  [key: string]: any
}

export const PublicInstanceProxyHandlers: ProxyHandler<any> = {
  get({ _: instance }: ComponentRenderContext, key: string) {
    const { setupState, props } = instance
    if (hasOwn(setupState, key)) {
      return setupState[key]
    } else if (hasOwn(props, key)) {
      return props[key]
    } else if (hasOwn(publicPropertiesMap, key)) {
      return publicPropertiesMap[key](instance)
    }
  }
}
