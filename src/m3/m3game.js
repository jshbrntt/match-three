import Game from 'core/game'
import Mouse from 'core/services/mouse'
import Touch from 'core/services/touch'
import M3Scene from './m3scene'
import TWEEN from 'tween.js'
import ServiceLocator from 'core/services/service-locator'

export default class M3Game extends Game {
  constructor (renderer) {
    super(renderer)
    ServiceLocator.provide('Mouse', new Mouse())
    ServiceLocator.provide('Touch', new Touch())
  }
  start () {
    super.start()
    this.scene = new M3Scene(this)
  }
  _update () {
    super._update()
    TWEEN.update()
  }
}
