import Model from './../../core/mvc/model';
import CellModel from './cell-model';
import TileModel from './tile-model';

export default class GridModel extends Model {
  constructor(width, height, seed) {
    super();

    this._width = width;
    this._height = height;
    this._seed = seed;
    this._vector = [];
    this._vector.length = this._width * this._height;

    this._simulating = false;
    this._tilesFalling = 0;

    this._swappedCell1 = null;
    this._swappedCell2 = null;

    this._onTileMoved = null;
    this._onTileAdded = null;
    this._onTileRemoved = null;

    this._onRandomized = null;
    this._onChecked = null;
    this._onSwapped = null;
    this._onSimulated = null;
  }

  beginSimulation() {
    console.log("simulate");
    if (this._simulating) {
      return;
    }
    this._simulating = true;
    this.this.check();
  }

  check() {
    console.log("check");
    var matches = this.getMatches();
    if (this._onChecked) {
      this._onChecked(matches);
    }
    if (matches.length > 0) {
      this.remove(matches);
    } else {
      if (!this.fill()) {
        this.endSimulation();
      }
    }
  }

  remove(matches) {
    console.log("remove");
    for (var i = 0; i < matches.length; i++) {
      var match = matches[i];
      this.removeTile(match);
    }
    this.gravity();
  }

  gravity() {
    console.log("gravity");
    var movedTile = false;
    for (var i = this._vector.length - this._width; i < this._vector.length; i++) {
      var drop = 0;
      var cell = this.transformIndexToCellModel(i);
      while (cell.y >= 0) {
        if (!this.getTileModel(cell)) {
          drop++;
        } else if (drop) {
          this._tilesFalling++;
          this.moveTile(cell, new CellModel(cell.x, cell.y + drop), this.onTileFallen);
          movedTile = true;
        }
        cell.y--;
      }
    }
    if (!movedTile) {
      if (!this.fill()) {
        this.check();
      }
    }
  }

  onTileFallen() {
    this._tilesFalling--;
    if (this._tilesFalling === 0) {
      if (!this.fill()) {
        this.check();
      }
    }
  }

  fill() {
    console.log("fill");
    var filled = false;
    for (var i = this._width; i <= (this._width * 2); i++) {
      var cell = this.transformIndexToCellModel(i);
      if (!this.getTileModel(cell)) {
        this.addTile(this.createRandomTileModel(new CellModel(cell.x, cell.y - 1)));
        filled = true;
      }
    }
    if (filled) {
      this.gravity();
    }
    return filled;
  }

  endSimulation() {
    console.log("simulated");
    this._onSimulated();
    this._simulating = false;
  }

  swapCells(cell1, cell2) {

    var tile1 = this.getTileModel(cell1);
    var tile2 = this.getTileModel(cell2);

    if (!tile1 || !tile2 || this._simulating) {
      return false;
    }

    // After first swap remove matches.
    this._swappedCell1 = tile1.cell;
    this._swappedCell2 = tile2.cell;
    this.swapTiles(tile1, tile2);
    return true;
  }

  swapTiles(tile1, tile2) {
    tile1.swap(tile2, this.onSwapped);
    this.setTileModel(tile1.cell, tile1);
    this.setTileModel(tile2.cell, tile2);
  }

  onSwapped(tile1, tile2) {
    if (!tile1.cell.equals(this._swappedCell1) && !tile2.cell.equals(this._swappedCell2)) {
      this._onChecked = (matches) => {
        if (!matches) {
          this.swapTiles(tile1, tile2);
        } else {
          _swapped.dispatch();
        }
        this._onChecked = null;
      };
      this.beginSimulation();
    } else {
      this._onSwapped();
    }
  }

  moveTile(fromCell, toCell, onMoved) {
    var movingTile = this.getTileModel(fromCell);
    if (movingTile) {
      this.removeTile(toCell);
      this.setTileModel(toCell, movingTile);
      movingTile.move(toCell, onMoved);
      this.setTileModel(fromCell, null);
      this.onTileMoved(fromCell, toCell);
    }
  }

  addTile(tileModel) {
    if (tileModel) {
      this.setTileModel(tileModel.cell, tileModel);
      this.onTileAdded(tileModel);
    }
  }

  removeTile(fromCell) {
    var removedModel = this.getTileModel(fromCell);
    if (removedModel) {
      removedModel.onRemoved();
      this.setTileModel(fromCell, null);
      this._onTileRemoved(removedModel);
    }
  }

  setTileModel(p, v) {
    var i = this.transformCellModelToIndex(p);
    if (!(i in this._vector)) {
      return false;
    }
    this._vector[i] = v;
    return true;
  }

