import { Color, GridHelper } from 'three'
import { View } from 'tetra/base/mvc'

export default class GridView extends View {
  constructor (model) {
    super(model)
    model.onUpdated = this.render.bind(this)
    this.render()
  }
  render () {
    if (this.grid) {
      this.remove(this.grid)
    }
    this.grid = new GridHelper(this.model._size, this.model._division, new Color(0xeeeeee), new Color(0x000000))
    this.grid.rotation.x = Math.PI / 2
    this.add(this.grid)
  }
}
