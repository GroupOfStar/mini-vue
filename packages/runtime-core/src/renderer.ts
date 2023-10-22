import { ShapeFlags } from "@mini-vue/shared";
import { Fragment, Text, VNode } from "./vNode";
import {
  ComponentOptions,
  RootRenderFunction,
  createAppApi
} from "./createApp";
import {
  ComponentInternalInstance,
  createComponentInstance,
  setupComponent
} from "./component";
import { effect } from "@mini-vue/reactivity";

export interface RendererOptions {
  createElement(type: string): HTMLElement;
  patchProp(el: HTMLElement, key: string, value: string | EventListener): void;
  insert(el: HTMLElement, parent: Element): void;
}

export function createRenderer(options: RendererOptions) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert
  } = options;

  const render: RootRenderFunction = function (vNode, container) {
    patch(undefined, vNode, container, undefined);
  };

  /** 补丁 */
  function patch(
    n1: VNode | undefined,
    n2: VNode,
    container: Element,
    parentComponent?: ComponentInternalInstance
  ) {
    const { type, shapeFlags } = n2;
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent);
        break;
      case Text:
        processText(n1, n2, container);
        break;

      default:
        if (shapeFlags & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent);
        } else if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, parentComponent);
        }
        break;
    }
  }

  function processFragment(
    n1: VNode | undefined,
    n2: VNode,
    container: Element,
    parentComponent?: ComponentInternalInstance
  ) {
    mountChildren(n2, container, parentComponent);
  }

  function processText(n1: VNode | undefined, n2: VNode, container: Element) {
    const { children } = n2;
    const el = (n2.el = document.createTextNode(children as string));
    container.appendChild(el);
  }

  function mountChildren(
    vNode: VNode,
    container: Element,
    parentComponent?: ComponentInternalInstance
  ) {
    for (const child of vNode.children as VNode[]) {
      patch(undefined, child, container, parentComponent);
    }
  }

  // 操作element节点
  function processElement(
    n1: VNode | undefined,
    n2: VNode,
    container: Element,
    parentComponent?: ComponentInternalInstance
  ) {
    if (!n1) {
      mountElement(n2, container, parentComponent);
    } else {
      patchElement(n1, n2, container);
    }
  }

  function mountElement(
    n2: VNode,
    container: Element,
    parentComponent?: ComponentInternalInstance
  ) {
    const { type, props, children, shapeFlags } = n2;
    // document.createElement
    // canvans: new Element()
    const el = (n2.el = hostCreateElement(type as string));

    if (shapeFlags & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children as string;
    } else if (shapeFlags & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(n2, container, parentComponent);
    }

    // props
    // canvans: el.x = 10
    for (const key in props) {
      const val = props[key] as string | EventListener;
      // const isOn = (key: string) => /^on[A-Z]/.test(key);
      // if (isOn(key)) {
      //   el.addEventListener(key.slice(2).toLowerCase(), value as EventListener);
      // } else {
      //   el.setAttribute(key, value as string);
      // }
      hostPatchProp(el, key, val);
    }

    // container.appendChild(el);
    // canvans: addChild()
    hostInsert(el, container);
  }

  function patchElement(n1: VNode | undefined, n2: VNode, container: Element) {
    console.log("n1 :>> ", n1);
    console.log("n2 :>> ", n2);
  }

  // 操作component组件
  function processComponent(
    n1: VNode | undefined,
    n2: VNode,
    container: Element,
    parentComponent?: ComponentInternalInstance
  ) {
    // init
    mountComponent(n2, container, parentComponent);
    // update
  }

  // mount component
  function mountComponent(
    initialVNode: VNode,
    container: Element,
    parentComponent?: ComponentInternalInstance
  ) {
    const instance = createComponentInstance(initialVNode, parentComponent);
    setupComponent(instance);
    setupRenderEffect(instance, initialVNode, container);
  }

  // setup render effect
  function setupRenderEffect(
    instance: ComponentInternalInstance,
    initialVNode: VNode,
    container: Element
  ) {
    effect(() => {
      const { type, proxy, isMounted } = instance;
      const subTree = (type as ComponentOptions).render.call(proxy);
      if (!isMounted) {
        // init
        instance.subTree = subTree;
        patch(undefined, subTree, container, instance);
        initialVNode.el = subTree.el;
        instance.isMounted = true;
      } else {
        // update
        const prevSubTree = instance.subTree;
        instance.subTree = subTree;

        patch(prevSubTree, subTree, container, instance);
      }
    });
  }

  return {
    createApp: createAppApi(render)
  };
}
