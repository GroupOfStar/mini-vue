import { h, ref } from '../../lib/runtime-core.esm.js'

export const App = {
  name: 'App',
  setup() {
    const count = ref(0)

    const onClick = function (event) {
      count.value++
    }

    const props = ref({
      foo: 'foo',
      bar: 'bar'
    })
    // 值改变了
    const onChangePropsDemo1 = function (event) {
      props.value.foo = 'new-foo'
    }
    // 值变成了undefined
    const onChangePropsDemo2 = function (event) {
      props.value.foo = undefined
    }
    // key在新的里面没有了
    const onChangePropsDemo3 = function (event) {
      props.value = { foo: 'foo' }
    }
    return {
      props,
      count,
      onClick,
      onChangePropsDemo1,
      onChangePropsDemo2,
      onChangePropsDemo3
    }
  },
  render() {
    return h('div', { id: 'root', ...this.props }, [
      h('div', {}, `count: ${this.count}`),
      h('button', { onClick: this.onClick }, '点击'),
      h('div', {}, [
        h(
          'button',
          { onClick: this.onChangePropsDemo1 },
          'changeProps - 值改变了 - 修改'
        ),
        h(
          'button',
          { onClick: this.onChangePropsDemo2 },
          'changeProps - 值变成了undefined - 删除'
        ),
        h(
          'button',
          { onClick: this.onChangePropsDemo3 },
          'changeProps - key在新的里面没有了 - 删除'
        )
      ])
    ])
  }
}
