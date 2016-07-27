import THREE from 'three';
import Stats from 'stats.js';
import ServiceLocator from './service-locator';

export default class Game {
  constructor(engine, width, height, color = 0x0099ff) {

    this._engine            = engine;
    this._width             = width;
    this._height            = height;
    this._camera            = new THREE.PerspectiveCamera(75, this._width / this._height, 1, 1000);
    this._camera.position.z = 500;

    this._stats                           = new Stats();
    this._stats.domElement.style.position = 'absolute';
    this._stats.domElement.style.left     = '0px';
    this._stats.domElement.style.top      = '0px';

    this._engine.renderer.setClearColor(color);
    this._stats.setMode(0);

    document.body.appendChild( this._stats.domElement );

    this._animate();
    ServiceLocator.provide(this);

  }
  start() {

  }
  set scene(value) {
    this._scene = value;
  }
  get scene() {
    return this._scene;
  }
  get camera() {
    return this._camera;
  }
  get engine() {
    return this._engine;
  }
  resize(width, height) {
    this._width  = width;
    this._height = height;
    this._camera.aspect = this._width / this._height;
    this._camera.updateProjectionMatrix();
    if (this._scene) {
      this._scene.resize(width, height);
    }
  }
  _animate() {
    this._stats.begin();
    this._update();
    this._stats.end();
    window.requestAnimationFrame(this._animate.bind(this));
  }
  _update() {
    if (this._scene) {
      this._scene.update();
      this._render();
    }
  }
  _render() {
    this._engine.renderer.clear();
    this._engine.renderer.clearDepth();
    this._engine.renderer.render(this._scene, this._camera);
  }
}
