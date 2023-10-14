import { h } from './../../lib/runtime-core.esm.js'

export const App = {
    render() {
        return h('div', {}, 'app')
    },
    setup() {
        return {
            msg: "mini-vue"
        }
    }
}
