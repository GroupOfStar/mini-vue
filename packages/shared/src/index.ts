export const isObject = (val: any) => {
  return val !== null && typeof val === 'object'
}

export const EMPTY_OBJ: { readonly [key: string]: any } = {}

export const extend = Object.assign

export const hasChanged = (newValue: any, oldValue: any) => {
  return !Object.is(newValue, oldValue)
}

export const hasOwn = (target: any, key: string) => {
  return Object.prototype.hasOwnProperty.call(target, key)
}

/**
 * string首字母大写
 * @param str string
 */
export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * string转-驼峰
 * @param str string
 * @returns string
 */
export const camelize = (str: string) => {
  return str.replace(/-(\w)/g, (_, c: string) => {
    return c ? c.toUpperCase() : ''
  })
}

export { ShapeFlags } from './ShapeFlags'
