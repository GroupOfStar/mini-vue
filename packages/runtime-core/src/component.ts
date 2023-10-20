import { shallowReadonly } from "@mini-vue/reactivity";
import { initProps } from "./componentProps";
import { PublicInstanceProxyHandlers } from "./componentPublicInstance";
import { ComponentOptions } from "./createApp";
import { RawSlots, VNode, VNodeChild, VNodeTypes } from "./vNode";
import { emit } from "./componentEmit";
import { initSlots } from "./componentSlots";

export type Data = Record<string, unknown>;

export interface ComponentInternalInstance {
  vNode: VNode;
  type: VNodeTypes;
  props: Data;
  setupState: Data;
  proxy: any;
  emit: (event: string) => void;
  slots: { [key: string]: VNode[] | ((props: Data) => VNode[]) };
}

export function createComponentInstance(vNode: VNode) {
  const component: ComponentInternalInstance = {
    vNode,
    type: vNode.type,
    props: {},
    setupState: {},
    proxy: null,
    emit: () => {},
    slots: {}
  };

  component.emit = emit.bind(null, component);

  return component;
}

export function setupComponent(instance: ComponentInternalInstance) {
  // TODO
  initProps(instance, instance.vNode.props);
  initSlots(
    instance,
    instance.vNode.children as Extract<VNodeChild, VNode | VNode[] | RawSlots>
  );

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
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit
    });
    if (typeof setupResult !== "function") {
      instance.setupState = setupResult || {};
    }
  }
}
