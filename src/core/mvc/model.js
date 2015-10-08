export class Model {
  constructor() {
    this._onUpdated = null;
  }
  set onUpdated(value) {
    this._onUpdated = value;
  }
  get onUpdated() {
    return this._onUpdated;
  }
  update() {
    if (this._onUpdated) {
      this._onUpdated();
    }
  }
}
