import Scene from 'core/views/scene'
import BoardModel from './models/board-model'
import TileView from './views/tile-view'
import BoardView from './views/board-view'
import BoardController from './controllers/board-controller'
import ServiceLocator from 'core/services/service-locator'
import IcosaEvent from './../../icosa/icosa-event'

export default class M3Scene extends Scene {
  constructor (game) {
    super(game)
    this.setupModels()
    this._socket = ServiceLocator.get('Socket')
    this._socket.on(IcosaEvent.CONNECT, id => {
      this.cleanUp()
      this.setupModels()
    })
  }
  cleanUp () {
    for (let child of this.children) {
      this.remove(child)
    }
  }
  setupModels () {
    this.boardModel = new BoardModel(12, 13, 1.4)
    this.boardView = new BoardView(this.boardModel)
    this.boardController = new BoardController(this.boardModel, this.boardView)
    this.boardModel.randomize()
    TileView
      .loadTextures()
      .then((textures) => {
        TileView.createMaterials(textures)
        this.boardView.createTileViews()
        this._game._engine.resize()
      })
    this.add(this.boardView)
  }
  update () {
    super.update()
  }
}
