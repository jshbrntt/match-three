import THREE from 'three';
import TWEEN from 'tween';
import View from './../../core/mvc/view';

export default class TileView extends View {
  constructor(model) {
    super(model);
    if (!TileView.MATERIALS.length) {
      throw new Error('Missing materials please create them with `TileView.createMaterials(textures)`.');
    }
    if (model.value > TileView.MATERIALS.length - 1) {
      throw new Error(`No material exists for tile value \`${model.value}\`.`);
    }
    this._plane            = new THREE.Mesh(TileView.GEOMETRY, TileView.MATERIALS[this._model.value]);
    this._plane.position.x = TileView.GEOMETRY.parameters.width / 2;
    this._plane.position.y = TileView.GEOMETRY.parameters.height / 2;

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
  static loadTextures() {
    let loader = new THREE.TextureLoader();
    let textures = [];
    let colors = ['blue', 'green', 'purple', 'red', 'yellow'];
    return new Promise((resolve, reject) => {
      function onLoad(texture) {
        textures.push(texture);
        if (textures.length === colors.length) {
          resolve(textures);
        }
      }
      for (let color of colors) {
        let filename = 'assets/textures/tile_' + color + '.png';
        console.log(filename);
        loader.load(filename, onLoad, null, reject);
      }
    });
  }
  static createMaterials(textures) {
    for (let texture of textures) {
      TileView.MATERIALS.push(new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        depthWrite: false,
        depthTest: false
      }));
    }
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
    // let time    = new Date(Date.now()).getMilliseconds() / 1000;
    // let circle  = Math.PI * 2 * time;
    // let offsetX = this.model.cell.x / this.model.gridModel.width * Math.PI * 1;
    // let offsetY = this.model.cell.y / this.model.gridModel.height * Math.PI * 1;
    // this._plane.rotation.y = circle + offsetX + offsetY;
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
    this._material.wireframe = value;
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
TileView.GEOMETRY = new THREE.PlaneGeometry(48, 46);
TileView.MATERIALS = [];
