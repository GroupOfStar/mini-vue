import { getCurrentInstance, h } from '../../lib/runtime-core.esm.js'
import { Foo } from './Foo.js'

export const App = {
    name: "App",
    render() {
        return h('div', {}, [h("div", {}, "currentInstance demo"), h(Foo)])
    },
    setup() {
        const instance = getCurrentInstance()
        console.log('App currentInstance :>> ', instance);
        return {}
    }
}
