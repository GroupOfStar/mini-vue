import { ShapeFlags } from "@mini-vue/shared";
import { Fragment, Text, VNode } from "./vNode";
import { ComponentOptions } from "./createApp";
import {
  ComponentInternalInstance,
  createComponentInstance,
  setupComponent
} from "./component";

export const render = (vNode: VNode, container: Element) => {
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
  const el = (vNode.el = document.createElement(type as string));
  if (shapeFlags & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children as string;
  } else if (shapeFlags & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(vNode, container, parentComponent);
  }
  for (const [key, value] of Object.entries(props)) {
    const isOn = (key: string) => /^on[A-Z]/.test(key);
    if (isOn(key)) {
      el.addEventListener(key.slice(2).toLowerCase(), value as EventListener);
    } else {
      el.setAttribute(key, value as string);
    }
  }
  container.appendChild(el);
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
