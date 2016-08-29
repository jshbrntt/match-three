import THREE from 'three';
import Modernizr from 'modernizr';
import Controller from './../../core/mvc/controller';
import ServiceLocator from './../../core/service-locator';
import TouchEvent from './../../core/touch-event';
import MouseEvent from './../../core/mouse-event';
import TileModel from './../models/tile-model';
import CellModel from './../models/cell-model';

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
  getTileModelAtPosition(position) {
    let vector = new THREE.Vector3(position.x, position.y, 0.5);
    vector.unproject(this._camera);
    let dir = vector.sub(this._camera.position).normalize();
    let distance = this._camera.position.z / dir.z;
    let pos = this._camera.position.clone().add(dir.multiplyScalar(distance));
    let size = this.view.size;
    console.debug(size.x, size.y);
    console.debug(this.model.width, this.model.height);
    console.debug(this.view.position);
    pos.sub(this.view.position)
      .sub(size)
      .divide(new THREE.Vector2(size.x / -this.model.width, size.y / -this.model.height - 1))
      .ceil()
    console.debug(pos);
    // let tileModel = this.model.getTileModel(new CellModel(pos.x - 1, pos.y - 1));
    return tileModel;
  }
  clearSwap() {
    for (let selected of this._selected) {
      selected.highlight = false;
    }
    this._selected = [];
  }
  selectTileModel(model) {
    if (model instanceof TileModel) {
      // Check its not the same tile.
      if (this._selected.indexOf(model) === -1) {
        // If its the first tile there are no restrictions so add it.
        if (!this._selected.length) {
          model.highlight = true;
          this._selected.push(model);
        }
        // Otherwise check the last tile is next to the new tile.
        else {
          let last = this._selected[0];
          if (last.cell.distance(model.cell) === 1) {
            model.highlight = true;
            this._selected.push(model);
          }
          else {
            this.clearSwap();
          }
        }
      }
    }
  }
  swapSelectedTiles() {
      this.model.swapCells(this._selected[0].cell, this._selected[1].cell);
      this.clearSwap();
  }
  onInputDown(event) {
    let tileModel = this.getTileModelAtPosition(this._input.position);
    this.selectTileModel(tileModel);
  }
  onInputMove(event) {
    let tileModel = this.getTileModelAtPosition(this._input.position);
    if (tileModel) {
      console.debug(tileModel.cell);
    }
    if (this._selected.length && this._input.held) {
      this.selectTileModel(tileModel);
      if (this._selected.length === 2) {
        this.swapSelectedTiles();
      }
    }
  }
  onInputUp(event) {
    if (this._selected.length === 2) {
      this.swapSelectedTiles();
    }
  }
}
