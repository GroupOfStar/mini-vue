import { isRef, unref } from "../src/ref";
import { effect, reactive, ref } from "./../src";

describe("ref", () => {
  it("should return a ref", () => {
    const observed = ref(1);
    expect(observed.value).toBe(1);
    observed.value = 2;
    expect(observed.value).toBe(2);
  });

  it("ref inner value should be reactive", () => {
    const a = ref(1);
    let dummy;
    let calls = 0;
    effect(() => {
      calls++;
      dummy = a.value;
    });
    expect(calls).toBe(1);
    expect(dummy).toBe(1);
    a.value = 2;
    expect(calls).toBe(2);
    expect(dummy).toBe(2);
    // same value should not trigger
    a.value = 2;
    expect(calls).toBe(2);
    expect(dummy).toBe(2);
  });

  it("ref nested value should be reactive", () => {
    const a = ref({
      count: 1
    });
    let dummy;
    effect(() => {
      dummy = a.value.count;
    });
    expect(dummy).toBe(1);
    a.value.count = 2;
    expect(dummy).toBe(2);

    // same value should not trigger
    a.value.count = 2;
    expect(dummy).toBe(2);
  });

  it("isRef", () => {
    const a = ref(1);
    const b = 1;
    const user = reactive({
      age: 18
    });
    expect(isRef(a)).toBe(true);
    expect(isRef(user)).toBe(false);
    expect(isRef(b)).toBe(false);
  });

  it("unref", () => {
    const a = ref(1);
    expect(unref(a)).toBe(1);
  });
});
