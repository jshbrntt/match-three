import {Engine} from './../core/engine';
import {M3Game} from './m3game';

export class M3Engine extends Engine {
  constructor() {
    super(M3Game);
    this.start();
  }
}
