import { VNode, createVNode } from "./vNode";
import { Data } from "./component";

interface SetupContext {
  attrs?: Data;
  // slots: UnwrapSlotsType<S>;
  emit: (eventName: string) => void;
  expose?: (exposed?: Record<string, any>) => void;
}

export type RootRenderFunction = (vNode: VNode, container: Element) => void;

export interface ComponentOptions {
  render: () => VNode;
  setup?: (props?: Data, cxt?: SetupContext) => Data;
}

export function createAppApi(render: RootRenderFunction) {
  return function createApp(rootComponent: ComponentOptions) {
    return {
      mount(rootContainer: Element) {
        const vNode = createVNode(rootComponent, {}, undefined);

        render(vNode, rootContainer);
      }
    };
  };
}
