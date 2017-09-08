import { Object3D, Vector3 } from 'three'
import { GUI } from 'dat.gui/build/dat.gui'
import { Scene } from 'tetra/base'
import { GridView, GridModel } from 'tetra/grid'
import { KeyBinder, ServiceLocator } from 'tetra/base/services'
import { TileView } from 'tetra/tile'
import { TileMapView, TileMapModel } from 'tetra/tilemap'
import { MouseEvent } from 'tetra/base/services/mouse'

export default class EditorScene extends Scene {
  constructor (game) {
    super()
    this.setupInput()
    this.setupContainer()
    this.setupGrid()
    this.setupUI()
    this.setupKeyBindings()
    this.setupTileMap()
  }
  setupTileMap () {
    TileView
      .loadTextures()
      .then((textures) => {
        let view = new TileMapView(new TileMapModel(10, 10))
        this.container.add(view)
      })
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
  onInputDown (event) {
    this._startMousePosition = this.input.Mouse.client.clone()
    this._startViewPosition = this.container.position.clone()
  }
  onInputMove (event) {
    if (this.input.Mouse.held) {
      this.container.position.set(
        this._startViewPosition.x + (this.input.Mouse.client.x - this._startMousePosition.x),
        this._startViewPosition.y - (this.input.Mouse.client.y - this._startMousePosition.y),
        0
      )
    }
  }
  onInputUp (event) {
    this._startMousePosition = null
    this._startViewPosition = null
  }
  onInputScroll (event) {
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
      37: () => { // up
        this.gridModel.size += 10
      },
      38: () => { // right
        this.gridModel.division++
      },
      39: () => { // down
        this.gridModel.size -= 10
      },
      40: () => { // left
        this.gridModel.division--
      }
    })
  }
  destroy () {
    this.gui.destroy()
  }
}
