import {
  Camera,
  OrthographicCamera,
  PerspectiveCamera,
  Vector2
} from 'three'
import Stats from 'stats.js'
import ServiceLocator from './services/service-locator'

export default class Game {
  constructor (engine, width, height, camera = Game.CAMERA_TYPE, clearColor = Game.CLEAR_COLOR) {
    this._engine = engine
    this._width = width
    this._height = height

    if (camera.prototype instanceof Camera) {
      if (camera === PerspectiveCamera) {
        this._camera = new PerspectiveCamera(Game.CAMERA_FOV, this._width / this._height, Game.CAMERA_NEAR, Game.CAMERA_FAR)
      } else if (camera === OrthographicCamera) {
        this._camera = new OrthographicCamera(
          this._width / -2,
          this._width / 2,
          this._height / 2,
          this._height / -2,
          Game.CAMERA_NEAR,
          Game.CAMERA_FAR
        )
      } else {
        throw new Error('Camera type is unsupported.')
      }
    } else {
      throw new Error('Parameter camera must be an instance of THREE.Camera.')
    }
    this._camera.position.z = Math.round((Game.CAMERA_FAR - Game.CAMERA_NEAR) / 2)

    this._stats = new Stats()
    this._stats.domElement.style.position = 'absolute'
    this._stats.domElement.style.left = '0px'
    this._stats.domElement.style.top = '0px'

    this._engine.renderer.setClearColor(clearColor)
    this._stats.setMode(0)

    document.body.appendChild(this._stats.domElement)

    this._animate()
    ServiceLocator.provide('Game', this)
  }
  start () {}
  set scene (value) {
    if (this._scene) {
      this._scene.destroy()
    }
    this._scene = value
  }
  get scene () {
    return this._scene
  }
  get camera () {
    return this._camera
  }
  get engine () {
    return this._engine
  }
  resize (width, height) {
    this._width = width
    this._height = height
    this._camera.aspect = this._width / this._height
    this._camera.updateProjectionMatrix()
    if (this._scene) {
      this._scene.resize(width, height)
    }
  }
  _animate () {
    this._stats.begin()
    this._update()
    this._stats.end()
    window.requestAnimationFrame(this._animate.bind(this))
  }
  _update () {
    if (this._scene) {
      this._scene.update()
      this._render()
    }
  }
  _render () {
    this._engine.renderer.clear()
    this._engine.renderer.clearDepth()
    this._engine.renderer.render(this._scene, this._camera)
  }
}
