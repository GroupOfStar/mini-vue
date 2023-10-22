import { h, ref } from '../../lib/runtime-core.esm.js'

export const App = {
    name: "App",
    setup() {
        const count = ref(0)

        const onClick = function (event) {
            count.value++
        }
        return {
            count,
            onClick
        }
    },
    render() {
        return h('div', { id: "root", },
            [
                h('div', {}, `count: ${this.count}`),
                h('button', { onClick: this.onClick }, '点击')
            ]
        )
    },

}
