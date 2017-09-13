import { Object3D, Vector3 } from 'three'
import { GUI } from 'dat.gui/build/dat.gui'
import { Scene } from 'tetra/base'
import { GridView, GridModel } from 'tetra/grid'
import { KeyBinder, ServiceLocator } from 'tetra/base/services'
import { TileView, TileModel } from 'tetra/tile'
import { CellModel } from 'tetra/cell'
import { TileMapView, TileMapModel } from 'tetra/tilemap'
import { MouseEvent } from 'tetra/base/services/mouse'

export default class EditorScene extends Scene {
  constructor (game) {
    super(game)
    this.setupInput()
    this.setupContainer()
    this.setupGrid()
    this.setupUI()
    this.setupKeyBindings()

    this.setupTileTextures().then(() => {
      this.setupTileMap()
      this.setupTileCursor()
    })
  }
  setupTileTextures () {
    return TileView
      .loadTextures()
      .then((textures) => {
        return TileView.createMaterials(textures)
      })
  }
  setupTileCursor () {
    this.cursorModel = new TileModel(0)
    this.cursorView = new TileView(this.cursorModel)
    this.add(this.cursorView)
  }
  setupTileMap () {
    this.tileMapModel = new TileMapModel(10, 10)
    this.tileMapView = new TileMapView(this.tileMapModel)
    this.container.add(this.tileMapView)
  }
  setupInput () {
    this.input = {}
    this.input.Mouse = ServiceLocator.get('Mouse')
    this.input.Keyboard = ServiceLocator.get('Mouse')
    this.input.Mouse.addEventListener(MouseEvent.DOWN, this.onInputDown.bind(this))
    this.input.Mouse.addEventListener(MouseEvent.MOVE, this.onInputMove.bind(this))
    this.input.Mouse.addEventListener(MouseEvent.UP, this.onInputUp.bind(this))
    this.input.Mouse.addEventListener(MouseEvent.WHEEL, this.onInputScroll.bind(this))
  }
  updateCursorView () {
    let worldDimensions = this._game.getWorldDimensions()
    if (this.cursorView) {
      this.cursorView.position.x = this.input.Mouse.client.x - (worldDimensions.width / 2) - (this.cursorView.width / 2) * this.cursorView.scale.x
      this.cursorView.position.y = -this.input.Mouse.client.y + (worldDimensions.height / 2) - (this.cursorView.height / 2) * this.cursorView.scale.y
    }
  }
  onInputDown (event) {
    this._startMousePosition = this.input.Mouse.client.clone()
    this._startViewPosition = this.container.position.clone()
  }
  onInputMove (event) {
    if (this.input.Mouse.held && this.binder.held(32)) {
      this.container.position.set(
        this._startViewPosition.x + (this.input.Mouse.client.x - this._startMousePosition.x),
        this._startViewPosition.y - (this.input.Mouse.client.y - this._startMousePosition.y),
        0
      )
    }
    this.updateCursorView()
    this.getCellPosition(this.input.Mouse.position)
  }
  getCellPosition (vector) {
    let local = vector.clone()
      .sub(this.container.position)
      // .sub(this.tileMapView.size.divide(new Vector3(2, 2, 1)))
    // console.log(this.container.getWorldPosition())
    console.log(local)
  }
  applyZoom (event) {
    let delta = this.container.scale.x * event.delta.y / 1000
    this.container.scale.addScalar(delta)
    let mouse = new Vector3(
      this.input.Mouse.client.x - (window.innerWidth / 2),
      -(this.input.Mouse.client.y - (window.innerHeight / 2)),
      0
    )
    this.container.worldToLocal(mouse)
    mouse.multiplyScalar(delta)
    this.container.position.sub(mouse)
  }
  onInputUp (event) {
    this._startMousePosition = null
    this._startViewPosition = null

    let worldDimensions = this._game.getWorldDimensions()
    
    let insertTileModel = new TileModel(this.cursorModel.value)
    insertTileModel.cell = new CellModel(
      Math.round((this.input.Mouse.client.x - (worldDimensions.width / 2) - (this.container.position.x) - ((this.cursorView.width / 2) * this.cursorView.scale.x)) / (this.gridModel.size / this.gridModel.division)),
      Math.round((-this.input.Mouse.client.y + (worldDimensions.height / 2) - (this.container.position.y) - ((this.cursorView.height / 2)* this.cursorView.scale.y)) / (this.gridModel.size / this.gridModel.division)),
    )
    this.tileMapModel.set(insertTileModel.cell.x, insertTileModel.cell.y, insertTileModel, true)
  }
  onInputScroll (event) {
    if (this.binder.held(18)) {
      this.applyZoom(event)
      this.cursorView.scale.copy(this.container.scale)
      this.updateCursorView()
    } else {
      if (event.delta.y > 0) {
        if (this.cursorModel.value + 1 < TileView.MATERIALS.length) {
          this.cursorModel.value = this.cursorModel.value + 1
        }
      } else if (event.delta.y < 0) {
        if (this.cursorModel.value - 1 >= 0) {
          this.cursorModel.value = this.cursorModel.value - 1
        }
      }
    }
  }
  setupContainer () {
    this.container = new Object3D()
    this.add(this.container)
  }
  setupGrid () {
    this.gridModel = new GridModel(4800, 100)
    this.gridView = new GridView(this.gridModel)
    this.container.add(this.gridView)
  }
  setupUI () {
    this.gui = new GUI()
    this.gui.add(this.gridModel, 'division')
    this.gui.add(this.gridModel, 'size')
  }
  setupKeyBindings () {
    this.binder = new KeyBinder({
      37: () => { // left
        this.gridModel.size += 10
      },
      38: () => { // up
        this.gridModel.division++
      },
      39: () => { // right
        this.gridModel.size -= 10
      },
      40: () => { // down
        this.gridModel.division--
      },
      'P': () => {
        console.log(this.tileMapModel.toString())
      }
    })
  }
  destroy () {
    this.gui.destroy()
  }
}
