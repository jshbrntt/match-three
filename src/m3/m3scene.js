import Scene from './../core/scene';
import BoardModel from './models/board-model';
import TileView from './views/tile-view';
import BoardView from './views/board-view';
import BoardController from './controllers/board-controller';
import ServiceLocator from './../core/service-locator';

export default class M3Scene extends Scene {
  constructor(game) {
    super(game);
    this.setupModels();
    this._socket = ServiceLocator.get('Socket');
    this._socket.on('connected', sockets => {
      this.cleanUp();
      this.setupModels();
    });
  }
  cleanUp() {
    for (let child of this.children) {
      this.remove(child);
    }
  }
  setupModels() {
    let boardModel = new BoardModel(12, 13, 1.4);
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
  }
  update() {
    super.update();
  }
}
