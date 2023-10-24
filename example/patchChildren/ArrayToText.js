import { h, ref } from '../../lib/runtime-core.esm.js'

const prevChildren = [h('div', {}, 'A'), h('div', {}, 'B')]
const nextChildren = 'newChildren'

export default {
  name: 'ArrayToText',
  setup() {
    const isChange = ref(false)
    const onClick = () => {
      isChange.value = !isChange.value
    }
    return { isChange, onClick }
  },
  render() {
    return h('div', {}, [
      h('button', { onClick: this.onClick }, '测试子组件之间的 patch 逻辑'),
      h('div', {}, this.isChange === true ? nextChildren : prevChildren)
    ])
  }
}
