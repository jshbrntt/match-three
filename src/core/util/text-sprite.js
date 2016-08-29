import THREE from 'three';

export default class TextSprite extends THREE.Sprite {
  constructor(message, parameters) {

    if (parameters === undefined) parameters = {};

    let fontface = parameters.hasOwnProperty("fontface") ?
      parameters.fontface : "Arial";

    let fontsize = parameters.hasOwnProperty("fontsize") ?
      parameters.fontsize : 18;

    let borderThickness = parameters.hasOwnProperty("borderThickness") ?
      parameters.borderThickness : 4;

    let borderColor = parameters.hasOwnProperty("borderColor") ?
      parameters.borderColor : {
        r: 0,
        g: 0,
        b: 0,
        a: 1.0
      };

    let backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
      parameters.backgroundColor : {
        r: 255,
        g: 255,
        b: 255,
        a: 1.0
      };

    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    context.font = "Bold " + fontsize + "px " + fontface;

    // get size data (height depends only on font size)
    let metrics = context.measureText(message);
    let textWidth = metrics.width;

    // background color
    context.fillStyle = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," +
      backgroundColor.b + "," + backgroundColor.a + ")";
    // border color
    context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," +
      borderColor.b + "," + borderColor.a + ")";

    context.lineWidth = borderThickness;
    TextSprite.roundRect(context, borderThickness / 2, borderThickness / 2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
    // 1.4 is extra height factor for text below baseline: g,j,p,q.

    // text color
    context.fillStyle = "rgba(0, 0, 0, 1.0)";

    context.fillText(message, borderThickness, fontsize + borderThickness);

    // canvas contents will be used for a texture
    let texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    let spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
    });
    super(spriteMaterial);
    this.scale.set(80, 40, 1.0);
  }
  static roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
}
