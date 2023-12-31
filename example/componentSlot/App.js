import { createTextVNode, h } from '../../lib/runtime-core.esm.js'
import { Foo } from './Foo.js'

export const App = {
  name: 'App',
  render() {
    const app = h('div', {}, 'App')
    // const foo = h(Foo, {}, h('p', {}, 'foo children'))
    const foo = h(
      Foo,
      {},
      {
        header: ({ age }) => [
          h('p', {}, `header ${age}`),
          createTextVNode('你好呀！')
        ],
        footer: h('p', {}, 'footer')
      }
    )

    console.log('foo :>> ', foo)

    return h('div', {}, [app, foo])
  },
  setup() {
    return {}
  }
}
