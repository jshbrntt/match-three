import Engine from 'tetra/base/engine'
import TetraGame from './game'

export default class TetraEngine extends Engine {
  constructor () {
    super(TetraGame)
  }
  init () {
    super.init()
    this.start()
  }
}
