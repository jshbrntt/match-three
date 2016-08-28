import THREE from 'three';
import TWEEN from 'tween.js';
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

    this._model._onMoved   = this.onMoved.bind(this);
    this._model._onRemoved = this.onRemoved.bind(this);

    this._highlight        = false;

    this._outlineMaterial    = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.FrontSide});
    this._outline            = new THREE.Mesh(TileView.GEOMETRY, this._outlineMaterial);
    this._outline.position.x = TileView.GEOMETRY.parameters.width / 2;
    this._outline.position.y = TileView.GEOMETRY.parameters.height / 2;
    this._outline.visible    = false;

    this.add(this._outline);
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
    return new Promise((resolve, reject) => {
      function onLoad(texture) {
        textures.push(texture);
        if (textures.length === Object.keys(TileView.IMAGES).length) {
          resolve(textures);
        }
      }
      function onProgress(event) {
        console.debug(`${((event.loaded/event.total)*100).toFixed()}% ${event.currentTarget.responseURL}`);
      }
      for (let key in TileView.IMAGES) {
        let url = TileView.IMAGES[key];
        loader.load(url, onLoad, onProgress, reject);
      }
    });
  }
  static createOutline() {
    let outlineMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.BackSide});
    let outlineMesh = new THREE.Mesh(TileView.GEOMETRY, outlineMaterial);
    outlineMesh.scale.multiplyScale(1.05);
    this.add(outlineMesh);
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
    let size = this.size;
    let tween = new TWEEN.Tween(this.position).to({ x: cell.x * this.width, y: cell.y * this.height }, time);
    tween.onComplete(this.onTweened.bind(this));
    tween.easing(TWEEN.Easing.Quadratic.InOut);

    if (this._tweenQueue.length > 0) {
      this._tweenQueue[this._tweenQueue.length - 1].nextTween = tween;
    }
    else {
      tween.start();
    }

    this._tweenQueue.push(tween);
    this._callbackQueue.push(onFinished);
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
    this.parent.remove(this);
  }
  onTweened() {
    this._tweenQueue.splice(0, 1);
    let onFinished = this._callbackQueue[0];
    if (onFinished) {
      onFinished();
    }
    this._callbackQueue.splice(0, 1);
  }
  onUpdated() {
    super.onUpdated();
    // TODO: Highlight here relative to this._model.highlight
  }
  set highlight(value) {
    this._outline.visible = value;
  }
  get highlight() {
    return this._outline.visible;
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
  get width() {
    return this._plane.geometry.parameters.width;
  }
  get height() {
    return this._plane.geometry.parameters.height;
  }
}
TileView.GEOMETRY  = new THREE.PlaneGeometry(48, 48);
TileView.MATERIALS = [];
TileView.IMAGES = {
  tile_blue:   require('assets/textures/tile_blue.png'),
  tile_green:  require('assets/textures/tile_green.png'),
  tile_red:    require('assets/textures/tile_red.png'),
  tile_yellow: require('assets/textures/tile_yellow.png')
};
