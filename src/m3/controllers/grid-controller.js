import THREE from 'three';
import feature from 'feature.js';
import Controller from './../../core/mvc/controller';
import ServiceLocator from './../../core/service-locator';
import TouchEvent from './../../core/touch-event';
import MouseEvent from './../../core/mouse-event';
import TileView from './../views/tile-view';

export default class GridController extends Controller {
  constructor(gridModel, gridView) {
    super(gridModel, gridView);
    this._camera = ServiceLocator.get('M3Game').camera;

    if (feature.touch) {
      this._input = ServiceLocator.get('Touch');
      this._input.addEventListener(TouchEvent.START, this.onMouseDown.bind(this));
      this._input.addEventListener(TouchEvent.END,   this.onMouseUp.bind(this));
    }
    else {
      this._input = ServiceLocator.get('Mouse');
      this._input.addEventListener(MouseEvent.DOWN, this.onMouseDown.bind(this));
      this._input.addEventListener(MouseEvent.UP,   this.onMouseUp.bind(this));
    }

    this._raycaster = new THREE.Raycaster();
    this._selected = [];
  }
  getIntersects() {
    this._raycaster.setFromCamera(this._input.position, this._camera);
    let intersects = this._raycaster.intersectObjects(this.view.children, true);
    return intersects;
  }
  selectTileView(view) {
    if (view instanceof TileView) {
      if (this._selected.length) {
        let last = this._selected[0];
        if (last.model.cell.distance(view.model.cell) !== 1) {
          this._selected[this._selected.length-1].highlight = false;
          this._selected = [];
          return;
        }
      }
      this._selected.push(view);
      view.highlight = true;
    }
  }
  swapSelectedTiles() {
      this.model.swapCells(this._selected[0].model.cell, this._selected[1].model.cell);
      for (let selected of this._selected) {
        selected.highlight = false;
      }
      this._selected = [];
  }
  onMouseDown(event) {
    console.debug('onMouseDown', event);
    let intersects = this.getIntersects();
    if (intersects.length) {
      this.selectTileView(intersects[0].object.parent);
    }
  }
  onMouseUp(event) {
    console.debug('onMouseUp', event);
    if (this._selected.length === 2) {
      this.swapSelectedTiles();
    }
  }
}
