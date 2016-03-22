import THREE from 'three';
import View from './../../core/mvc/view';
import TileView from './tile-view';
import ServiceLocator from './../../core/service-locator';
import MouseEvent from './../../core/mouse-event';

export default class GridView extends View {
  constructor(model) {
    super(model);
    this._camera = ServiceLocator.get('M3Game').camera;
    this._dimensions = new THREE.Vector2();
  }
  getWorldDimensions(width, height) {
    let dimensions = new THREE.Vector2();
    let vFOV = this._camera.fov * Math.PI / 180;
    dimensions.y = 2 * Math.tan(vFOV / 2) * this._camera.position.z;
    let aspect = width / height;
    dimensions.x = dimensions.y * aspect;
    return dimensions;
  }
  update() {
    super.update();
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

      var tileView = new TileView(tileModel);
      tileView.position.x = tileCell.x * tileView.size.x;
      tileView.position.y = tileCell.y * tileView.size.y;
      this.add(tileView);
      this._tileViews.push(tileView);
    }
  }
}
