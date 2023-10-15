import { h } from './../../lib/runtime-core.esm.js'

window.self = null
export const App = {
    render() {
        window.self = this
        return h('div', {
            id: "root",
            class: ['red', 'hard']
        },
            // setup state
            "hi " + this.msg,
            // string children
            // "hi mini-vue"
            // Array children
            // [h('p', { class: 'red' }, 'hi'), h('p', { class: 'blue' }, 'mini-vue')]
        )
    },
    setup() {
        return {
            msg: "mini-vue11"
        }
    }
}
