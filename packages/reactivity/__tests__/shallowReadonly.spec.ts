import {
    isProxy,
  isReadonly,
  isShallowReadonly,
  shallowReadonly
} from "../src/reactive";

describe("shallowReadonly", () => {
  it("nested objects should not be readonly", () => {
    const original = { foo: 1 };
    const wrapped = shallowReadonly(original);
    expect(isReadonly(wrapped)).toBe(true);
    expect(isReadonly(wrapped.foo)).toBe(false);
  });

  it("isShallowReadonly", () => {
    const original = { foo: 1, bar: { baz: 2 } };
    const wrapped = shallowReadonly(original);
    expect(isShallowReadonly(original)).toBe(false);
    expect(isShallowReadonly(wrapped)).toBe(true);
  });

  it("should call console.warn when set", () => {
    console.warn = vi.fn();
    const original = { foo: 1, bar: { baz: 2 } };
    const wrapped = shallowReadonly(original);
    wrapped.foo = 11;
    expect(console.warn).toBeCalled();
  });

  it("isPorxy", () => {
    const original = { foo: 1, bar: { baz: 2 } };
    const wrapped = shallowReadonly(original);
    expect(isProxy(wrapped)).toBe(true);
  });
});
