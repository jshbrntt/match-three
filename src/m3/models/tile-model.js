import Model from './../../core/mvc/model'
import CellModel from './cell-model'
import ServiceLocator from './../../core/service-locator'

export default class TileModel extends Model {
  constructor (value, boardModel) {
    super()

    this._value = value
    this._boardModel = boardModel

    this._highlight = false
    this._onMoved = null
    this._onRemoved = null
    this._swapMovements = 0
  }

  swap (tile) {
    return new Promise((resolve) => {
      Promise.all([
        this.move(tile.cell.x, tile.cell.y),
        tile.move(this.cell.x, this.cell.y)
      ]).then(resolve)
    })
  }

  move (x, y) {
    return new Promise((resolve, reject) => {
      let destination = new CellModel(x, y)
      if (this.cell.equals(destination)) {
        reject(new Error('Cannot move tile to the position it already occupies.'))
      }
      var time = Math.sqrt((2 * this.cell.distance(destination)) / 64) * 1000
      if (this._onMoved) {
        this._onMoved(destination, time).then(() => {
          this.boardModel.remove(this)
          this.boardModel.set(x, y, this)
          this.update()
          resolve()
        })
      }else {
        this.boardModel.remove(this)
        this.boardModel.set(x, y, this)
        this.update()
        resolve()
      }
    })
  }

  remove () {
    let cell = this.cell
    this.boardModel.set(cell.x, cell.y, null)
    this.update()
  }

  distance (tileModel) {
    if (this.cell && tileModel.cell) {
      return this.cell.distance(tileModel.cell)
    }
    return null
  }

  equals (tileModel) {
    if (!tileModel) {
      return false
    }
    return this.value === tileModel.value
  }

  get value () {
    return this._value
  }

  set cell (value) {
    this.boardModel.set(value.x, value.y, this)
  }

  get cell () {
    let position = this.boardModel.positionOf(this)
    if (position) {
      return new CellModel(position.x, position.y)
    }
    return null
  }

  get onRemoved () {
    return this._onRemoved
  }

  get onMoved () {
    return this._onMoved
  }

  get highlight () {
    return this._highlight
  }

  get boardModel () {
    return this._boardModel
  }

  set highlight (value) {
    this._highlight = value
    this.update()
  }
}
