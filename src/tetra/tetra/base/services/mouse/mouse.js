import window from 'window'
import { EventDispatcher, Vector3 } from 'three'
import ServiceLocator from '../service-locator'
import MouseEvent from './event'

export default class Mouse extends EventDispatcher {
  constructor (x, y) {
    super()
    this._client = new Vector3()
    this._vector = new Vector3()
    this._position = new Vector3()
    this._game = ServiceLocator.get('Game')
    this._held = false
    window.addEventListener('click', this.onClick.bind(this), false)
    window.addEventListener('mousedown', this.onMouseDown.bind(this), false)
    window.addEventListener('mousemove', this.onMouseMove.bind(this), false)
    window.addEventListener('mouseup', this.onMouseUp.bind(this), false)
    window.addEventListener('mousewheel', this.onMouseWheel.bind(this), { passive: true })
  }
  update (event) {
    this._client.set(
      event.clientX,
      event.clientY,
      0
    )
    this._vector.set(
      (this._client.x / window.innerWidth) * 2 - 1,
      -(this._client.y / window.innerHeight) * 2 + 1,
      0.5
    )

    let direction = this._vector.clone()
      .unproject(this._game.camera)
      .sub(this._game.camera.position)
      .normalize()
    let distance = -this._game.camera.position.z / direction.z
    this._position = this._game.camera.position.clone().add(direction.multiplyScalar(distance))
  }
  onClick (event) {
    this.update(event)
    this.dispatchEvent({ type: MouseEvent.CLICK })
  }
  onMouseDown (event) {
    this.update(event)
    this.dispatchEvent({ type: MouseEvent.DOWN })
    this._held = true
  }
  onMouseMove (event) {
    this.update(event)
    this.dispatchEvent({ type: MouseEvent.MOVE })
  }
  onMouseUp (event) {
    this.update(event)
    this.dispatchEvent({ type: MouseEvent.UP })
    this._held = false
  }
  onMouseWheel (event) {
    this.update(event)
    this.dispatchEvent({ type: MouseEvent.WHEEL, delta: { x: event.wheelDeltaX, y: event.wheelDeltaY } })
  }
  get x () {
    return this._position.x
  }
  get y () {
    return this._position.y
  }
  get client () {
    return this._client
  }
  get position () {
    return this._position
  }
  get vector () {
    return this._vector
  }
  get held () {
    return this._held
  }
}
