import Scene from './../core/scene';
import Model from './../core/mvc/model';
import GridModel from './models/grid-model';
import TileModel from './models/tile-model';
import CellModel from './models/cell-model';
import TileView from './views/tile-view';
import GridView from './views/grid-view';
import GridController from './controllers/grid-controller';
import ServiceLocator from './../core/service-locator';

export default class M3Scene extends Scene {
  constructor(game) {
    super(game);
    this.setupModels();
  }
  setupModels() {
    let gridModel = new GridModel(10, 10, 1);
    let gridView = new GridView(gridModel);
    let gridController = new GridController(gridModel, gridView);
    gridModel.randomize();
    TileView
      .loadTextures()
      .then(((textures) => {
        TileView.createMaterials(textures);
        gridView.createTileViews();
        this._game._engine.resize();
      }).bind(this));
    this.add(gridView);
    document.addEventListener('keydown', (event) => {
      console.log(gridModel.toString());
    });
  }
  update() {
    super.update();
  }
}
