import { camelize, capitalize } from "@mini-vue/shared";
import { ComponentInternalInstance } from "./component";

const toHandlerKey = (str: string) => {
  return str ? "on" + capitalize(str) : "";
};

export const emit = (
  instance: ComponentInternalInstance,
  eventName: string,
  ...args: any[]
) => {
  const { props } = instance;

  const handler = props[toHandlerKey(camelize(eventName))];
  if (typeof handler === "function") {
    handler(...args);
  }
};
