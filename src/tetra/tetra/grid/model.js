import { Model } from 'tetra/base/mvc'

export default class GridModel extends Model {
  constructor (size, division) {
    super()
    this._size = size
    this._division = division
  }
  set size (value) {
    this._size = value
    this.update()
  }
  get size () {
    return this._size
  }
  set division (value) {
    this._division = value
    this.update()
  }
  get division () {
    return this._division
  }
}
