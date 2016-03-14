import THREE from 'three';
import MouseEvent from './mouse-event';

export default class Mouse extends THREE.EventDispatcher {
  constructor(x, y) {
    super();
    this._position = new THREE.Vector2(x, y);
    window.addEventListener('click'    , this.onClick.bind(this)    , false);
    window.addEventListener('mousedown', this.onMouseDown.bind(this), false);
    window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
    window.addEventListener('mouseup'  , this.onMouseUp.bind(this)  , false);
  }
  update(event) {
    this._position.x = (event.clientX / window.innerWidth) * 2 - 1;
    this._position.y = (event.clientY / window.innerHeight) * -2 + 1;
  }
  onClick(event) {
    this.update(event);
    this.dispatchEvent({ type: MouseEvent.CLICK });
  }
  onMouseMove(event) {
    this.update(event);
    this.dispatchEvent({ type: MouseEvent.MOVE });
  }
  onMouseDown(event) {
    this.update(event);
    this.dispatchEvent({ type: MouseEvent.DOWN });
  }
  onMouseUp(event) {
    this.update(event);
    this.dispatchEvent({ type: MouseEvent.UP });
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
}
