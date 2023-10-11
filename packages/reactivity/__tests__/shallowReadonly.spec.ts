import { isReadonly, shallowReadonly } from "../src/reactive";

describe("shallowReadonly", () => {
  it("nested objects should not be readonly", () => {
    const original = { foo: 1 };
    const wrapped = shallowReadonly(original);
    expect(isReadonly(wrapped)).toBe(true);
    expect(isReadonly(wrapped.foo)).toBe(false);
  });

  it("should call console.warn when set", () => {
    console.warn = vi.fn();
    const original = { foo: 1, bar: { baz: 2 } };
    const wrapped = shallowReadonly(original);
    wrapped.foo = 11;
    expect(console.warn).toBeCalled();
  });
});
