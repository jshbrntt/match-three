import Model from 'core/mvc/model'

export default class GridModel extends Model {
  constructor (width, height) {
    super()
    this._width = width
    this._height = height
    this._vector = []
    this._vector.length = this._width * this._height
  }
  transform2D (x, y) {
    if (x < 0 || x > (this._width - 1) || y < 0 || y > (this._height - 1)) {
      return null
    }
    return x + y * this._width
  }
  transform1D (n) {
    if (n < 0 || n > (this._vector.length - 1)) {
      return null
    }
    return {
      x: n % this._width,
      y: Math.floor(n / this._width)
    }
  }
  handle2D (x, y) {
    let n = this.transform2D(x, y)
    if (n === null) {
      console.debug(`(${x},${y}) is outside of grid (${this._width},${this._height}).`)
    }
    return n
  }
  set (x, y, value) {
    let n = this.handle2D(x, y)
    if (this._vector[n]) {
      console.debug(`Overwritting existing value at position (${x},${y}).`)
    }
    this._vector[this.handle2D(x, y)] = value
  }
  get (x, y) {
    return this._vector[this.handle2D(x, y)]
  }
  remove (value) {
    let position = this.positionOf(value)
    if (position) {
      this.set(position.x, position.y, null)
    }
  }
  positionOf (value) {
    let n = this._vector.indexOf(value)
    if (n === -1) {
      return null
    }
    return this.transform1D(n)
  }
  [ Symbol.iterator ] () {
    let i = -1
    let vector = this._vector
    return {
      next () {
        i++
        return {
          done: i === vector.length - 1,
          value: vector[i]
        }
      }
    }
  }
  get width () {
    return this._width
  }
  get height () {
    return this._height
  }
  get size () {
    return this._vector.length
  }
}
