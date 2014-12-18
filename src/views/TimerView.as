package views
{
    import engine.mvc.View;

    import models.TimerModel;

    import starling.events.Event;
    import starling.text.TextField;
    import starling.utils.Color;
    import starling.utils.HAlign;

    /**
	 * File: TimerView.as
	 * @author Joshua Barnett
	 */
	public class TimerView extends View
	{
        private var _label:TextField;
		private var _field:TextField;
		
		public function TimerView(model:TimerModel)
		{
			super(model);

            addEventListener(Event.ADDED_TO_STAGE, onAddedToStage);
		}

        private function onAddedToStage(e:Event):void
        {
            _label = new TextField(stage.stageWidth * (1/3), stage.stageHeight / 8, "TIME LEFT", GDTAssets.FONT_MODE_NINE, 40, Color.BLACK);
            _label.hAlign = HAlign.CENTER;

            _field = new TextField(stage.stageWidth * (1/3), stage.stageHeight / 8, model.timer.repeatCount.toString(), GDTAssets.FONT_MODE_NINE, 56, Color.RED);
            _field.hAlign = HAlign.CENTER;
            _field.y = _label.height;

            addChild(_label);
            addChild(_field);
        }
		
		override protected function onUpdated():void 
		{
			super.onUpdated();
			_field.text = (model.timer.repeatCount - model.timer.currentCount).toString();
		}
		
		public function get model():TimerModel 
		{
			return _model as TimerModel;
		}
	
	}

}