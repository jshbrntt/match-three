import { GUI } from 'dat.gui/build/dat.gui'
import { Scene } from 'tetra/base'
import { GridView, GridModel } from 'tetra/grid'
import { KeyBinder } from 'tetra/base/services'

export default class EditorScene extends Scene {
  constructor (game) {
    super()
    this.setupGrid()
    this.setupUI()
    this.setupKeyBindings()
  }
  setupGrid () {
    this.gridModel = new GridModel(100, 10)
    this.gridView = new GridView(this.gridModel)
    this.add(this.gridView)
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
}
