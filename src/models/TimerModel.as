package models
{
    import engine.mvc.Model;

    import flash.events.TimerEvent;
    import flash.utils.Timer;

    import org.osflash.signals.Signal;

    /**
     * TimerModel.as
     * @author Joshua Barnett
     */
    public class TimerModel extends Model
    {
        protected var _timer:Timer;
        protected var _ticked:Signal;
        protected var _finished:Signal;

        public function TimerModel()
        {
            _timer = new Timer(1000, 60);
            _ticked = new Signal();
            _finished = new Signal();
        }

        public function start():void
        {
            if (!_timer.running)
            {
                _timer.addEventListener(TimerEvent.TIMER, onTimer);
                _timer.addEventListener(TimerEvent.TIMER_COMPLETE, onTimerComplete);
                _timer.reset();
                _timer.start();
            }
            _updated.dispatch();
        }

        protected function onTimer(e:TimerEvent):void
        {
            _updated.dispatch();
        }

        protected function onTimerComplete(e:TimerEvent):void
        {
            _timer.removeEventListener(TimerEvent.TIMER, onTimer);
            _timer.removeEventListener(TimerEvent.TIMER_COMPLETE, onTimerComplete);
            _finished.dispatch();
        }

        public function get timer():Timer
        {
            return _timer;
        }

        public function get ticked():Signal
        {
            return _ticked;
        }

        public function get finished():Signal
        {
            return _finished;
        }
    }
}