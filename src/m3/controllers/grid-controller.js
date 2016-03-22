import THREE from 'three';
import Controller from './../../core/mvc/controller';
import ServiceLocator from './../../core/service-locator';
import MouseEvent from './../../core/mouse-event';

export default class GridController extends Controller {
  constructor(gridModel, gridView) {
    super(gridModel, gridView);
    this._camera = ServiceLocator.get('M3Game').camera;
    this._mouse = ServiceLocator.get('Mouse');
    this._mouse.addEventListener(MouseEvent.DOWN, this.onMouseDown.bind(this));
    this._raycaster = new THREE.Raycaster();
  }
  getLocation() {
    this._raycaster.setFromCamera(this._mouse.position, this._camera);
    let intersects = this._raycaster.intersectObjects(this.view.children, true);
    console.log(intersects.length);
  }
  onMouseDown(event) {
    this.getLocation();
  }
}
