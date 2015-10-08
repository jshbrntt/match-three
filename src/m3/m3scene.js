import {Scene} from './../core/scene';
import {Model} from './../core/mvc/model';
import {GridModel} from './models/grid-model';

export class M3Scene extends Scene {
  constructor(game) {
    super(game);

    // Sprite
    let map = THREE.ImageUtils.loadTexture('assets/textures/tile_blue.png');
    map.minFilter = THREE.NearestFilter;
    let material = new THREE.SpriteMaterial({
      map: map
    });
    let sprite = new THREE.Sprite(material);
    sprite.scale.set(256, 256, 1);
    sprite.position.set(500, 500, 1);
    this.add(sprite);

    this.setupModels();
  }
  setupModels() {
    this._gridModel = new GridModel(8, 9);
    this._gridModel.randomize();
    console.log(this._gridModel.toString());
    // var model = new Model();
  }
}
