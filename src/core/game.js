var THREE = require('three');

export class Game {
  constructor(renderer) {

    this._renderer = renderer;

    this._camera = new THREE.OrthographicCamera(0, this._width, this._height, 0, 1, 10);
    this._camera.position.z = 10;

    this._animate();

  }
  set scene(value) {
    this._scene = value;
  }
  get scene() {
    return this._scene;
  }
  resize(width, height) {
    this._camera.left   = 0;
    this._camera.right  = width;
    this._camera.top    = height;
    this._camera.bottom = 0;
    this._camera.updateProjectionMatrix();
  }
  _animate() {
    this._update();
    window.requestAnimationFrame(this._animate.bind(this));
  }
  _update() {
    if (this._scene) {
      this._scene.update();
      this._render();
    }
  }
  _render() {
    this._renderer.clear();
    this._renderer.clearDepth();
    this._renderer.render(this._scene, this._camera);
  }
}
