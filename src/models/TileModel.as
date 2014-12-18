package models
{
    import engine.mvc.Model;

    import org.osflash.signals.Signal;

    /**
     * TileModel.as
     * @author Joshua Barnett
     */
    public class TileModel extends Model
    {
        protected var _value:uint;
        protected var _cell:CellModel;
        protected var _highlight:Boolean;

        protected var _moved:Signal;
        protected var _removed:Signal;
        protected var _swapped:Signal;

        protected var _swapTile:TileModel;
        protected var _swapMovements:uint;

        public function TileModel(value:uint, cell:CellModel)
        {
            super();

            _value = value;
            _cell = cell;
            _highlight = false;

            _moved = new Signal();
            _removed = new Signal();
            _swapped = new Signal();
        }

        public function swap(tile:TileModel, onSwapped:Function = null):void
        {
            if (onSwapped != null)
            {
                _swapped.addOnce(onSwapped);
            }

            _swapTile = tile;

            var cell:CellModel = _cell;

            move(_swapTile.cell, onSwapMovement);
            _swapTile.move(cell, onSwapMovement);
        }

        protected function onSwapMovement():void
        {
            _swapMovements++;
            if (_swapMovements == 2)
            {
                _swapMovements = 0;
                _swapped.dispatch(this, _swapTile);
            }
        }

        public function move(cell:CellModel, onMovedCallback:Function):void
        {
            var time:Number = Math.sqrt((2 * _cell.distance(cell)) / 64)
            _cell = cell;
            _moved.dispatch(_cell, time, onMovedCallback);
        }

        public function get value():uint
        {
            return _value;
        }

        public function get cell():CellModel
        {
            return _cell;
        }

        public function get removed():Signal
        {
            return _removed;
        }

        public function get moved():Signal
        {
            return _moved;
        }

        public function get highlight():Boolean
        {
            return _highlight;
        }

        public function set highlight(value:Boolean):void
        {
            _highlight = value;
            _updated.dispatch();
        }
    }
}