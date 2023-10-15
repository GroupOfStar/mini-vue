import { VNode, createVNode } from "./vNode";
import { render } from "./renderer";
import { Data } from "./component";

export interface ComponentOptions {
  render: () => VNode;
  setup?: (props?: Data) => Data;
}

export function createApp(rootComponent: ComponentOptions) {
  return {
    mount(rootContainer: Element) {
      const vNode = createVNode(rootComponent, undefined, undefined);

      render(vNode, rootContainer);
    }
  };
}
