import { h, ref } from '../../lib/runtime-core.esm.js'

const prevChildren = [h('div', {}, 'old A'), h('div', {}, 'old B')]
const nextChildren = [h('div', {}, 'new A'), h('div', {}, 'new B')]

export default {
  name: 'ArrayToArray',
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
