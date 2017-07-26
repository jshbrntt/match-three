import { Vector2 } from 'three'
import View from 'core/mvc/view'
import TileView from './tile-view'
import ServiceLocator from 'core/services/service-locator'

export default class BoardView extends View {
  constructor (model) {
    super(model)
    this._camera = ServiceLocator.get('Game').camera
    this._dimensions = new Vector2()

    this._model.onTileAdded = this.onTileAdded.bind(this)
  }
  onTileAdded (tileModel) {
    this.createTileView(tileModel)
  }
  getWorldDimensions (width, height) {
    let dimensions = new Vector2()
    let vFOV = this._camera.fov * Math.PI / 180
    dimensions.y = 2 * Math.tan(vFOV / 2) * this._camera.position.z
    let aspect = width / height
    dimensions.x = dimensions.y * aspect
    return dimensions
  }
  update () {
    this.model.added = []
  }
  resize (width, height) {
    this._dimensions = this.getWorldDimensions(width, height)
    let size = this.size
    let scale = 1

    if (height / width < size.y / size.x) {
      scale = this._dimensions.y / size.y
    } else {
      scale = this._dimensions.x / size.x
    }

    // Scaling
    this.scale.x *= scale
    this.scale.y *= scale

    // Centering
    size = this.size
    this.position.x = -size.x / 2
    this.position.y = -size.y / 2
  }
  createTileView (tileModel) {
    let tileView = new TileView(tileModel)
    tileView.position.x = tileModel.cell.x * tileView.width
    tileView.position.y = tileModel.cell.y * tileView.height
    this.add(tileView)
    this._tileViews.push(tileView)
  }
  createTileViews () {
    this.children.length = 0
    this._tileViews = []
    for (let tileModel of this.model) {
      if (!tileModel) {
        this._tileViews.push(null)
        continue
      }
      this.createTileView(tileModel)
    }
  }
}
