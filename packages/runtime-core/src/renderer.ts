import { isObject } from "@mini-vue/shared";
import { VNode } from "./vNode";
import { ComponentOptions } from "./createApp";
import {
  ComponentInternalInstance,
  createComponentInstance,
  setupComponent
} from "./component";

export const render = (vNode: VNode, container: Element) => {
  patch(vNode, container);
};

/** 补丁 */
function patch(vNode: VNode, container: Element) {
  const { type } = vNode;
  console.log("type :>> ", type);
  if (typeof type === "string") {
    processElement(vNode, container);
  } else if (isObject(type)) {
    processComponent(vNode, container);
  }
}

// 操作element节点
function processElement(vNode: VNode, container: Element) {
  const { type, props, children } = vNode;
  const el = (vNode.el = document.createElement(type as string));
  if (typeof children === "string") {
    el.textContent = children;
  } else if (Array.isArray(children)) {
    for (const child of children) {
      patch(child, el);
    }
  }
  for (const [key, value] of Object.entries(props)) {
    el.setAttribute(key, value);
  }
  container.appendChild(el);
}

// 操作component组件
function processComponent(vNode: VNode, container: Element) {
  // init
  mountComponent(vNode, container);
  // update
}

// mount component
function mountComponent(initialVNode: VNode, container: Element) {
  const instance = createComponentInstance(initialVNode);
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
  console.log("subTree :>> ", subTree);
  patch(subTree, container);
  initialVNode.el = subTree.el;
}
