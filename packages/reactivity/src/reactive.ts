import { mutableHandlers, readonlyHandlers } from "./mutableHandlers";

export const reactive = (raw: any) => {
  return new Proxy(raw, mutableHandlers);
};

export const readonly = (raw: any) => {
  return new Proxy(raw, readonlyHandlers);
};