  getTileModel(p) {
    var i = this.transformCellModelToIndex(p);
    if (!(i in this._vector)) {
      return null;
    }
    return this._vector[i];
  }

  randomize(seed) {
    for (var i = 0; i < this._vector.length - this._width; i++) {
      var currentCell;
      do {
        currentCell = this.transformIndexToCellModel(i);
        this._vector[i] = this.createRandomTileModel(currentCell);
      } while (this.getVerticalMatches(currentCell).length > 2 || this.getHorizontalMatches(currentCell).length > 2);
    }
    if (this._onRandomized) {
      this._onRandomized();
    }
  }

  random() {
    var max = 1;
    var min = 0;
    this._seed = (this._seed * 9301 + 49297) % 233280;
    var rnd = this._seed / 233280;
    return min + rnd * (max - min);
  }

  createRandomTileModel(cell) {
    return new TileModel(this.randomTileValue(0, 4), cell);
  }

  randomTileValue(min, max) {
    return Math.floor(this.random() * (1 + max - min)) + min;
  }

  transformIndexToCellModel(i) {
    if (i < 0 || i > (this._vector.length - 1)) {
      return null;
    }
    return new CellModel(i % this._width, Math.floor(i / this._width));
  }

  transformCellModelToIndex(tile) {
    if (!tile || tile.x < 0 || tile.x > (this._width - 1) || tile.y < 0 || tile.y > (this._height - 1)) {
      return -1;
    }
    return tile.x + tile.y * this._width;
  }

  unique(cells ) {
    var unique = cells.concat();
    for (var i = 0; i < unique.length; ++i) {
      for (var j = i + 1; j < unique.length; ++j) {
        if (unique[i].equals(unique[j])) {
          unique.splice(j--, 1);
        }
      }
    }
    return unique;
  }

  getMatches() {
    var matches = [];
    for (var i = 0; i < _vector.length; ++i) {
      var cursorCellModel = this.transformIndexToCellModel(i);
      var horizontalMatches = this.getHorizontalMatches(cursorCellModel);
      if (horizontalMatches.length > 2) {
        matches = matches.concat(horizontalMatches);
      }
      var verticalMatches = this.getVerticalMatches(cursorCellModel);
      if (verticalMatches.length > 2) {
        matches = matches.concat(verticalMatches);
      }
    }
    return unique(matches);
  }

  getVerticalMatches(originCellModel) {
    var matches = [];
    var originTileModel = this.getTileModel(originCellModel);
    if (!originTileModel) {
      return matches;
    }
    matches.push(originCellModel);
    var cursorCellModel = originCellModel.copy();
    cursorCellModel.y--;
    while(this.constructor.tilesMatch(originTileModel, this.getTileModel(cursorCellModel))) {
      matches.push(new CellModel(cursorCellModel.y, cursorCellModel.y));
      cursorCellModel.y--;
    }
    cursorCellModel.y = originCellModel.y + 1;
    while (this.constructor.tilesMatch(originTileModel, this.getTileModel(cursorCellModel))) {
      matches.push(new CellModel(cursorCellModel.y, cursorCellModel.y));
      cursorCellModel.y++;
    }
    return matches;
  }

  getHorizontalMatches(originCellModel) {
    var matches = [];
    var originTileModel = this.getTileModel(originCellModel);
    if (!originTileModel) {
      return matches;
    }
    matches.push(originCellModel);
    var cursorCellModel = originCellModel.copy();
    cursorCellModel.x--;
    while(this.constructor.tilesMatch(originTileModel, this.getTileModel(cursorCellModel))) {
      matches.push(new CellModel(cursorCellModel.x, cursorCellModel.y));
      cursorCellModel.x--;
    }
    cursorCellModel.x = originCellModel.x + 1;
    while (this.constructor.tilesMatch(originTileModel, this.getTileModel(cursorCellModel))) {
      matches.push(new CellModel(cursorCellModel.x, cursorCellModel.y));
      cursorCellModel.x++;
    }
    return matches;
  }

  static tilesMatch(tileModel1, tileModel2) {
    if (!tileModel1 || !tileModel2) {
      return false;
    }
    return tileModel1.value === tileModel2.value;
  }

  toString() {
    var string = "";
    for (var y = this._height - 1; y >= 0; y--) {
      for (var x = 0; x < this._width; x++) {
        var tileModel = this.getTileModel(new CellModel(x, y));
        string += tileModel ? tileModel.value : 'X';
        if (x === this._width - 1) {
          string += "\n";
        }
      }
    }
    return string;
  }

  set onRandomized(value) {
    this._onRandomized = value;
  }

  get onRandomized() {
    return this._onRandomized;
  }

  get size() {
    return this._vector.length;
  }
}
