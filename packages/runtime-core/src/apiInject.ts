import { getCurrentInstance } from './component'

export const provider = (key: string, value: string) => {
  // 存
  const currentInstance = getCurrentInstance()
  if (currentInstance) {
    let { providers } = currentInstance
    const parentProviders = currentInstance.parent?.providers || {}

    // init
    if (providers === parentProviders) {
      providers = currentInstance.providers = Object.create(parentProviders)
    }
    providers[key] = value
  }
}

export const inject = (key: string, defaultValue?: string | (() => void)) => {
  // 取
  const currentInstance = getCurrentInstance()
  const { parent } = currentInstance || {}
  const parentProviders = parent?.providers || {}
  if (key in parentProviders) {
    return parentProviders[key]
  } else {
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue
  }
}
