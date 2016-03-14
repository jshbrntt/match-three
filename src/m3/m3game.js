import Game from './../core/game';
import Mouse from './../core/mouse';
import M3Scene from './m3scene';
import ServiceLocator from './../core/service-locator';

export default class M3Game extends Game {
  constructor(renderer) {
    super(renderer);
    ServiceLocator.provide(new Mouse());
  }
  start() {
    super.start();
    this.scene = new M3Scene(this);
  }
  _update() {
    super._update();
  }
}
