import { ComponentInternalInstance } from "./component";

const publicPropertiesMap = {
  $el: (i: ComponentInternalInstance) => i.vNode.el
};

interface ComponentRenderContext {
  _: ComponentInternalInstance;
  [key: string]: any;
}

export const PublicInstanceProxyHandlers: ProxyHandler<any> = {
  get({ _: instance }: ComponentRenderContext, key: string) {
    const { setupState } = instance;
    if (key in setupState) {
      return setupState[key];
    }
    console.log("instance :>> ", instance);
    debugger;
    const publicGetter = publicPropertiesMap[key];
    if (publicGetter) {
      return publicGetter(instance);
    }
  }
};
