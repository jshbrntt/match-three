import Scene from './../core/scene';
import Model from './../core/mvc/model';
import GridModel from './models/grid-model';
import TileModel from './models/tile-model';
import CellModel from './models/cell-model';
import TileView from './views/tile-view';
import GridView from './views/grid-view';
import GridController from './controllers/grid-controller';
import ServiceLocator from './../core/service-locator';

export default class M3Scene extends Scene {
  constructor(game) {
    super(game);
    this.setupModels();
  }
  setupModels() {
    // var geometry = new THREE.PlaneGeometry(10, 10);
    // var material = new THREE.MeshBasicMaterial({
    //   color: 0xffff00,
    //   side: THREE.DoubleSide
    // });
    // var plane = new THREE.Mesh(geometry, material);
    // plane.position.z = 0;
    // material.wireframe = true;
    //
    // var ambientLight = new THREE.AmbientLight(0x000000);
    // this.add(ambientLight);
    //
    // var lights = [];
    // lights[0] = new THREE.PointLight(0xffffff, 1, 0);
    // lights[1] = new THREE.PointLight(0xffffff, 1, 0);
    // lights[2] = new THREE.PointLight(0xffffff, 1, 0);
    //
    // lights[0].position.set(0, 200, 0);
    // lights[1].position.set(100, 200, 100);
    // lights[2].position.set(-100, -200, -100);
    //
    // this.add(lights[0]);
    // this.add(lights[1]);
    // this.add(lights[2]);

    // plane.position.x = window.innerWidth / 2;
    // plane.position.y = window.innerHeight / 2;
    // plane.position.z = 1;
    // this.add(plane);

    // let camera = ServiceLocator.get('M3Game').camera;
    // let domElement = ServiceLocator.get('M3Game').renderer.domElement;

    // this.add(new TileView(new TileModel(1, new CellModel(1, 1))));
    this._gridModel = new GridModel(20, 20, 1);
    this._gridView = new GridView(this._gridModel);
    this._gridController = new GridController(this._gridModel, this._gridView);
    this._gridModel.randomize();
    this._gridView.loadTextures().then(() => {
      this._gridView.createTileViews();
      this._game._engine.resize();
    });
    this.add(this._gridView);
    // console.log(this._gridModel.toString());
    // var material = new THREE.LineBasicMaterial({
    //   color: 0xff0000
    // });
    //
    // var geometry = new THREE.Geometry();
    // geometry.vertices.push(
    //   new THREE.Vector3(-domElement.width / 2, -domElement.height/2, 500),
    //   new THREE.Vector3(-domElement.width / 2, -domElement.height/2, 0)
    // );
    //
    // var line = new THREE.Line(geometry, material);
    // this.add(line);

    // var model = new Model();
    // var tileModel2 = new TileModel(2, new CellModel(2, 1));
    // var tileView2 = new TileView(tileModel2, this._textures);

    /**
     * Test Tile
     */
    // function loadTextures(onLoad) {
    //   var loader = new THREE.TextureLoader();
    //   var textures = [];
    //   var filenames = ['blue', 'green', 'purple', 'red', 'yellow'];
    //   for (var i = 0; i < filenames.length; i++) {
    //     var filename = 'assets/textures/tile_' + filenames[i] + '.png';
    //     console.log(filename);
    //     loader.load(filename, (texture) => {
    //       texture.magFilter = THREE.NearestFilter;
    //       texture.minFilter = THREE.NearestFilter;
    //       textures.push(texture);
    //       if(textures.length === filenames.length) {
    //         onLoad(textures);
    //       }
    //     });
    //   }
    // }
    // loadTextures((textures) => {
    //   var tileModel = new TileModel(0, new CellModel(1, 1));
    //   var tileView = new TileView(tileModel, textures);
    //   tileView.wireframe
    //   this.add(tileView);
    // });
    // this.resize();
  }
  update() {
    super.update();
  }
}
