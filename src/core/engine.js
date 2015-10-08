var THREE = require('three');

export class Engine {
  constructor(gameClass) {
    this._gameClass = gameClass;
    this._renderer = new THREE.WebGLRenderer();
    this.isStarted = false;
  }
  _resize() {
    this._width = window.innerWidth;
    this._height = window.innerHeight;
    this._renderer.setSize(this._width, this._height);
    this._game.resize(this._width, this._height);
  }
  start() {
    if (!this._game) {
      document.body.appendChild(this._renderer.domElement);
      this._game = new this._gameClass(this._renderer);
      window.addEventListener('resize', this._resize.bind(this));
      this._resize();
    }
    this.isStarted = true;
  }
  stop() {
    this.isStarted = false;
  }
}
