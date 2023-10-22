import { h, ref } from '../../lib/runtime-core.esm.js'

export const App = {
  name: 'App',
  setup() {
    return {}
  },
  render() {
    return h('div', { id: 'root' }, [
      h('div', {}, `count`),
      h('button', {}, '点击'),
      h('div', { class: 'content' }, [
        h('button', {}, 'changeProps - 值改变了 - 修改'),
        h('button', {}, 'changeProps - 值变成了undefined - 删除'),
        h('div', {}, [
          h('div', { id: 'root' }, [
            h('div', {}, `count`),
            h('button', {}, '点击'),
            h('div', { class: 'content' }, [
              h('button', {}, 'changeProps - 值改变了 - 修改'),
              h('button', {}, 'changeProps - 值变成了undefined - 删除'),
              h('button', {}, 'changeProps - key在新的里面没有了 - 删除')
            ])
          ])
        ])
      ])
    ])
  }
}
