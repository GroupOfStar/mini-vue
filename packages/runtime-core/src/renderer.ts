import { isObject } from "@mini-vue/shared";
import { VNode } from "./vNode";
import { ComponentOptions } from "./createApp";

export const render = (vNode: VNode, container: Element) => {
  patch(vNode, container);
};

/** 补丁 */
function patch(vNode: VNode, container: Element) {
  const { type } = vNode;
  if (typeof type === "string") {
    processElement(vNode, container);
  } else if (isObject(type)) {
    processComponent(vNode, container);
  }
}

function processElement(vNode: VNode, container: Element) {
  const { type, props, children } = vNode;
  const el = document.createElement(type as string);
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

function processComponent(vNode: VNode, container: Element) {
  // init
  mountComponent(vNode, container);
  // update
}

function mountComponent(vNode: VNode, container: Element) {
  setupComponent(vNode);
  setupRenderEffect(vNode, container);
}

function setupComponent(vNode: VNode) {
  const { setup } = vNode.type as ComponentOptions;
  if (setup) {
    const setupResult = setup();
    // if (typeof setupResult !== "function") {
    //   setupResult();
    // }
  }
}
function setupRenderEffect(vNode: VNode, container: Element) {
  const subTree = (vNode.type as ComponentOptions).render();
  patch(subTree, container);
}
