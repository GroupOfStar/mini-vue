import { App } from './App.js'
import { createRenderer } from './../../lib/runtime-core.esm.js'

const canvans = new PIXI.Application({
  with: 500,
  height: 500
  // resizeTo: window
})

document.body.append(canvans.view)

const renderer = createRenderer({
  createElement(type) {
    if (type === 'rect') {
      const rect = new PIXI.Graphics()
      rect.beginFill(0xff0000)
      rect.drawRect(0, 0, 100, 100)
      rect.endFill()
      return rect
    }
  },
  patchProp(el, key, val) {
    el[key] = val
  },
  insert(el, parent) {
    parent.addChild(el)
  }
})

renderer.createApp(App).mount(canvans.stage)

console.log('PIXI :>> ', PIXI)

// const container = document.querySelector("#app")
// createApp(App).mount(container)
