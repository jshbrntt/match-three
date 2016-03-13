import THREE from 'three';
import View from './../../core/mvc/view';
import TileView from './tile-view';
import ServiceLocator from './../../core/service-locator';

export default class GridView extends View {
  constructor(model) {
    super(model);
    this._group = new THREE.Object3D();
    this._model.onRandomized = this.onRandomized.bind(this);
  }
  loadTextures(onLoad) {
    this._textures = [];
    var filenames = ['blue', 'green', 'purple', 'red', 'yellow'];

    function onTextureLoaded(texture) {
      map.minFilter = THREE.NearestFilter;
      var material = new THREE.SpriteMaterial({
        map: map
      });
      this._textures.push(material);
      if(this._textures.length === filenames.length) {
        onLoad();
      }
    }
    for (var i = 0; i < filenames.length; i++) {
      var filename = 'assets/textures/tile_' + filenames[i] + '.png';
      console.log(filename);
      var loader = new THREE.TextureLoader();
      loader.load(filename, (map) => {
        map.minFilter = THREE.NearestFilter;
        var material = new THREE.SpriteMaterial({
          map: map
        });
        this._textures.push(material);
        if(this._textures.length === filenames.length) {
          onLoad();
        }
      });
    }
  }
  createTileViews() {
    if (!this._tilesView) {
      this._tilesView = new THREE.Object3D();
      // this._tilesView.clipRect = new Rectangle(0, _textureSize, model.width * _textureSize, (model.height - 1) * _textureSize);
      this._group.add(this._tilesView);
    }
    this._tilesView.children.length = 0;
    this._tileViews = [];
    for (var i = 0; i < this._model.size; i++) {
      var tileCell = this._model.transformIndexToCellModel(i);
      var tileModel = this._model.getTileModel(tileCell);
      if (!tileModel) {
        this._tileViews.push(null);
        continue;
      }

      var tileView = new TileView(tileModel, this._textures);
      tileView.x = tileCell.x * tileView.sprite.scale.x;
      tileView.y = tileCell.y * tileView.sprite.scale.y;
      this._tilesView.add(tileView.sprite);
      this._tileViews.push(tileView);
    }
  }
  onRandomized() {
    this.loadTextures(this.createTileViews.bind(this));
  }
  get group() {
    return this._group;
  }
  get textures() {
    return this._textures;
  }
}
