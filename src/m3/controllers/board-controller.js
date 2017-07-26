import { Vector2, Vector3 } from 'three'
// import Modernizr from 'modernizr'
import Controller from 'core/mvc/controller'
import ServiceLocator from 'core/services/service-locator'
import MouseEvent from 'core/services/mouse/mouse-event'
import TileView from './../views/tile-view'

export default class BoardController extends Controller {
  constructor (model, view) {
    super(model, view)
    this._camera = ServiceLocator.get('Game').camera
    // this._socket = ServiceLocator.get('Socket')
    this._selected = []
    this.addInputEventListeners()
  }
  addInputEventListeners () {
    this._input = {}

    this._input.Mouse = ServiceLocator.get('Mouse')
    this._input.Mouse.addEventListener(MouseEvent.DOWN, this.onInputDown.bind(this))
    this._input.Mouse.addEventListener(MouseEvent.MOVE, this.onInputMove.bind(this))
    this._input.Mouse.addEventListener(MouseEvent.UP, this.onInputUp.bind(this))

    // if (Modernizr.touchevents) {
    //   this._input.Touch = ServiceLocator.get('Touch')
    //   this._input.Touch.addEventListener(TouchEvent.START, this.onInputDown.bind(this))
    //   this._input.Touch.addEventListener(TouchEvent.MOVE, this.onInputMove.bind(this))
    //   this._input.Touch.addEventListener(TouchEvent.END, this.onInputUp.bind(this))
    // }

    // this._socket.on('swap', data => {
    //   console.log(`${data} Swapped`)
    //   this.model.swapTiles(this.model.get(data[0], data[1]), this.model.get(data[2], data[3]))
    // })
  }
  getInput (event) {
    let match = /\.(.+)Event/g.exec(event.type)
    return match.length ? this._input[match[1]] : null
  }
  getTileModelAtPosition (position) {
    // Screen space to world space transform.
    let vector = new Vector3(position.x, position.y, 0.5)
    vector.unproject(this._camera)
    let dimensions = new Vector2(
      TileView.GEOMETRY.parameters.width * this.model.width * this.view.scale.x,
      TileView.GEOMETRY.parameters.height * (this.model.height - 1) * this.view.scale.y
    )
    let projectionDirection = vector.sub(this._camera.position).normalize()
    let projectionDistance = this._camera.position.z / projectionDirection.z
    let projectedPosition = this._camera.position.clone().add(projectionDirection.multiplyScalar(projectionDistance))
    // Position relative to the view, then quantized to the grid space.
    let gridPosition = projectedPosition.clone()
      .sub(this.view.position)
      .sub(dimensions)
      .divide(new Vector2(-dimensions.x / this.model.width, -dimensions.y / (this.model.height - 1)))
      .floor()
    // Getting the tile from that position in the grid.
    try {
      return this.model.get(gridPosition.x, gridPosition.y)
    } catch (error) {
      return null
    }
  }
  clearSwap () {
    for (let selected of this._selected) {
      selected.highlight = false
    }
    this._selected = []
  }
  selectTileModel (model) {
    // Check its not the same tile.
    if (this._selected.indexOf(model) === -1) {
      // If its the first tile there are no restrictions so add it.
      if (!this._selected.length) {
        model.highlight = true
        this._selected.push(model)
      } else if (this._selected[0].distance(model) === 1) {
        model.highlight = true
        this._selected.push(model)
      // Otherwise check the last tile is next to the new tile.
      } else {
        this.clearSwap()
      }
    }
  }
  swapSelectedTiles () {
    this.model.swapTiles(this._selected[0], this._selected[1])
    // this._socket.emit('swap', [
    //   this._selected[0].cell.x,
    //   this._selected[0].cell.y,
    //   this._selected[1].cell.x,
    //   this._selected[1].cell.y
    // ])
    this.clearSwap()
  }
  onInputDown (event) {
    let input = this.getInput(event)
    let tileModel = this.getTileModelAtPosition(input.position)
    if (tileModel) {
      this.selectTileModel(tileModel)
    }
  }
  onInputMove (event) {
    let input = this.getInput(event)
    let tileModel = this.getTileModelAtPosition(input.position)
    if (tileModel && this._selected.length && input.held) {
      this.selectTileModel(tileModel)
      if (this._selected.length === 2) {
        this.swapSelectedTiles()
      }
    }
  }
  onInputUp (event) {
    if (this._selected.length === 2) {
      this.swapSelectedTiles()
    }
  }
}
