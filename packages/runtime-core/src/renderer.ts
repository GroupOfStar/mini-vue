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
    patch(vNode, container, undefined);
  };

  /** 补丁 */
  function patch(
    vNode: VNode,
    container: Element,
    parentComponent?: ComponentInternalInstance
  ) {
    const { type, shapeFlags } = vNode;
    switch (type) {
      case Fragment:
        processFragment(vNode, container, parentComponent);
        break;
      case Text:
        processText(vNode, container);
        break;

      default:
        if (shapeFlags & ShapeFlags.ELEMENT) {
          processElement(vNode, container, parentComponent);
        } else if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(vNode, container, parentComponent);
        }
        break;
    }
  }

  function processFragment(
    vNode: VNode,
    container: Element,
    parentComponent?: ComponentInternalInstance
  ) {
    mountChildren(vNode, container, parentComponent);
  }

  function processText(vNode: VNode, container: Element) {
    const { children } = vNode;
    const el = (vNode.el = document.createTextNode(children as string));
    container.appendChild(el);
  }

  function mountChildren(
    vNode: VNode,
    container: Element,
    parentComponent?: ComponentInternalInstance
  ) {
    for (const child of vNode.children as VNode[]) {
      patch(child, container, parentComponent);
    }
  }

  // 操作element节点
  function processElement(
    vNode: VNode,
    container: Element,
    parentComponent?: ComponentInternalInstance
  ) {
    const { type, props, children, shapeFlags } = vNode;
    // document.createElement
    // canvans: new Element()
    const el = (vNode.el = hostCreateElement(type as string));

    if (shapeFlags & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children as string;
    } else if (shapeFlags & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vNode, container, parentComponent);
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

  // 操作component组件
  function processComponent(
    vNode: VNode,
    container: Element,
    parentComponent?: ComponentInternalInstance
  ) {
    // init
    mountComponent(vNode, container, parentComponent);
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
    const { type, proxy } = instance;
    const subTree = (type as ComponentOptions).render.call(proxy);
    patch(subTree, container, instance);
    initialVNode.el = subTree.el;
  }

  return {
    createApp: createAppApi(render)
  };
}
