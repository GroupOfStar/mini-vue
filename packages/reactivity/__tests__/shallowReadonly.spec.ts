import { isReadonly, shallowReadonly } from "../src/reactive";

describe("shallowReadonly", () => {
  it("nested objects should not be readonly", () => {
    const original = { foo: 1 };
    const wrapped = shallowReadonly(original);
    expect(isReadonly(wrapped)).toBe(true);
    expect(isReadonly(wrapped.foo)).toBe(false);
  });
});
