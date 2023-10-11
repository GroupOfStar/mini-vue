import { mutableHandlers, readonlyHandlers } from "./baseHandlers";

function createActiveObject(raw: any, baseHandlers) {
  return new Proxy(raw, baseHandlers);
}

export const reactive = (raw: any) => {
  return createActiveObject(raw, mutableHandlers);
};

export const readonly = (raw: any) => {
  return createActiveObject(raw, readonlyHandlers);
};
