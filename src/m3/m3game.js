import Game from './../core/game';
import M3Scene from './m3scene';

export default class M3Game extends Game {
  constructor(renderer) {
    super(renderer);
    this.scene = new M3Scene(this);
  }
}
