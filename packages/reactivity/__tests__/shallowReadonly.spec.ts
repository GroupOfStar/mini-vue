import {
  isPorxy,
  isReadonly,
  isShallowReadonly,
  shallowReadonly
} from '../src/reactive'

describe('shallowReadonly', () => {
  const original = { foo: 1 }
  const wrapped = shallowReadonly(original)

  it('nested objects should not be readonly', () => {
    expect(isReadonly(wrapped)).toBe(true)
    expect(isReadonly(wrapped.foo)).toBe(false)
  })

  it('should call console.warn when set', () => {
    console.warn = vi.fn()
    const user = shallowReadonly({
      age: 10
    })
    user.age = 11
    expect(console.warn).toBeCalled()
  })

  it('isShallowReadonly', () => {
    expect(isShallowReadonly(wrapped)).toBe(true)
    expect(isShallowReadonly(wrapped.foo)).toBe(false)
  })

  it('isPorxy', () => {
    expect(isPorxy(wrapped)).toBe(true)
  })
})
