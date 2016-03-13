import TWEEN from 'tween';
import View from './../../core/mvc/view';

export default class TileView extends View {
  constructor(model, textures) {
    super(model);
    if (!textures || !textures.length) {
      throw new Error("Empty or null textures vector.");
    }
    if (model.value > textures.length - 1) {
      throw new Error("No texture exists for this tile's value");
    }

    this._texture  = textures[this._model.value];
    this._geometry = new THREE.PlaneGeometry(this._texture.image.width, this._texture.image.height);
    this._material = new THREE.MeshBasicMaterial({
      map: this._texture,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
      depthTest: false
    });
    this._plane            = new THREE.Mesh(this._geometry, this._material);
    this._plane.position.x = this._geometry.parameters.width / 2;
    this._plane.position.y = this._geometry.parameters.height / 2;

    this._tweenQueue       = [];
    this._callbackQueue    = [];

    this._model._onMoved   = this.onMoved;
    this._model._onRemoved = this.onRemoved;

    this.add(this._plane);

    // this._sprite.scale.set(
    //   this._sprite.material.map.image.width,
    //   this._sprite.material.map.image.height,
    //   1
    // );
    //
    // this._sprite.position.set(
    //   this._model.cell.x * this._sprite.scale.x,
    //   this._model.cell.y * this._sprite.scale.y,
    //   1
    // );

  }
  onMoved(cell, time, onFinished) {
    // TODO: Port this code to use Tween.js
    // var tween = new TWEEN.Tween(this, time, Transitions.EASE_IN);
    // tween.onComplete = this.onTweened;
    // tween.moveTo(cell.x * this._sprite.scale.x, cell.y * this._sprite.scale.y);
    //
    // if (this._tweenQueue.length > 0) {
    //   this._tweenQueue[this._tweenQueue.length - 1].nextTween = tween;
    // }
    // else {
    //   tween.start();
    // }
    //
    // this._tweenQueue.push(tween);
    // this._callbackQueue.push(onFinished);
  }
  update() {
    // this._plane.rotation.x += Math.random() * .05;
    // this._plane.rotation.y += .05;
    // this._plane.rotation.z += .05;
  }
  onRemoved() {
    this._sprite.parent.remove(this._sprite);
  }
  onTweened() {
    this._tweenQueue.splice(0, 1);
    var onFinished = this._callbackQueue[0];
    if (onFinished) {
      onFinished();
    }
    this._callbackQueue.splice(0, 1);
  }
  onUpdated() {
    super.onUpdated();
    // TODO: Highlight here relative to this._model.highlight
  }
  get wireframe() {
    return this._material.wireframe;
  }
  set wireframe(value) {
    return this._material.wireframe = value;
  }
  get moving() {
    return this._tweenQueue.length > 0;
  }
  get model() {
    return this._model;
  }
  get sprite() {
    return this._sprite;
  }
}
