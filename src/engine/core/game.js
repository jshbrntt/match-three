var THREE = require('three');

export class Game {
  constructor() {

    this._width = window.innerWidth;
    this._height = window.innerHeight;
    this._pixelRatio = window.devicePixelRatio;

    this._cameraOrtho = new THREE.OrthographicCamera(-this._width / 2, this._width / 2, this._height / 2, -this._height / 2, 1, 10);
    this._cameraOrtho.position.z = 10;

    this._sceneOrtho = new THREE.Scene();

    let map = THREE.ImageUtils.loadTexture('assets/textures/tile_blue.png');
    map.minFilter = THREE.NearestFilter;
    let material = new THREE.SpriteMaterial({
      map: map
    });
    let sprite = new THREE.Sprite(material);
    sprite.scale.set(256 * this._pixelRatio, 256 * this._pixelRatio, 1);
    sprite.position.set(0, 0, 1);

    this._sceneOrtho.add(sprite);

    this._renderer = new THREE.WebGLRenderer();
    this._renderer.setPixelRatio(this._pixelRatio);
    this._renderer.setSize(this._width, this._height);
    this._renderer.autoClear = false;

    document.body.appendChild(this._renderer.domElement);

    window.addEventListener('resize', this._resize.bind(this), false);

    this._animate();

    this._count = 0;

  }
  _resize() {
    this._width = window.innerWidth;
    this._height = window.innerHeight;

    this._cameraOrtho.left = - this._width / 2;
    this._cameraOrtho.right = this._width / 2;
    this._cameraOrtho.top = this._height / 2;
    this._cameraOrtho.bottom = - this._height / 2;
    this._cameraOrtho.updateProjectionMatrix();

    this._renderer.setSize(this._width, this._height);
  }
  _animate() {
    window.requestAnimationFrame(this._animate.bind(this));
    this._update();
    this._render();
  }
  _update() {
    for (var i = 0; i < this._sceneOrtho.children.length; i++) {
      var child = this._sceneOrtho.children[i];
      if (child instanceof THREE.Sprite) {
        child.material.rotation = ((Math.PI * 2) / 180) * this._count;
      }
    }
    this._count++;
    if (this._count > 360) {
      this._count = 0;
    }
  }
  _render() {
    this._renderer.clear();
    this._renderer.clearDepth();
    this._renderer.render(this._sceneOrtho, this._cameraOrtho);
  }
}
