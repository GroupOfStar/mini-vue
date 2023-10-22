import { h } from '../../lib/runtime-core.esm.js'
import { Foo } from './Foo.js'

export const App = {
  name: 'App',
  render() {
    return h('div', {}, [
      h('div', {}, [
        h(Foo, {
          onAdd: (...args) => {
            console.log('clik onAdd >>>', args.join(','))
          },
          onAddFoo: (...args) => {
            console.log('onAddFoo args :>> ', args)
          }
        })
      ])
    ])
  },
  setup() {
    return {}
  }
}
