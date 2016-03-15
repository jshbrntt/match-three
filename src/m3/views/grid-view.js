import THREE from 'three';
import View from './../../core/mvc/view';
import TileView from './tile-view';
import ServiceLocator from './../../core/service-locator';
import MouseEvent from './../../core/mouse-event';

export default class GridView extends View {
  constructor(model) {
    super(model);
    this._model.onRandomized = this.onRandomized.bind(this);
    this._raycaster = new THREE.Raycaster();
    this._camera = ServiceLocator.get('M3Game').camera;
    this._mouse = ServiceLocator.get('Mouse');
    // this._mouse.addEventListener(MouseEvent.DOWN, this.onMouseDown.bind(this));
    // this._mouse.addEventListener(MouseEvent.UP, this.onMouseUp.bind(this));
    // this._mouse.addEventListener(MouseEvent.MOVE, this.onMouseMove.bind(this));
    this._selectedTileView = null;
    this._dimensions = new THREE.Vector2();
  }
  onMouseMove(event) {
    this._raycaster.setFromCamera(this._mouse.position, this._camera);
    let intersects = this._raycaster.intersectObjects(this.children, true);
    for (let intersect of intersects) {
      this._selectedTileView = intersect.object.parent;
    }
  }
  getWorldDimensions(width, height) {
    let dimensions = new THREE.Vector2();
    let vFOV = this._camera.fov * Math.PI / 180;
    dimensions.y = 2 * Math.tan(vFOV / 2) * this._camera.position.z;
    let aspect = width / height;
    dimensions.x = dimensions.y * aspect;
    return dimensions;
  }
  onMouseDown(event) {
    this._raycaster.setFromCamera(this._mouse.position, this._camera);
    let intersects = this._raycaster.intersectObjects(this.children, true);
    for (let intersect of intersects) {
      this._selectedTileView = intersect.object.parent;
    }
  }
  onMouseUp(event) {
    this._selectedTileView = null;
  }
  update() {
    super.update();
    // if (this._selectedTileView) {
    //   let x = (this._mouse.position.x + 1) / 2 * this._dimensions.x;
    //   let y = ((this._mouse.position.y - 1) / -2) * this._dimensions.y;
    //   this._selectedTileView.position.x = (x + this.position.x) / this.scale.x;
    //   this._selectedTileView.position.y = (y + this.position.y) / -this.scale.y
    // }
  }
  resize(width, height) {
    this._dimensions = this.getWorldDimensions(width, height);
    let size = this.size;
    let scale = 1;

    if (height < width) {
      scale = this._dimensions.y / size.y;
    } else {
      scale = this._dimensions.x / size.x;
    }

    this.scale.x *= scale;
    this.scale.y *= scale;

    size = this.size;

    this.position.x = -size.x / 2;
    this.position.y = -size.y / 2;

    var vector = new THREE.Vector3();
  }
  loadTextures(onLoad) {
    return new Promise((resolve, reject) => {
      this._textures = [];
      var filenames = ['blue', 'green', 'purple', 'red', 'yellow'];
      for (var i = 0; i < filenames.length; i++) {
        var filename = 'assets/textures/tile_' + filenames[i] + '.png';
        console.log(filename);
        var loader = new THREE.TextureLoader();
        loader.load(filename, (texture) => {
          this._textures.push(texture);
          if (this._textures.length === filenames.length) {
            resolve();
          }
        });
      }
    });
  }
  createTileViews() {
    this.children.length = 0;
    this._tileViews = [];
    for (var i = 0; i < this._model.size; i++) {
      var tileCell = this._model.transformIndexToCellModel(i);
      var tileModel = this._model.getTileModel(tileCell);
      if (!tileModel) {
        this._tileViews.push(null);
        continue;
      }

      var tileView = new TileView(tileModel, this._textures);
      tileView.position.x = tileCell.x * tileView.size.x;
      tileView.position.y = tileCell.y * tileView.size.y;
      this.add(tileView);
      this._tileViews.push(tileView);
    }
  }
  onRandomized() {
    // this.loadTextures(this.createTileViews.bind(this));
  }
  get textures() {
    return this._textures;
  }
}
