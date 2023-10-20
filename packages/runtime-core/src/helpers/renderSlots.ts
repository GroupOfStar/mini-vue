import { isObject } from "@mini-vue/shared";
import { RawSlots, VNode, createVNode } from "../vNode";
import { Data } from "../component";

export const renderSlots = (
  slots: VNode | RawSlots,
  name?: string,
  props?: Data
) => {
  if (isObject(slots) && name) {
    const slot = (slots as RawSlots)[name];
    return createVNode(
      "div",
      {},
      typeof slot === "function" ? slot(props) : slot
    );
  } else {
    return createVNode("div", {}, slots as VNode);
  }
};
