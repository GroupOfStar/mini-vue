import { App } from './App.js'
import { createApp } from './../../lib/runtime-core.esm.js'

const container = document.querySelector("#app")
console.log('container :>> ', container);
createApp(App).mount(container)