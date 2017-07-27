import io from 'socket.io-client'
import TWEEN from 'tween.js'
import { Game } from 'tetra/base'
import { Mouse } from 'tetra/base/services/mouse'
import { ServiceLocator } from 'tetra/base/services'
import { EditorScene, LevelScene } from 'tetra/scenes'
import { Touch } from 'tetra/base/services/touch'

export default class TetraGame extends Game {
  constructor (renderer) {
    super(renderer)
    ServiceLocator.provide('Mouse', new Mouse())
    ServiceLocator.provide('Touch', new Touch())
    ServiceLocator.provide('Socket', io())
  }
  start () {
    super.start()
    this.scene = new LevelScene(this)
  }
  _update () {
    super._update()
    TWEEN.update()
  }
}
