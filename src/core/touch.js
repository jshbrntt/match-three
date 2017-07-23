import { EventDispatcher, Vector2 } from 'three'
import TouchEvent from './touch-event'

export default class Touch extends EventDispatcher {
  constructor (x, y) {
    super()
    this._position = new Vector2(x, y)
    this._held = false
    window.addEventListener('touchstart', this.onStart.bind(this), false)
    window.addEventListener('touchend', this.onEnd.bind(this), false)
    window.addEventListener('touchmove', this.onMove.bind(this), false)
    window.addEventListener('touchcancel', this.onCancel.bind(this), false)
  }
  update (event) {
    if (event.targetTouches.length > 0) {
      let touchEvent = event.targetTouches.item(0)
      this._position.x = (touchEvent.clientX / window.innerWidth) * 2 - 1
      this._position.y = - (touchEvent.clientY / window.innerHeight) * 2 + 1
    }
  }
  onStart (event) {
    this.update(event)
    this.dispatchEvent({ type: TouchEvent.START })
    this._held = true
  }
  onEnd (event) {
    this.update(event)
    this.dispatchEvent({ type: TouchEvent.END })
    this._held = false
  }
  onMove (event) {
    this.update(event)
    this.dispatchEvent({ type: TouchEvent.MOVE })
  }
  onCancel (event) {
    this.update(event)
    this.dispatchEvent({ type: TouchEvent.CANCEL })
    this._held = false
  }
  get x () {
    return this._position.x
  }
  get y () {
    return this._position.y
  }
  get position () {
    return this._position
  }
  get held () {
    return this._held
  }
}
