var THREE = require('three');

export class Scene extends THREE.Scene {
  constructor(game) {
    super();
    this._game = game;
  }
  update() {
    for (var i = 0; i < this.children.length; i++) {
      var child = this.children[i];
      // console.log(child);
      if ('update' in child) {
        child.update();
      }
    }
  }
  get game() {
    return this._game;
  }
}
