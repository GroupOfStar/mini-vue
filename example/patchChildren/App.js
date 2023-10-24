import { h } from '../../lib/runtime-core.esm.js'
import ArrayToText from './ArrayToText.js'
import TextToText from './TextToText.js'
import TextToArray from './TextToArray.js'
import ArrayToArray from './ArrayToArray.js'

export default {
  name: 'App',
  setup() {},
  render() {
    return h('div', { id: 'root' }, [
      h('p', {}, '主页'),
      // 老的是 array 新的是 text
      // h(ArrayToText)
      // 老的是 text 新的text
      // h(TextToText)
      // 老的是 text 新的也是 array
      // h(TextToArray)
      // 老的是 array 新的也是 array
      h(ArrayToArray)
    ])
  }
}
