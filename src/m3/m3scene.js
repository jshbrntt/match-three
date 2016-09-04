import Scene from './../core/scene';
import BoardModel from './models/board-model';
import TileView from './views/tile-view';
import BoardView from './views/board-view';
import BoardController from './controllers/board-controller';

export default class M3Scene extends Scene {
  constructor(game) {
    super(game);
    this.setupModels();
  }
  setupModels() {
    let boardModel = new BoardModel(5, 7, 1.4);
    let boardView = new BoardView(boardModel);
    let boardController = new BoardController(boardModel, boardView);
    boardModel.randomize();
    TileView
      .loadTextures()
      .then((textures) => {
        TileView.createMaterials(textures);
        boardView.createTileViews();
        this._game._engine.resize();
      });
    this.add(boardView);
    document.addEventListener('keydown', (event) => {
      console.log(boardModel.toString());
    });
  }
  update() {
    super.update();
  }
}
