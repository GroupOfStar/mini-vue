import { ComponentOptions, Component } from "./createApp";

export interface VNode {
  type: Component;
  props: Object;
  children: VNode[] | string;
  el?: HTMLElement;
  key?: string;
}

type CreateVNode = (
  options: ComponentOptions,
  props: any,
  children: any
) => VNode;

export const createVNode: CreateVNode = (options, props, children) => {
  const vNode = { type: options, props, children };
  return vNode;
};
