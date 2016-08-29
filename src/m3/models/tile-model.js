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
    this._swapTile      = null;
    this._swapMovements = 0;
  }

  swap(tile) {
    return new Promise((resolve, reject) => {
      this._swapTile = tile;
      var cell = this._cell;
      Promise.all([
        this.move(this._swapTile.cell),
        this._swapTile.move(cell)
      ]).then((moves) => {
        resolve();
      });
    });
  }

  move(cell) {
    let promise = new Promise((resolve, reject) => {
      var time = Math.sqrt((2 * this._cell.distance(cell)) / 64) * 1000;
      if (this._onMoved) {
        this._onMoved(cell, time, resolve);
      }
    });
    promise.then(() => {
      this.cell = cell;
      this.update();
    });
    return promise;
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

  set cell(value) {
    this._cell = value;
  }

  set highlight(value) {
    this._highlight = value;
    this.update();
  }
}
