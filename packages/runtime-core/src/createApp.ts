import { VNode, createVNode } from "./vNode";
import { render } from "./renderer";
import { Data } from "./component";

interface SetupContext {
  attrs?: Data;
  // slots: UnwrapSlotsType<S>;
  emit: (eventName: string) => void;
  expose?: (exposed?: Record<string, any>) => void;
}

export interface ComponentOptions {
  render: () => VNode;
  setup?: (props?: Data, cxt?: SetupContext) => Data;
}

export function createApp(rootComponent: ComponentOptions) {
  return {
    mount(rootContainer: Element) {
      const vNode = createVNode(rootComponent, undefined, undefined);

      render(vNode, rootContainer);
    }
  };
}
