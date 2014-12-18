package models
{
    import engine.mvc.Model;

    /**
     * ScoreModel.as
     * @author Joshua Barnett
     */
    public class ScoreModel extends Model
    {
        protected var _score:uint;

        public function ScoreModel()
        {
            super();
            _score = 0;
        }

        public function reset():void
        {
            _score = 0;
            _updated.dispatch();
        }

        public function addMatches(matches:int):void
        {
            _score += fibonacci(matches) * 10;
            _updated.dispatch();
        }

        protected function fibonacci(n:uint):uint
        {
            return (n < 2) ? n : fibonacci(n - 2) + fibonacci(n - 1);
        }

        public function get score():uint
        {
            return _score;
        }

    }

}