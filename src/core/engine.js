import { WebGLRenderer } from 'three'
import ServiceLocator from './service-locator'

export default class Engine {
  constructor (gameClass) {
    this._gameClass = gameClass
    this._renderer = new WebGLRenderer()
    this.isStarted = false
    this._width = window.innerWidth
    this._height = window.innerHeight
    ServiceLocator.provide('Engine', this)
  }
  get renderer () {
    return this._renderer
  }
  resize () {
    this._width = window.innerWidth
    this._height = window.innerHeight
    this._renderer.setSize(this._width, this._height)
    this._game.resize(this._width, this._height)
  }
  start () {
    if (!this._game) {
      document.body.appendChild(this._renderer.domElement)
      this._game = new this._gameClass(this, this._width, this._height)
      window.addEventListener('resize', this.resize.bind(this))
      this.resize()
      this._game.start()
    }
    this.isStarted = true
  }
  stop () {
    this.isStarted = false
  }
}
