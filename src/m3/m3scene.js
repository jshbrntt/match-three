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
    this._gridModel = new GridModel(8, 9);
    this._gridView = new GridView(this._gridModel);
    this._gridModel.randomize();
    this.add(this._gridView.group);
    console.log(this._gridModel.toString());
    // var model = new Model();
    // var tileModel = new TileModel(3, new CellModel(1, 1));
    // var tileView = new TileView(tileModel, this._textures);
    // var tileModel2 = new TileModel(2, new CellModel(2, 1));
    // var tileView2 = new TileView(tileModel2, this._textures);
    // this.add(tileView.sprite);
    // this.add(tileView2.sprite);
  }
}
