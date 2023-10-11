import { isPorxy, isReadonly, readonly } from "../src/reactive";

describe("readonly", () => {
  const original = { foo: 1, bar: { baz: 2 } };
  const wrapped = readonly(original);

  it("happy path", () => {
    expect(wrapped).not.toBe(original);
    expect(wrapped.foo).toBe(1);
  });

  it("warn then call set", () => {
    console.warn = vi.fn();
    const user = readonly({
      age: 10
    });
    user.age = 11;
    expect(console.warn).toBeCalled();
  });

  it("isReadonly", () => {
    expect(isReadonly(wrapped)).toBe(true);
    expect(isReadonly(original)).toBe(false);
  });

  it("nested readonly", () => {
    expect(isReadonly(wrapped.bar)).toBe(true);
  });

  it("isPorxy", () => {
    expect(isPorxy(wrapped)).toBe(true);
  });
});
