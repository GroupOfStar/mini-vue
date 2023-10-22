import { computed } from '../src/computed'
import { reactive } from '../src/reactive'

describe.only('computed', () => {
  it('computed should work', () => {
    const user = {
      age: 10
    }
    const age = computed(() => {
      return user.age
    })
    expect(age.value).toBe(10)
  })

  it('should compute lazily', () => {
    const value = reactive({ foo: 1 })
    const getter = vi.fn(() => {
      return value.foo
    })
    const cValue = computed(getter)

    // lazy
    expect(getter).not.toHaveBeenCalled()

    expect(cValue.value).toBe(1)
    expect(getter).toHaveBeenCalledTimes(1)

    // should not compute again
    cValue.value
    expect(getter).toHaveBeenCalledTimes(1)

    // should not compute until needed
    value.foo = 2
    expect(getter).toHaveBeenCalledTimes(1)

    // now it should compute
    expect(cValue.value).toBe(2)
    expect(getter).toHaveBeenCalledTimes(2)
    console.log('cValue.value :', cValue.value)
    // should not compute again
    cValue.value
    expect(getter).toHaveBeenCalledTimes(2)
  })

  //   it("computed should work with setter", () => {
  //     const user = {
  //       age: 10
  //     };
  //     const age = computed({
  //       get: () => {
  //         return user.age;
  //       },
  //       set: value => {
  //         user.age = value;
  //       }
  //     });
  //     expect(age.value).toBe(10);
  //     age.value = 20;
  //     expect(age.value).toBe(20);
  //   })
})
