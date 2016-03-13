import THREE from 'three';
import View from './../../core/mvc/view';
import TileView from './tile-view';
import ServiceLocator from './../../core/service-locator';

export default class GridView extends View {
  constructor(model) {
    super(model);
    this._model.onRandomized = this.onRandomized.bind(this);
  }
  resize(width, height) {
    let camera = ServiceLocator.get('M3Game').camera;

    let size = this.size;

    let vFOV   = camera.fov * Math.PI / 180;
    let projectedHeight = 2 * Math.tan( vFOV / 2 ) * camera.position.z;
    let aspect = width / height;
    let projectedWidth  = projectedHeight * aspect;
    let scale = 1;

    if (height < width) {
      scale = projectedHeight / size.y;
    }
    else {
      scale = projectedWidth / size.x;
    }

    this.scale.x *= scale;
    this.scale.y *= scale;

    size = this.size;

    this.position.x = -size.x / 2;
    this.position.y = -size.y / 2;

    var vector = new THREE.Vector3();
  }
  loadTextures(onLoad) {
    this._textures = [];
    var filenames = ['blue', 'green', 'purple', 'red', 'yellow'];
    for (var i = 0; i < filenames.length; i++) {
      var filename = 'assets/textures/tile_' + filenames[i] + '.png';
      console.log(filename);
      var loader = new THREE.TextureLoader();
      loader.load(filename, (texture) => {
        this._textures.push(texture);
        if(this._textures.length === filenames.length) {
          onLoad();
        }
      });
    }
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
    this.loadTextures(this.createTileViews.bind(this));
  }
  get textures() {
    return this._textures;
  }
}
