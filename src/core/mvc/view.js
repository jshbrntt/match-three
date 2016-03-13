import THREE from 'three';

export default class View extends THREE.Object3D {
  constructor(model) {
    this._model = model;
    this._model.onUpdated = this.onUpdated;
  }
  onUpdated() {
    // Abstract
  }
}
