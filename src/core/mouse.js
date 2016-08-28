import THREE from 'three';
import MouseEvent from './mouse-event';

export default class Mouse extends THREE.EventDispatcher {
  constructor(x, y) {
    super();
    this._position = new THREE.Vector2(x, y);
    this._held     = false;
    window.addEventListener('click'    , this.onClick.bind(this)    , false);
    window.addEventListener('mousedown', this.onMouseDown.bind(this), false);
    window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
    window.addEventListener('mouseup'  , this.onMouseUp.bind(this)  , false);
  }
  update(event) {
    this._position.x = (event.clientX / window.innerWidth) * 2 - 1;
    this._position.y = - (event.clientY / window.innerHeight) * 2 + 1;
  }
  onClick(event) {
    this.update(event);
    this.dispatchEvent({ type: MouseEvent.CLICK });
  }
  onMouseDown(event) {
    this.update(event);
    this.dispatchEvent({ type: MouseEvent.DOWN });
    this._held = true;
  }
  onMouseMove(event) {
    this.update(event);
    this.dispatchEvent({ type: MouseEvent.MOVE });
  }
  onMouseUp(event) {
    this.update(event);
    this.dispatchEvent({ type: MouseEvent.UP });
    this._held = false;
  }
  get x() {
    return this._position.x;
  }
  get y() {
    return this._position.y;
  }
  get position() {
    return this._position;
  }
  get held() {
    return this._held;
  }
}
