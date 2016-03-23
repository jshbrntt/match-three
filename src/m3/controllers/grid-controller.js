import THREE from 'three';
import Controller from './../../core/mvc/controller';
import ServiceLocator from './../../core/service-locator';
import MouseEvent from './../../core/mouse-event';
import TileView from './../views/tile-view';

export default class GridController extends Controller {
  constructor(gridModel, gridView) {
    super(gridModel, gridView);
    this._camera = ServiceLocator.get('M3Game').camera;
    this._mouse = ServiceLocator.get('Mouse');
    this._mouse.addEventListener(MouseEvent.DOWN, this.onMouseDown.bind(this));
    this._raycaster = new THREE.Raycaster();
    this._selected = [];
  }
  getLocation() {
    this._raycaster.setFromCamera(this._mouse.position, this._camera);
    let intersects = this._raycaster.intersectObjects(this.view.children, true);
    if (intersects.length > 0) {
      let view = intersects[0].object.parent;
      if (view instanceof TileView) {
        console.log(view.model.cell);
        this._selected.push(view);
      }
    }
    if (this._selected.length === 2) {
      this.model.swapCells(this._selected[0].model.cell, this._selected[1].model.cell);
      this._selected = [];
      console.log(this.model.toString());
    }
  }
  onMouseDown(event) {
    this.getLocation();
  }
}
