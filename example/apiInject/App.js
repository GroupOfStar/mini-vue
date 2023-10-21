import { h, provider, inject } from '../../lib/runtime-core.esm.js'

const Consumer = {
    name: "Consumer",
    setup() {
        const foo = inject('foo')
        const bar = inject('bar')
        const baz = inject('baz', "bazDefault")
        return { foo, bar, baz }
    },
    render() {
        return h('div', {}, `Consumer: - ${this.foo} - ${this.bar} - ${this.baz}`)
    }
}

const ProviderTwo = {
    name: "Provider",
    setup() {
        provider('foo', "fooTwo")
        const foo = inject("foo")
        return { foo }
    },
    render() {
        return h('div', {}, [h("p", {}, `ProviderTwo foo: ${this.foo}`), h(Consumer)])
    }
}

const Provider = {
    name: "Provider",
    setup() {
        provider('foo', "fooVal")
        provider('bar', "barVal")
    },
    render() {
        return h('div', {}, [h("p", {}, "Provider"), h(ProviderTwo)])
    }
}

export const App = {
    name: "App",
    render() {
        return h('div', {}, [h("p", {}, "apiInject"), h(Provider)])
    },
    setup() {
        return {}
    }
}
