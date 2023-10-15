import { PublicInstanceProxyHandlers } from "./componentPublicInstance";
import { Component, ComponentOptions } from "./createApp";
import { VNode } from "./vNode";

export type Data = Record<string, unknown>;

export interface ComponentInternalInstance {
  vNode: VNode;
  type: Component;
  proxy: any;
  setupState: Data;
}

export function createComponentInstance(vNode: VNode) {
  const component: ComponentInternalInstance = {
    vNode,
    type: vNode.type,
    proxy: null,
    setupState: {}
  };
  return component;
}

export function setupComponent(instance: ComponentInternalInstance) {
  // TODO
  // initProps
  // initSlots

  // 设置有状态组件
  setupStatefulComponent(instance);
}

/**
 * 设置有状态组件
 * @param vNode VNode
 */
function setupStatefulComponent(instance: ComponentInternalInstance) {
  const component = instance.type as ComponentOptions;

  // ctx
  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);

  const { setup } = component;
  if (setup) {
    const setupResult = setup();
    if (typeof setupResult !== "function") {
      instance.setupState = setupResult;
    }
  }
}
