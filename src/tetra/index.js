import { TetraEngine } from 'tetra/core'
const wasm = require('../main.rs')

wasm.initialize({noExitRuntime: true}).then(module => {
  const add = module.cwrap('add', 'number', ['number', 'number'])
  const subtract = module.cwrap('subtract', 'number', ['number', 'number'])
  console.log('Calling rust functions from javascript!')
  console.log(add(1, 2))
  console.log(subtract(2, 1))
})

require('./index.scss')

let engine = new TetraEngine()
engine.init()
