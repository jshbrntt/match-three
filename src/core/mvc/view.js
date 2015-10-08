export class View {
  constructor(model) {
    this._model = model;
    this._model.onUpdated = this.onUpdated;
  }
  onUpdated() {
    // Abstract
  }
}
