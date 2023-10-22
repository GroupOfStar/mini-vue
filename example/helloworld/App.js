import { h } from './../../lib/runtime-core.esm.js'
import { Foo } from './Foo.js'

window.self = null
export const App = {
  name: 'App',
  render() {
    window.self = this
    return h(
      'div',
      {
        id: 'root',
        class: ['red', 'hard'],
        onClick() {
          console.log('onClick')
        },
        onMousedown(e) {
          console.log('onMousedown e :>> ', e)
        }
      },
      // setup state
      // "hi " + this.msg,
      // string children
      // "hi mini-vue"
      // Array children
      [h('p', { class: 'red' }, 'hi'), h(Foo, { count: 1 })]
    )
  },
  setup() {
    return {
      msg: 'mini-vue11'
    }
  }
}
