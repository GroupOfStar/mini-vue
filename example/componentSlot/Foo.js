import { h, renderSlots } from '../../lib/runtime-core.esm.js'

export const Foo = {
  name: 'Foo',
  setup() {
    return {}
  },
  render() {
    const foo = h('p', {}, 'foo')
    console.log('this.$slots :>> ', this.$slots)

    // 具名插槽
    return h('div', {}, [
      renderSlots(this.$slots, 'header', { age: 18 }),
      foo,
      renderSlots(this.$slots, 'footer')
    ])
  }
}
