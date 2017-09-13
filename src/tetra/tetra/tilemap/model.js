import { Model } from 'tetra/base/mvc'

export default class TileMapModel extends Model {
  constructor (width, height) {
    super()
    this._width = width
    this._height = height
    this._vector = TileMapModel.createVector(this._width, this._height)
  }
  static transform2D (x, y, width) {
    return x + y * width
  }
  transform2D (x, y) {
    return TileMapModel.transform2D(x, y, this._width)
  }
  static transform1D (n, width) {
    return {
      x: n % width,
      y: Math.floor(n / width)
    }
  }
  transform1D (n) {
    return TileMapModel.transform1D(n, this._width)
  }
  static isOutOfRange (x, y, width, height) {
    return (x > width - 1 || y > height - 1 || x < 0 || y < 0)
  }
  isOutOfRange (x, y) {
    return TileMapModel.isOutOfRange(x, y, this._width, this._height)
  }
  static resizeVector (oldVector, oldWidth, oldHeight, newWidth, newHeight) {
    let newVector = []
    newVector.length = newWidth * newHeight
    if (this._vector) {
      for (let y = 0; y < this._height; y++) {
        for (let x = 0; x < this._width; x++) {
          newVector[TileMapModel.transform2D(x, y, newWidth)] = oldVector[TileMapModel.transform2D(x, y, oldWidth)]
        }
      }
    }
    return newVector
  }
  static createVector (width, height) {
    let vector = []
    vector.length = width * height
    return vector
  }
  resize (width, height) {
    return TileMapModel.resizeVector(
      this._vector,
      this._width,
      this._height,
      width,
      height
    )
  }
  set (x, y, value, force = false) {
    if (this.isOutOfRange(x, y)) {
      let newWidth = Math.max(this._width, x + 1)
      let newHeight = Math.max(this._height, y + 2)
      this.resize(newWidth, newHeight)
    }
    let n = this.transform2D(x, y)
    if (!force && this._vector[n]) {
      throw new Error(`Cannot overwrite existing value at position [${x},${y}], unless forced.`)
    }
    this._vector[n] = value
    this.update()
  }
  get (x, y) {
    return this._vector[this.transform2D(x, y)]
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
      return undefined
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
