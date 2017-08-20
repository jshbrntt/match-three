import { Model } from 'tetra/base/mvc'

export default class TileMapModel extends Model {
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
      this.set(position.x, position.y, null, true)
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
  toString () {
    let string = ''
    for (let y = this.height - 1; y >= 0; y--) {
      for (let x = 0; x < this.width; x++) {
        let value = this._vector[this.transform2D(x, y)]
        string += typeof value === 'undefined' ? 'X' : value
        if (x === this._width - 1) {
          string += '\n'
        }
      }
    }
    return string
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
