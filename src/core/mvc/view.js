import { Object3D, Box3 } from 'three'

export default class View extends Object3D {
  constructor (model) {
    if (!model) {
      throw new ReferenceError('View requires a model to be passed.')
    }
    super()
    this._model = model
    this._model.onUpdated = this.onUpdated
  }
  resize (width, height) {
    for (let child of this.children) {
      if ('resize' in child) {
        child.resize(width, height)
      }
    }
  }
  update () {
    for (let child of this.children) {
      if ('update' in child) {
        child.update()
      }
    }
  }
  onUpdated () {
    // Abstract
  }
  get model () {
    return this._model
  }
  get size () {
    return new Box3().setFromObject(this).size()
  }
  get screen () {
    // return {
    //   position:
    //   size:
    // }
  }
}
