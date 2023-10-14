import { createVNode } from "./vNode";
import { render } from "./renderer";

// export interface Component {
//   render: () => Element;
//   setup: () => any;
// }

export function createApp(rootComponent: any) {
  return {
    mount(rootContainer: any) {
      console.log("mount", rootComponent);
      const vNode = createVNode(rootComponent, undefined, undefined);

      render(vNode, rootContainer);
    }
  };
}
