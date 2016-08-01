import Model from './../../core/mvc/model';

export default class TileModel extends Model {
  constructor(value, cell, gridModel) {
    super();

    this._value         = value;
    this._cell          = cell;
    this._gridModel     = gridModel;

    this._highlight     = false;
    this._onMoved       = null;
    this._onRemoved     = null;
    this._onSwapped     = null;
    this._swapTile      = null;
    this._swapMovements = 0;
  }

  swap(tile, onSwapped) {
    if (onSwapped) {
      this._onSwapped = onSwapped;
    }
    this._swapTile = tile;
    var cell = this._cell;
    this.move(this._swapTile.cell, this.onSwapMovement.bind(this));
    this._swapTile.move(cell, this.onSwapMovement.bind(this));
  }

  onSwapMovement() {
    this._swapMovements++;
    if (this._swapMovements == 2)
    {
      this._swapMovements = 0;
      if (this._onSwapped) {
        this._onSwapped(this, this._swapTile);
      }
    }
  }

  move(cell, onMovedCallback) {
    var time = Math.sqrt((2 * this._cell.distance(cell)) / 64) * 1000;
    this._cell = cell;
    if (this._onMoved) {
      this._onMoved(this._cell, time, onMovedCallback);
    }
  }

  get value() {
    return this._value;
  }

  get cell() {
    return this._cell;
  }

  get onRemoved() {
    return this._onRemoved;
  }

  get onMoved() {
    return this._onMoved;
  }

  get highlight() {
    return this._highlight;
  }

  get gridModel() {
    return this._gridModel;
  }

  set highlight(value) {
    this._highlight = value;
    this.update();
  }
}