package controllers
{
    import engine.mvc.Controller;

    import flash.geom.Point;

    import models.CellModel;
    import models.GridModel;
    import models.TileModel;

    import starling.events.Touch;
    import starling.events.TouchEvent;
    import starling.events.TouchPhase;

    import views.GridView;

    /**
     * GridController.as
     * @author Joshua Barnett
     */

    public class GridController extends Controller
    {
        protected var _finished:Boolean;
        protected var _input:Boolean;
        protected var _lastCell:CellModel;
        protected var _currentCell:CellModel;
        protected var _selectedTile:TileModel;

        public function get model():GridModel
        {
            return _model as GridModel;
        }

        public function get view():GridView
        {
            return _view as GridView;
        }

        public function GridController(model:GridModel, view:GridView)
        {
            super(model, view);

            view.addEventListener(TouchEvent.TOUCH, onTouch);
        }

        public function start():void
        {
            model.randomize();
            _input = true;
            _finished = false;
        }

        public function finish():void
        {
            _input = false;
            _finished = true;
        }

        protected function onSwapFinished():void
        {
            _input = true;
            _currentCell = null;
        }

        protected function selectCell(cell:CellModel):void
        {
            if (model.simulating)
            {
                return;
            }
            _lastCell = _currentCell;
            _currentCell = cell;
            if (_currentCell && _lastCell)
            {
                if (_currentCell.distance(_lastCell) == 1)
                {
                    _input = false;
                    if (model.swapCells(_currentCell, _lastCell))
                    {
                        model.swapped.addOnce(onSwapFinished);
                    }
                    else
                    {
                        onSwapFinished();
                    }
                    highlightCell(null);
                }
                else
                {
                    _lastCell = null;
                    highlightCell(_currentCell);
                }
            }
            else
            {
                highlightCell(_currentCell);
            }
        }

        protected function highlightCell(cell:CellModel):void
        {
            if (_selectedTile)
            {
                _selectedTile.highlight = false;
            }
            if (cell)
            {
                _selectedTile = model.getTileModel(cell);
                if (_selectedTile)
                {
                    _selectedTile.highlight = true;
                }
            }
        }

        private function onTouch(e:TouchEvent):void
        {
            var touch:Touch = e.getTouch(_view);
            if (!touch || !_input || _finished)
            {
                return;
            }

            var location:Point = touch.getLocation(view);
            var cell:CellModel = view.getTileCell(location);

            switch (touch.phase)
            {
                case TouchPhase.BEGAN:
                    selectCell(cell);
                    break;
                case TouchPhase.MOVED:
                    if (_currentCell && cell)
                    {
                        selectCell(cell);
                    }
                    break;
                case TouchPhase.ENDED:
                    break;
            }
        }
    }
}