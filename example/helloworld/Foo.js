
import { h } from './../../lib/runtime-core.esm.js'

export const Foo = {
    name: "Foo",
    setup(props) {
        // 1. init props
        console.log('props :>> ', props);

        // 3. readonly
        props.count++
        console.log('props.count :>> ', props.count);
    },
    render() {
        // 2. render porps
        return h('div', {}, 'foo , ' + this.count)
    }
}