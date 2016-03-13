import Model from './../../core/mvc/model';

export default class CellModel extends Model {
  constructor(x, y) {
    super();
    this._x = x;
    this._y = y;
    this.update();
  }

  distance(cell) {
    return (Math.sqrt(Math.pow(cell.x - this._x, 2) + Math.pow(cell.y - this._y, 2)));
  }

  equals(cell) {
    return (this._x === cell.x && this._y === cell.y);
  }

  difference(cell) {
    return (new CellModel(this._x - cell.x, this._y - cell.y));
  }

  copy() {
    return (new CellModel(this._x, this._y));
  }

  toString() {
    return '('+this._x+','+this._y+')';
  }

  get x() {
    return this._x;
  }

  set x(value) {
    this._x = value;
    this.update();
  }

  get y() {
    return this._y;
  }

  set y(value) {
    this._y = value;
    this.update();
  }
}
