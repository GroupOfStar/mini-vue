import { ShapeFlags } from "@mini-vue/shared";
import { ComponentOptions } from "./createApp";
import { Data } from "./component";

export type VNodeTypes = ComponentOptions | string;

export type RawSlots = {
  [name: string]: VNode | ((props?: Data) => VNode);
};

export type VNodeChild =
  | undefined
  | string
  | VNode
  | VNode[]
  | RawSlots
  | ((props: Data) => VNode);

export interface VNode {
  type: VNodeTypes;
  props: Data;
  children: VNodeChild;
  shapeFlags: ShapeFlags;
  el?: HTMLElement;
  key?: string;
}

export type CreateVNode = (
  type: VNodeTypes,
  props: Data,
  children: VNodeChild
) => VNode;

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

  if (vNode.shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
    if (typeof children === "object") {
      vNode.shapeFlags = vNode.shapeFlags | ShapeFlags.SLOT_CHILDREN;
    }
  }
  return vNode;
};
