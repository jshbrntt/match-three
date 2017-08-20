import window from 'window'
import { EventDispatcher, Vector2 } from 'three'
import MouseEvent from './event'

export default class Mouse extends EventDispatcher {
  constructor (x, y) {
    super()
    this._client = new Vector2(0, 0)
    this._position = new Vector2(0, 0)
    this._held = false
    window.addEventListener('click', this.onClick.bind(this), false)
    window.addEventListener('mousedown', this.onMouseDown.bind(this), false)
    window.addEventListener('mousemove', this.onMouseMove.bind(this), false)
    window.addEventListener('mouseup', this.onMouseUp.bind(this), false)
    window.addEventListener('mousewheel', this.onMouseWheel.bind(this), { passive: true })
  }
  update (event) {
    this._client.x = event.clientX
    this._client.y = event.clientY
    this._position.x = (this._client.x / window.innerWidth) * 2 - 1
    this._position.y = -(this._client.y / window.innerHeight) * 2 + 1
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
  get held () {
    return this._held
  }
}
