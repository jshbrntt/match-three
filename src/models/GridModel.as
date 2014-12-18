package models
{
    import engine.mvc.Model;

    import org.osflash.signals.Signal;

    import treefortress.sound.SoundAS;

    /**
     * GridModel.as
     * @author Joshua Barnett
     */

    public class GridModel extends Model
    {

        protected var _width:uint;
        protected var _height:uint;
        protected var _vector:Vector.<TileModel>;

        protected var _simulating:Boolean;
        protected var _tilesFalling:uint;

        protected var _swappedCell1:CellModel;
        protected var _swappedCell2:CellModel;

        protected var _tileMoved:Signal;
        protected var _tileAdded:Signal;
        protected var _tileRemoved:Signal;

        protected var _randomized:Signal;
        protected var _checked:Signal;
        protected var _swapped:Signal;
        protected var _simulated:Signal;

        public function GridModel(width:uint, height:uint)
        {
            super();

            _width = width;
            _height = height;
            _vector = new Vector.<TileModel>(_width * _height);

            _simulating = false;
            _tilesFalling = 0;

            _swappedCell1 = null;
            _swappedCell2 = null;

            _tileMoved = new Signal();
            _tileAdded = new Signal();
            _tileRemoved = new Signal();

            _randomized = new Signal();
            _checked = new Signal();
            _swapped = new Signal();
            _simulated = new Signal();
        }

        public function beginSimulation():void
        {
            trace("simulate");

            if (_simulating)
            {
                return;
            }
            _simulating = true;
            check();
        }

        protected function check():void
        {
            trace("check");

            var matches:Vector.<CellModel> = getMatches();
            _checked.dispatch(matches.length);
            if (matches.length > 0)
            {
                remove(matches);
            } else
            {
                if (!fill())
                {
                    endSimulation();
                }
            }
        }

        protected function remove(matches:Vector.<CellModel>):void
        {
            trace("remove");

            for each (var match:CellModel in matches)
            {
                removeTile(match);
            }
            gravity();

            SoundAS.play(GDTAssets.SOUND_SMASH + randomTileValue(1, 4), 0.5);
        }

        public function gravity():void
        {
            trace("gravity");

            var movedTile:Boolean = false;
            for (var i:int = _vector.length - _width; i < _vector.length; i++)
            {
                var drop:int = 0;
                var cell:CellModel = convert1D2D(i);

                while (cell.y >= 0)
                {
                    if (!getTileModel(cell))
                    {
                        drop++;
                    }
                    else if (drop)
                    {
                        _tilesFalling++;
                        moveTile(cell, new CellModel(cell.x, cell.y + drop), onTileFallen);
                        movedTile = true;
                    }
                    cell.y--;
                }
            }
            if (!movedTile)
            {
                if (!fill())
                {
                    check();
                }
            }
        }

        protected function onTileFallen():void
        {
            _tilesFalling--;
            if (_tilesFalling == 0)
            {
                if (!fill())
                {
                    check();
                }
            }

            SoundAS.play(GDTAssets.SOUND_GLASS + randomTileValue(1, 5), 0.54);
        }

        protected function fill():Boolean
        {
            trace("fill");

            var filled:Boolean = false;
            for (var i:int = _width; i <= (_width * 2); i++)
            {
                var cell:CellModel = convert1D2D(i);
                if (!getTileModel(cell))
                {
                    addTile(createRandomTileModel(new CellModel(cell.x, cell.y - 1)));
                    filled = true;
                }
            }
            if (filled)
            {
                gravity();
            }
            return filled;
        }

        public function endSimulation():void
        {
            trace("simulated");
            _simulated.dispatch();
            _simulating = false;
        }

        public function swapCells(cell1:CellModel, cell2:CellModel):Boolean
        {

            var tile1:TileModel = getTileModel(cell1);
            var tile2:TileModel = getTileModel(cell2);

            if (!tile1 || !tile2 || _simulating)
            {
                return false;
            }

            // After first swap remove matches.
            _swappedCell1 = tile1.cell;
            _swappedCell2 = tile2.cell;
            swapTiles(tile1, tile2);
            return true;
        }

        protected function swapTiles(tile1:TileModel, tile2:TileModel):void
        {
            tile1.swap(tile2, onSwapped);
            setTileModel(tile1.cell, tile1);
            setTileModel(tile2.cell, tile2);
        }

        protected function onSwapped(tile1:TileModel, tile2:TileModel):void
        {
            if (!tile1.cell.equals(_swappedCell1) && !tile2.cell.equals(_swappedCell2))
            {
                SoundAS.play(GDTAssets.SOUND_SWAP, 0.5);
                _checked.addOnce(
                        function (matches:int):void
                        {
                            if (!matches)
                            {
                                swapTiles(tile1, tile2);
                            } else
                            {
                                _swapped.dispatch();
                            }
                        }
                );
                beginSimulation();
            } else
            {
                _swapped.dispatch();
                SoundAS.play(GDTAssets.SOUND_UNDO, 1.0);
            }
        }

        public function moveTile(fromCell:CellModel, toCell:CellModel, onMoved:Function = null):void
        {
            var movingTile:TileModel = getTileModel(fromCell);
            if (movingTile)
            {
                removeTile(toCell);
                setTileModel(toCell, movingTile);
                movingTile.move(toCell, onMoved);
                setTileModel(fromCell, null);
                _tileMoved.dispatch(fromCell, toCell);
            }
        }

        public function addTile(tileModel:TileModel):void
        {
            if (tileModel)
            {
                setTileModel(tileModel.cell, tileModel);
                _tileAdded.dispatch(tileModel);
            }
        }

        public function removeTile(fromCell:CellModel):void
        {
            var removedModel:TileModel = getTileModel(fromCell);
            if (removedModel)
            {
                removedModel.removed.dispatch();
                setTileModel(fromCell, null);
                _tileRemoved.dispatch(removedModel);
            }
        }

        public function setTileModel(p:CellModel, v:TileModel):Boolean
        {
            var i:int = convert2D1D(p);
            if (i < 0)
            {
                return false;
            }
            _vector[i] = v;
            return true;
        }

        public function getTileModel(p:CellModel):TileModel
        {
            var i:int = convert2D1D(p);
            if (i < 0)
            {
                return null;
            }
            return _vector[i];
        }

        public function randomize():void
        {
            for (var i:int = _width; i < _vector.length; ++i)
            {
                do
                {
                    var currentCell:CellModel = convert1D2D(i);
                    _vector[i] = createRandomTileModel(currentCell);
                } while (matchedHeight(currentCell).length > 2 || matchedWidth(currentCell).length > 2);
            }
            _randomized.dispatch();
        }

        protected function createRandomTileModel(cell:CellModel):TileModel
        {
            return (new TileModel(randomTileValue(0, 4), cell));
        }

        protected function randomTileValue(min:int, max:int):uint
        {
            return (Math.floor(Math.random() * (1 + max - min)) + min);
        }

        public function convert1D2D(i:int):CellModel
        {
            if (i < 0 || i > (_vector.length - 1))
            {
                return null;
            }
            return (new CellModel(i % _width, Math.floor(i / _width)));
        }

        public function convert2D1D(tile:CellModel):int
        {
            if (!tile || tile.x < 0 || tile.x > (_width - 1) || tile.y < 0 || tile.y > (_height - 1))
            {
                return -1;
            }
            return (tile.x + tile.y * _width);
        }

        protected function unique(cells:Vector.<CellModel>):Vector.<CellModel>
        {
            var unique:Vector.<CellModel> = cells.concat();
            for (var i:int = 0; i < unique.length; ++i)
            {
                for (var j:int = i + 1; j < unique.length; ++j)
                {
                    if (unique[i].equals(unique[j]))
                        unique.splice(j--, 1);
                }
            }
            return unique;
        }

        protected function getMatches():Vector.<CellModel>
        {
            var matches:Vector.<CellModel> = new Vector.<CellModel>();
            for (var i:int = 0; i < _vector.length; ++i)
            {
                var p:CellModel = convert1D2D(i);
                var horizontalMatch:Vector.<CellModel> = matchedWidth(p);
                if (horizontalMatch.length > 2)
                {
                    matches = matches.concat(horizontalMatch);
                }
                var verticalMatch:Vector.<CellModel> = matchedHeight(p);
                if (verticalMatch.length > 2)
                {
                    matches = matches.concat(verticalMatch);
                }
            }
            return unique(matches);
        }

        protected function matchedHeight(p:CellModel):Vector.<CellModel>
        {
            var matches:Vector.<CellModel> = new Vector.<CellModel>();
            var tileModel:TileModel = getTileModel(p);
            if (!tileModel)
            {
                return matches;
            }
            matches.push(p);
            var cursor:CellModel = new CellModel(p.x, p.y - 1);
            while (valueMatches(tileModel, cursor))
            {
                matches.push(new CellModel(cursor.x, cursor.y));
                cursor.y--;
            }
            cursor.y = p.y + 1;
            while (valueMatches(tileModel, cursor))
            {
                matches.push(new CellModel(cursor.x, cursor.y));
                cursor.y++;
            }
            return matches;
        }

        protected function matchedWidth(p:CellModel):Vector.<CellModel>
        {
            var matches:Vector.<CellModel> = new Vector.<CellModel>();
            var tileModel:TileModel = getTileModel(p);
            if (!tileModel)
            {
                return matches;
            }
            matches.push(p);
            var cursor:CellModel = new CellModel(p.x - 1, p.y);
            while (valueMatches(tileModel, cursor))
            {
                matches.push(new CellModel(cursor.x, cursor.y));
                cursor.x--;
            }
            cursor.x = p.x + 1;
            while (valueMatches(tileModel, cursor))
            {
                matches.push(new CellModel(cursor.x, cursor.y));
                cursor.x++;
            }
            return matches;
        }

        protected function valueMatches(tileModel:TileModel, p:CellModel):Boolean
        {
            if (!tileModel || !getTileModel(p))
            {
                return false;
            }
            return tileModel.value == getTileModel(p).value;
        }

        public function toString():String
        {
            var string:String = "";
            for (var i:int = 0; i < _vector.length; ++i)
            {
                var tileModel:TileModel = getTileModel(convert1D2D(i))
                string += !tileModel ? "X" : tileModel.value.toString();
                if ((i + 1) % _width == 0)
                {
                    string += "\n";
                }
            }
            return string;
        }

        public function get width():uint
        {
            return _width;
        }

        public function get height():uint
        {
            return _height;
        }

        public function get tileMoved():Signal
        {
            return _tileMoved;
        }

        public function get tileAdded():Signal
        {
            return _tileAdded;
        }

        public function get simulated():Signal
        {
            return _simulated;
        }

        public function get swapped():Signal
        {
            return _swapped;
        }

        public function get simulating():Boolean
        {
            return _simulating;
        }

        public function get checked():Signal
        {
            return _checked;
        }

        public function get tileRemoved():Signal
        {
            return _tileRemoved;
        }

        public function get randomized():Signal
        {
            return _randomized;
        }

        public function get size():uint
        {
            return _vector.length;
        }
    }
}