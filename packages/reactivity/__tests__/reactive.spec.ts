import { isPorxy, isReactive } from '../src/reactive'
import { reactive } from './../src'

describe('reactive', () => {
  const original = {
    nested: {
      foo: 1
    },
    array: [{ bar: 2 }]
  }
  const observed = reactive(original)

  it('reactive should work', () => {
    expect(observed).not.toBe(original)
    expect(observed.nested.foo).toBe(1)
    // has
    expect('nested' in observed).toBe(true)
    // ownKeys
    expect(Object.keys(observed)).toEqual(['nested', 'array'])
  })

  it('isReactive', () => {
    expect(isReactive(original)).toBe(false)
    expect(isReactive(observed)).toBe(true)
  })

  it('nested reactive', () => {
    expect(isReactive(observed.nested)).toBe(true)
    expect(isReactive(observed.array)).toBe(true)
    expect(isReactive(observed.array[0])).toBe(true)
  })

  it('isPoxy', () => {
    expect(isPorxy(observed)).toBe(true)
    expect(isPorxy(observed.nested)).toBe(true)
  })
})
