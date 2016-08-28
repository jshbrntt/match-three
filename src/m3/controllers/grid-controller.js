import THREE from 'three';
import Modernizr from 'modernizr';
import Controller from './../../core/mvc/controller';
import ServiceLocator from './../../core/service-locator';
import TouchEvent from './../../core/touch-event';
import MouseEvent from './../../core/mouse-event';
import TileView from './../views/tile-view';

export default class GridController extends Controller {
  constructor(gridModel, gridView) {
    super(gridModel, gridView);
    this._camera = ServiceLocator.get('Game').camera;

    if (Modernizr.touchevents) {
      this._input = ServiceLocator.get('Touch');
      this._input.addEventListener(TouchEvent.START, this.onInputDown.bind(this));
      this._input.addEventListener(TouchEvent.MOVE,  this.onInputMove.bind(this));
      this._input.addEventListener(TouchEvent.END,   this.onInputUp.bind(this));
    }
    else {
      this._input = ServiceLocator.get('Mouse');
      this._input.addEventListener(MouseEvent.DOWN, this.onInputDown.bind(this));
      this._input.addEventListener(MouseEvent.MOVE, this.onInputMove.bind(this));
      this._input.addEventListener(MouseEvent.UP,   this.onInputUp.bind(this));
    }

    this._raycaster = new THREE.Raycaster();
    this._selected = [];
  }
  getIntersects() {
    this._raycaster.setFromCamera(this._input.position, this._camera);
    let intersects = this._raycaster.intersectObjects(this.view.children, true);
    return intersects;
  }
  clearSwap() {
    for (let selected of this._selected) {
      selected.highlight = false;
    }
    this._selected = [];
  }
  selectTileView(view) {
    if (view instanceof TileView) {
      // Check its not the same tile.
      if (this._selected.indexOf(view) === -1) {
        // If its the first tile there are no restrictions so add it.
        if (!this._selected.length) {
          view.highlight = true;
          this._selected.push(view);
        }
        // Otherwise check the last tile is next to the new tile.
        else {
          let last = this._selected[0];
          if (last.model.cell.distance(view.model.cell) === 1) {
            view.highlight = true;
            this._selected.push(view);
          }
          else {
            this.clearSwap();
          }
        }
      }
    }
  }
  swapSelectedTiles() {
      this.model.swapCells(this._selected[0].model.cell, this._selected[1].model.cell);
      this.clearSwap();
  }
  onInputDown(event) {
    console.debug('onInputDown', event);
    let intersects = this.getIntersects();
    if (intersects.length) {
      this.selectTileView(intersects[0].object.parent);
    }
  }
  onInputMove(event) {
    console.debug('onInputDown', event);
    if (this._selected.length && this._input.held) {
      let intersects = this.getIntersects();
      if (intersects.length) {
        this.selectTileView(intersects[0].object.parent);
        if (this._selected.length === 2) {
          this.swapSelectedTiles();
        }
      }
    }
    console.debug(this._selected);
  }
  onInputUp(event) {
    console.debug('onInputUp', event);
    if (this._selected.length === 2) {
      this.swapSelectedTiles();
    }
  }
}
