package views
{
    import engine.mvc.View;

    import models.ScoreModel;

    import starling.events.Event;
    import starling.text.TextField;
    import starling.utils.Color;
    import starling.utils.HAlign;

    /**
     * File: ScoreView.as
     * @author Joshua Barnett
     */
    public class ScoreView extends View
    {
        private var _label:TextField;
        private var _field:TextField;

        public function ScoreView(model:ScoreModel, width:int = 260, height:int = 60)
        {
            super(model);

            addEventListener(Event.ADDED_TO_STAGE, onAddedToStage);
        }

        private function onAddedToStage(event:Event):void
        {
            _label = new TextField(stage.stageWidth * (1/3), stage.stageHeight / 8, "SCORE", GDTAssets.FONT_MODE_NINE, 40, Color.BLACK);
            _label.hAlign = HAlign.CENTER;

            _field = new TextField(stage.stageWidth * (1/3), stage.stageHeight / 8, "0", GDTAssets.FONT_MODE_NINE, 56, Color.BLUE);
            _field.hAlign = HAlign.CENTER;
            _field.y = _label.height;

            addChild(_label);
            addChild(_field);
        }

        override protected function onUpdated():void
        {
            super.onUpdated();
            _field.text = model.score.toString();
        }

        public function get model():ScoreModel
        {
            return _model as ScoreModel;
        }

    }

}