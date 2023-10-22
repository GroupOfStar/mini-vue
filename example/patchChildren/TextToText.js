import { h, ref } from '../../lib/runtime-core.esm.js'

const prevChildren = 'oldChildren'
const nextChildren = 'newChildren'

export default {
  name: 'TextToText',
  setup() {
    const isChange = ref(false)
    window.isChange = isChange
    return { isChange }
  },
  render() {
    const self = this
    return self.isChange
      ? h('div', {}, nextChildren)
      : h('div', {}, prevChildren)
  }
}
