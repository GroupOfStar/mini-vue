import { ShapeFlags } from "@mini-vue/shared";
import { ComponentOptions } from "./createApp";
import { Data } from "./component";

export type VNodeTypes = ComponentOptions | string;

export interface VNode {
  type: VNodeTypes;
  props: Data;
  children: VNode[] | string;
  shapeFlags: ShapeFlags;
  el?: HTMLElement;
  key?: string;
}

type CreateVNode = (type: VNodeTypes, props: any, children: any) => VNode;

function getShapeFlags(type: VNodeTypes) {
  return typeof type === "string"
    ? ShapeFlags.ELEMENT
    : ShapeFlags.STATEFUL_COMPONENT;
}

export const createVNode: CreateVNode = (type, props = {}, children) => {
  const vNode = {
    type,
    shapeFlags: getShapeFlags(type),
    props,
    children
  };

  // children
  if (typeof children === "string") {
    vNode.shapeFlags = vNode.shapeFlags | ShapeFlags.TEXT_CHILDREN;
  } else if (Array.isArray(children)) {
    vNode.shapeFlags = vNode.shapeFlags | ShapeFlags.ARRAY_CHILDREN;
  }

  return vNode;
};
