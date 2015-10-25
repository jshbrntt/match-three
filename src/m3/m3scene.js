import {Scene} from './../core/scene';
import {Model} from './../core/mvc/model';
import {GridModel} from './models/grid-model';
import {TileModel} from './models/tile-model';
import {CellModel} from './models/cell-model';
import {TileView} from './views/tile-view';
import {GridView} from './views/grid-view';

export class M3Scene extends Scene {
  constructor(game) {
    super(game);
    this.setupModels();
  }
  setupModels() {
    this._gridModel = new GridModel(8, 9, 1);
    this._gridView = new GridView(this._gridModel);
    this._gridView.group.position.set(50, 50, 0);
    this._gridModel.randomize();
    this.add(this._gridView.group);
    console.log(this._gridModel.toString());
    // var model = new Model();
    // var tileModel2 = new TileModel(2, new CellModel(2, 1));
    // var tileView2 = new TileView(tileModel2, this._textures);
    // function loadTextures(onLoad) {
    //   var textures = [];
    //   var filenames = ['blue', 'green', 'purple', 'red', 'yellow'];
    //   for (var i = 0; i < filenames.length; i++) {
    //     var filename = 'assets/textures/tile_' + filenames[i] + '.png';
    //     console.log(filename);
    //     THREE.ImageUtils.loadTexture(filename, undefined, (map) => {
    //       map.minFilter = THREE.NearestFilter;
    //       var material = new THREE.SpriteMaterial({
    //         map: map
    //       });
    //       textures.push(material);
    //       if(textures.length === filenames.length) {
    //         onLoad(textures);
    //       }
    //     });
    //   }
    // }
    // loadTextures((textures) => {
    //   var tileModel = new TileModel(3, new CellModel(1, 1));
    //   var tileView = new TileView(tileModel, textures);
    //   this.add(tileView.sprite);
    // });
    // this.add(tileView2.sprite);
  }
}
