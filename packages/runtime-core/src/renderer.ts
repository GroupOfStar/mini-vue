import { effect } from '@mini-vue/reactivity'
import { EMPTY_OBJ, ShapeFlags } from '@mini-vue/shared'
import { Fragment, Text, VNode } from './vNode'
import { ComponentOptions, RootRenderFunction, createAppApi } from './createApp'
import {
  ComponentInternalInstance,
  Data,
  createComponentInstance,
  setupComponent
} from './component'

export interface RendererOptions {
  createElement(type: string): HTMLElement
  patchProp(
    el: HTMLElement,
    key: string,
    prevValue?: string | EventListener,
    nextValue?: string | EventListener
  ): void
  insert(el: HTMLElement, parent: Element, anchor?: HTMLElement): void
  remove(el: HTMLElement | Text): void
  setElementText(el: HTMLElement | Text, text: string): void
}

export function createRenderer(options: RendererOptions) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText
  } = options

  const render: RootRenderFunction = function (vNode, container) {
    patch(undefined, vNode, container, undefined)
  }

  /** 补丁 */
  function patch(
    n1: VNode | undefined,
    n2: VNode,
    container: Element,
    parentComponent?: ComponentInternalInstance,
    anchor?: HTMLElement
  ) {
    const { type, shapeFlags } = n2
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent, anchor)
        break
      case Text:
        processText(n1, n2, container)
        break
      default: {
        if (shapeFlags & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent, anchor)
        } else if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, parentComponent, anchor)
        }
        break
      }
    }
  }

  function processFragment(
    n1: VNode | undefined,
    n2: VNode,
    container: Element,
    parentComponent?: ComponentInternalInstance,
    anchor?: HTMLElement
  ) {
    mountChildren(n2, container, parentComponent, anchor)
  }

  function processText(n1: VNode | undefined, n2: VNode, container: Element) {
    const { children } = n2
    const el = (n2.el = document.createTextNode(children as string))
    container.appendChild(el)
  }

  function mountChildren(
    vNode: VNode,
    container: Element,
    parentComponent?: ComponentInternalInstance,
    anchor?: HTMLElement
  ) {
    const children = vNode.children as VNode[]
    children.forEach(child => {
      patch(undefined, child, container, parentComponent, anchor)
    })
  }

  // 操作element节点
  function processElement(
    n1: VNode | undefined,
    n2: VNode,
    container: Element,
    parentComponent?: ComponentInternalInstance,
    anchor?: HTMLElement
  ) {
    if (!n1) {
      mountElement(n2, container, parentComponent, anchor)
    } else {
      patchElement(n1, n2, container, parentComponent, anchor)
    }
  }

  function mountElement(
    vNode: VNode,
    container: Element,
    parentComponent?: ComponentInternalInstance,
    anchor?: HTMLElement
  ) {
    const { type, props, children, shapeFlags } = vNode
    // document.createElement
    // canvans: new Element()
    const el = (vNode.el = hostCreateElement(type as string))
    if (shapeFlags & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children as string
    } else if (shapeFlags & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vNode, el, parentComponent)
    }

    // props
    // canvans: el.x = 10
    for (const key in props) {
      const val = props[key] as string | EventListener
      // const isOn = (key: string) => /^on[A-Z]/.test(key);
      // if (isOn(key)) {
      //   el.addEventListener(key.slice(2).toLowerCase(), value as EventListener);
      // } else {
      //   el.setAttribute(key, value as string);
      // }
      hostPatchProp(el, key, undefined, val)
    }

    // container.appendChild(el);
    // canvans: addChild()
    hostInsert(el, container, anchor)
  }

  function patchElement(
    n1: VNode,
    n2: VNode,
    container: Element,
    parentComponent?: ComponentInternalInstance,
    anchor?: HTMLElement
  ) {
    const oldProps = n1?.props || EMPTY_OBJ
    const newProps = n2?.props || EMPTY_OBJ

    const el = (n2.el = n1?.el)
    // 对比 props
    patchProps(el as HTMLElement, oldProps, newProps)

    // 对比 children
    patchChildren(n1, n2, el, parentComponent, anchor)
  }

  function patchChildren(
    n1: VNode,
    n2: VNode,
    container?: HTMLElement | Text,
    parentComponent?: ComponentInternalInstance,
    anchor?: HTMLElement
  ) {
    const { shapeFlags: prevShapeFlags, children: prevChildren } = n1
    const { shapeFlags: nextShapFlags, children: nextChildren } = n2

    // 新的是 Text
    if (nextShapFlags & ShapeFlags.TEXT_CHILDREN) {
      // 老的是 Array
      if (prevShapeFlags & ShapeFlags.ARRAY_CHILDREN) {
        // 1. 把老的 children 清空
        unmountChildren(prevChildren as VNode[])
      }
      // 老的是 Array 或者Text
      if (prevChildren !== nextChildren) {
        // 2. 设置 text
        container && hostSetElementText(container, nextChildren as string)
      }
    } else {
      // 新的是 Array
      // 老的是 text
      if (prevShapeFlags & ShapeFlags.TEXT_CHILDREN) {
        // 1. 把老的 text 清空
        container && hostSetElementText(container, '')
        // 2. 设置新的 Array
        container &&
          mountChildren(n2, container as HTMLElement, parentComponent, anchor)
      } else {
        // array diff array
        container &&
          patchKeyedChildren(
            prevChildren as VNode[],
            nextChildren as VNode[],
            container as HTMLElement,
            parentComponent,
            anchor
          )
      }
    }
  }

  function patchKeyedChildren(
    prevChildren: VNode[],
    nextChildren: VNode[],
    container: HTMLElement,
    parentComponent?: ComponentInternalInstance,
    parentAnchor?: HTMLElement
  ) {
    let i = 0
    const l2 = nextChildren.length
    let e1 = prevChildren.length - 1 // prev ending index
    let e2 = l2 - 1 // next ending index

    function isSomeVNodeType(n1: VNode, n2: VNode) {
      return n1.type === n2.type && n1.key === n2.key
    }

    // 左侧
    while (i <= e1 && i <= e2) {
      const n1 = prevChildren[i]
      const n2 = nextChildren[i]
      if (isSomeVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, parentAnchor)
      } else {
        break
      }
      i++
    }

    // 右侧
    while (i <= e1 && i <= e2) {
      const n1 = prevChildren[e1]
      const n2 = nextChildren[e2]
      if (isSomeVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, parentAnchor)
      } else {
        break
      }
      e1--
      e2--
    }

    // 3. 新的比老的多，创建
    if (i > e1) {
      if (i <= e2) {
        // 锚点的计算：新的节点有可能需要添加到尾部，也可能添加到头部，所以需要指定添加的问题
        // 要添加的位置是当前的位置(e2 开始)+1
        // 因为对于往左侧添加的话，应该获取到 c2 的第一个元素
        // 所以我们需要从 e2 + 1 取到锚点的位置
        const nextPos = e2 + 1
        const anchor = nextPos < l2 ? nextChildren[nextPos].el : parentAnchor
        while (i <= e2) {
          patch(
            undefined,
            nextChildren[i],
            container,
            parentComponent,
            anchor as HTMLElement
          )
          i++
        }
      }
    } else if (i > e2) {
      while (i <= e1) {
        const ele = prevChildren[i].el
        if (ele) {
          hostRemove(ele)
        }
        i++
      }
    } else {
      // 中间对比
      let s2 = i
      const toBePatched = e2 - s2 + 1
      const keyToNewIndexMap = new Map()
      const newIndexToOldIndexMap = new Array(toBePatched)
      let moved = false
      let maxNewIndexSoFar = 0
      for (let f = 0; f < toBePatched; f++) {
        newIndexToOldIndexMap[f] = 0
      }

      for (let f = s2; f <= e2; f++) {
        const nextChild = nextChildren[f]
        keyToNewIndexMap.set(nextChild.key, f)
      }

      let s1 = i
      let patched = 0
      for (let f = s1; f <= e1; f++) {
        const prevChild = prevChildren[f]
        if (patched >= toBePatched) {
          prevChild.el && hostRemove(prevChild.el)
          continue
        }

        let newIndex: undefined | number
        if (prevChild.key !== null) {
          newIndex = keyToNewIndexMap.get(prevChild.key)
        } else {
          for (let j = s2; j < e2; j++) {
            if (isSomeVNodeType(prevChild, nextChildren[j])) {
              newIndex = j
              break
            }
          }
        }

        if (newIndex === undefined) {
          prevChild.el && hostRemove(prevChild.el)
        } else {
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex
          } else {
            moved = true
          }
          newIndexToOldIndexMap[newIndex - s2] = f + 1
          patch(
            prevChild,
            nextChildren[newIndex],
            container,
            parentComponent,
            undefined
          )
          patched++
        }
      }

      const increasingNewIndexSequence = moved
        ? getSequence(newIndexToOldIndexMap)
        : []
      let k = increasingNewIndexSequence.length - 1
      for (let j = toBePatched - 1; j >= 0; j--) {
        const nextIndex = j + s2
        const nextChild = nextChildren[nextIndex]

        const nextIdx = nextIndex + 1
        const anchor = nextIdx < l2 ? nextChildren[nextIdx].el : undefined

        if (newIndexToOldIndexMap[j] === 0) {
          patch(
            undefined,
            nextChild,
            container,
            parentComponent,
            anchor as HTMLElement
          )
        }

        if (moved) {
          if (k < 0 || j !== increasingNewIndexSequence[k]) {
            console.log('移动位置')
            console.log('anchor :>> ', anchor)
            console.log('nextChild.el :>> ', nextChild.el)
            hostInsert(
              nextChild.el as HTMLElement,
              container,
              anchor as HTMLElement
            )
          } else {
            k--
          }
        }
      }
    }
  }

  function unmountChildren(children: VNode[]) {
    for (let i = 0; i < children.length; i++) {
      const el = children[i].el
      if (el) {
        // remove
        hostRemove(el)
        // insert
      }
    }
  }

  function patchProps(
    el: HTMLElement,
    oldProps: Data<any>,
    newProps: Data<any>
  ) {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        const prevValue = oldProps[key]
        const nextValue = newProps[key]
        if (prevValue !== nextValue) {
          hostPatchProp(el, key, prevValue, nextValue)
        }
      }

      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!Object.prototype.hasOwnProperty.call(newProps, key)) {
            hostPatchProp(el, key, oldProps[key], undefined)
          }
        }
      }
    }
  }

  // 操作component组件
  function processComponent(
    n1: VNode | undefined,
    n2: VNode,
    container: Element,
    parentComponent?: ComponentInternalInstance,
    anchor?: HTMLElement
  ) {
    // init
    mountComponent(n2, container, parentComponent, anchor)
    // update
  }

  // mount component
  function mountComponent(
    initialVNode: VNode,
    container: Element,
    parentComponent?: ComponentInternalInstance,
    anchor?: HTMLElement
  ) {
    const instance = createComponentInstance(initialVNode, parentComponent)
    setupComponent(instance)
    setupRenderEffect(instance, initialVNode, container, anchor)
  }

  // setup render effect
  function setupRenderEffect(
    instance: ComponentInternalInstance,
    initialVNode: VNode,
    container: Element,
    anchor?: HTMLElement
  ) {
    effect(() => {
      const { type, proxy, isMounted } = instance
      const subTree = (type as ComponentOptions).render?.call(proxy)
      if (subTree) {
        if (!isMounted) {
          // init
          instance.subTree = subTree
          patch(undefined, subTree, container, instance, anchor)
          initialVNode.el = subTree.el
          instance.isMounted = true
        } else {
          // update
          const prevSubTree = instance.subTree
          instance.subTree = subTree

          patch(prevSubTree, subTree, container, instance, anchor)
        }
      }
    })
  }

  return {
    createApp: createAppApi(render)
  }
}

function getSequence(arr: number[]): number[] {
  const p = arr.slice()
  const result = [0]
  let i, j, u, v, c
  const len = arr.length
  for (i = 0; i < len; i++) {
    const arrI = arr[i]
    if (arrI !== 0) {
      j = result[result.length - 1]
      if (arr[j] < arrI) {
        p[i] = j
        result.push(i)
        continue
      }
      u = 0
      v = result.length - 1
      while (u < v) {
        c = (u + v) >> 1
        if (arr[result[c]] < arrI) {
          u = c + 1
        } else {
          v = c
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1]
        }
        result[u] = i
      }
    }
  }
  u = result.length
  v = result[u - 1]
  while (u-- > 0) {
    result[u] = v
    v = p[v]
  }
  return result
}
