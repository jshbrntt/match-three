import { Scene } from 'tetra/base'
import { TileView } from 'tetra/tile'
import { BoardModel, BoardView, BoardController } from 'tetra/board'
import { KeyBinder, ServiceLocator } from 'tetra/base/services'
import IcosaEvent from 'icosa/event'

export default class LevelScene extends Scene {
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
    this.boardModel = new BoardModel(10, 11, 1.4)
    this.boardView = new BoardView(this.boardModel)
    this.boardController = new BoardController(this.boardModel, this.boardView)
    this.boardModel.randomize()
    TileView
      .loadTextures()
      .then((textures) => {
        TileView.createMaterials(textures)
        this.boardView.createTileViews()
        this.add(this.boardView)
        this._game._engine.resize()
      })
    this.binder = new KeyBinder({
      'P': () => {
        console.log(this.boardModel.toString())
      }
    })
  }
}
