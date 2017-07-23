import { Scene as ThreeScene } from 'three'

export default class Scene extends ThreeScene {
  constructor (game) {
    super()
    this._game = game
  }
  resize (width = this._game.renderer.domElement.width , height = this._game.renderer.domElement.height) {
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
  get game () {
    return this._game
  }
}
