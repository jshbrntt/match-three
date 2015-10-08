import {Scene} from './../core/scene';

export class M3Scene extends Scene {
  constructor(game) {
    super(game);

    // Sprite
    let map = THREE.ImageUtils.loadTexture('assets/textures/tile_blue.png');
    map.minFilter = THREE.NearestFilter;
    let material = new THREE.SpriteMaterial({
      map: map
    });
    let sprite = new THREE.Sprite(material);
    sprite.scale.set(256, 256, 1);
    sprite.position.set(500, 500, 1);
    this.add(sprite);
  }
}
