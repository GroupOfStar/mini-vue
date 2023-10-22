import { createApp } from '../../lib/runtime-core.esm.js'
import App from './App.js'

const container = document.querySelector('#app')
createApp(App).mount(container)
