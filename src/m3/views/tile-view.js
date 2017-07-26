import { DoubleSide, Mesh, MeshBasicMaterial, TextureLoader, FrontSide, BackSide, PlaneGeometry } from 'three'
import * as TWEEN from 'tween.js'
import View from 'core/mvc/view'
import TextSprite from 'core/views/text-sprite'

export default class TileView extends View {
  constructor (model) {
    super(model)
    if (!TileView.MATERIALS.length) {
      throw new Error('Missing materials please create them with `TileView.createMaterials(textures)`.')
    }
    if (model.value > TileView.MATERIALS.length - 1) {
      throw new Error(`No material exists for tile value \`${model.value}\`.`)
    }
    this._plane = new Mesh(TileView.GEOMETRY, TileView.MATERIALS[this._model.value])
    this._plane.position.x = TileView.GEOMETRY.parameters.width / 2
    this._plane.position.y = TileView.GEOMETRY.parameters.height / 2

    this._tweenQueue = []
    this._callbackQueue = []

    this._model._onMoved = this.onMoved.bind(this)
    this._model._onRemoved = this.onRemoved.bind(this)
    this._model._onUpdated = this.onUpdated.bind(this)

    this._highlight = false

    this._outlineMaterial = new MeshBasicMaterial({color: 0xffffff, side: FrontSide})
    this._outline = new Mesh(TileView.GEOMETRY, this._outlineMaterial)
    this._outline.position.x = TileView.GEOMETRY.parameters.width / 2
    this._outline.position.y = TileView.GEOMETRY.parameters.height / 2
    this._outline.visible = false

    this.add(this._outline)
    this.add(this._plane)

  // this.renderCell()
  }
  renderCell () {
    if (!this.model.cell) {
      return
    }
    if (this._label) {
      this.remove(this._label)
    }
    this._label = new TextSprite(`${this.model.cell.toString()}`, {
      fontsize: 24,
      borderColor: {
        r: 0,
        g: 0,
        b: 0,
        a: 1.0
      },
      backgroundColor: {
        r: 255,
        g: 255,
        b: 255,
        a: 0.8
      }
    })
    this._label.position.x = TileView.GEOMETRY.parameters.width / 2 + this._label.scale.x / 2
    this._label.position.y = TileView.GEOMETRY.parameters.height / 2
    this.add(this._label)
  }
  static loadTextures () {
    function onProgress (event) {
      console.debug(`${((event.loaded / event.total) * 100).toFixed()}% ${event.currentTarget.responseURL}`)
    }
    let loader = new TextureLoader()
    return Promise.all(
      Object.keys(TileView.IMAGES).map(name => {
        let url = TileView.IMAGES[name]
        return new Promise((resolve, reject) => {
          loader.load(url, resolve, onProgress, reject)
        })
      })
    ).then(textures => {
      TileView.TEXTURES = textures
      return TileView.TEXTURES
    })
  }
  static createOutline () {
    let outlineMaterial = new MeshBasicMaterial({color: 0xffffff, side: BackSide})
    let outlineMesh = new Mesh(TileView.GEOMETRY, outlineMaterial)
    outlineMesh.scale.multiplyScale(1.05)
    this.add(outlineMesh)
  }
  static createMaterials (textures) {
    for (let texture of textures) {
      TileView.MATERIALS.push(new MeshBasicMaterial({
        map: texture,
        side: DoubleSide,
        transparent: true,
        depthWrite: false,
        depthTest: false
      }))
    }
  }
  onMoved (cell, time) {
    return new Promise((resolve) => {
      let tween = new TWEEN.Tween(this.position).to({
        x: cell.x * this.width,
        y: cell.y * this.height
      }, time)
      tween.onComplete(resolve)
      tween.easing(TWEEN.Easing.Quadratic.InOut)
      tween.start()
    })
  }
  update () {
    // this._plane.rotation.x += Math.random() * .05
    // let time    = new Date(Date.now()).getMilliseconds() / 1000
    // let circle  = Math.PI * 2 * time
    // let offsetX = this.model.cell.x / this.model.BoardModel.width * Math.PI * 1
    // let offsetY = this.model.cell.y / this.model.BoardModel.height * Math.PI * 1
    // this._plane.rotation.y = circle + offsetX + offsetY
  }
  onRemoved () {
    if (this.parent) {
      this.parent.remove(this)
    }
  }
  onTweened () {
    this._tweenQueue.splice(0, 1)
    let onFinished = this._callbackQueue[0]
    if (onFinished) {
      onFinished()
    }
    this._callbackQueue.splice(0, 1)
  }
  onUpdated () {
    super.onUpdated()
    if (!this.model.cell && this.parent) {
      this.parent.remove(this)
      return
    }
    // this.renderCell()
    this.highlight = this.model.highlight
  }
  set highlight (value) {
    this._outline.visible = value
  }
  get highlight () {
    return this._outline.visible
  }
  get wireframe () {
    return this._material.wireframe
  }
  set wireframe (value) {
    this._material.wireframe = value
  }
  get moving () {
    return this._tweenQueue.length > 0
  }
  get model () {
    return this._model
  }
  get sprite () {
    return this._sprite
  }
  get width () {
    return this._plane.geometry.parameters.width
  }
  get height () {
    return this._plane.geometry.parameters.height
  }
}
TileView.GEOMETRY = new PlaneGeometry(48, 48)
TileView.MATERIALS = []
TileView.IMAGES = {
  tile_blue: require('assets/textures/tile_blue.png'),
  tile_green: require('assets/textures/tile_green.png'),
  tile_red: require('assets/textures/tile_red.png'),
  tile_yellow: require('assets/textures/tile_yellow.png')
}
