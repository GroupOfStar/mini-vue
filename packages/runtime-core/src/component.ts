import { shallowReadonly } from "@mini-vue/reactivity";
import { initProps } from "./componentProps";
import { PublicInstanceProxyHandlers } from "./componentPublicInstance";
import { ComponentOptions } from "./createApp";
import { VNode, VNodeTypes } from "./vNode";

export type Data = Record<string, unknown>;

export interface ComponentInternalInstance {
  vNode: VNode;
  type: VNodeTypes;
  props: Data;
  setupState: Data;
  proxy: any;
}

export function createComponentInstance(vNode: VNode) {
  const component: ComponentInternalInstance = {
    vNode,
    type: vNode.type,
    props: {},
    setupState: {},
    proxy: null
  };
  return component;
}

export function setupComponent(instance: ComponentInternalInstance) {
  // TODO
  initProps(instance, instance.vNode.props);
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
    console.log("instance.props :>> ", instance.props);
    const setupResult = setup(shallowReadonly(instance.props));
    if (typeof setupResult !== "function") {
      instance.setupState = setupResult || {};
    }
  }
}
