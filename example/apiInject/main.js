import { App } from './App.js'
import { createApp } from '../../lib/runtime-core.esm.js'

const container = document.querySelector("#app")
createApp(App).mount(container)