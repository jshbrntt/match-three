package
{
    import feathers.display.Scale9Image;
    import feathers.textures.Scale9Textures;

    import flash.geom.Rectangle;

    import org.osflash.signals.Signal;

    import starling.core.Starling;
    import starling.display.Button;
    import starling.display.Sprite;
    import starling.events.Event;
    import starling.text.TextField;
    import starling.textures.Texture;
    import starling.utils.Color;
    import starling.utils.HAlign;
    import starling.utils.VAlign;

    import utils.Position;

    /**
     * GDTMenu.as
     * @author Joshua Barnett
     */
    public class GDTMenu extends Sprite
    {
        private static const TEXT_READY:String = "READY?";
        private static const TEXT_GO:String = "GO!";
        private static const TEXT_SCORE:String = "SCORE";
        private static const TEXT_REPLAY:String = "REPLAY";

        private var _scoreLabel:TextField;
        private var _scoreField:TextField;
        private var _replayButton:Button;

        private var _readyLabel:TextField;
        private var _readyButton:Button;

        private var _readyElements:Sprite;
        private var _replayElements:Sprite;
        private var _panelImage:Scale9Image;

        private var _go:Signal;
        private var _replay:Signal;

        public function GDTMenu()
        {
            _replay = new Signal();
            _go = new Signal();

            addEventListener(Event.ADDED_TO_STAGE, onAddedToStage);
        }

        private function onAddedToStage(event:Event):void
        {
            createElements();
            hide();
        }

        private function createElements():void
        {
            // Panel
            var texture:Texture = GDTGame(Starling.current.root).assets.getTextureAtlas(GDTAssets.TEXTURE_ATLAS_SHEET).getTexture(GDTAssets.TEXTURE_PANEL);
            var rect:Rectangle = new Rectangle(66, 66, 132, 132);
            var textures:Scale9Textures = new Scale9Textures(texture, rect);
            _panelImage = new Scale9Image(textures);
            _panelImage.width = stage.stageWidth * .6;
            _panelImage.height = stage.stageHeight * .6;

            // Ready Elements
            _readyElements = new Sprite();

            _readyLabel = new TextField(_panelImage.width, _panelImage.height / 2, TEXT_READY);
            _readyLabel.fontName = GDTAssets.FONT_MODE_NINE;
            _readyLabel.fontSize = 80;
            _readyLabel.color = Color.WHITE;
            _readyLabel.hAlign = HAlign.CENTER;

            _readyButton = new Button(GDTGame(Starling.current.root).assets.getTextureAtlas(GDTAssets.TEXTURE_ATLAS_SHEET).getTexture(GDTAssets.TEXTURE_BTN_SMALL), TEXT_GO);
            _readyButton.fontSize = 60;
            _readyButton.fontName = GDTAssets.FONT_MODE_NINE;
            _readyButton.fontColor = Color.WHITE;

            _readyElements.addChild(_readyLabel);
            _readyElements.addChild(_readyButton);

            _readyButton.addEventListener(Event.TRIGGERED, onReadyButtonTriggered);

            // Score Elements
            _replayElements = new Sprite();

            _scoreLabel = new TextField(_panelImage.width, 80, "0", GDTAssets.FONT_MODE_NINE, 60, Color.BLACK);
            _scoreLabel.hAlign = HAlign.CENTER;
            _scoreLabel.text = TEXT_SCORE;

            _scoreField = new TextField(_panelImage.width, 80, "0", GDTAssets.FONT_MODE_NINE, 60, Color.BLUE);
            _scoreField.hAlign = HAlign.CENTER;

            _replayButton = new Button(GDTGame(Starling.current.root).assets.getTextureAtlas(GDTAssets.TEXTURE_ATLAS_SHEET).getTexture(GDTAssets.TEXTURE_BTN_LARGE), TEXT_REPLAY);
            _replayButton.fontName = GDTAssets.FONT_MODE_NINE;
            _replayButton.fontSize = 40;
            _replayButton.fontColor = Color.WHITE;

            _replayElements.addChild(_scoreLabel);
            _replayElements.addChild(_scoreField);
            _replayElements.addChild(_replayButton);

            _replayButton.addEventListener(Event.TRIGGERED, onReplayButtonTriggered);

            // Layering
            addChild(_panelImage);
            addChild(_readyElements);
            addChild(_replayElements);

            // Positioning
            Position.hALign(_panelImage, HAlign.CENTER, stage);
            Position.vAlign(_panelImage, VAlign.CENTER, stage);

            Position.stack(_readyButton, VAlign.BOTTOM, _readyLabel);
            Position.hALign(_readyButton, HAlign.CENTER, _readyLabel);

            Position.hALign(_readyElements, HAlign.CENTER, _panelImage);
            Position.vAlign(_readyElements, VAlign.CENTER, _panelImage);

            Position.stack(_scoreField, VAlign.BOTTOM, _scoreLabel);
            Position.stack(_replayButton, VAlign.BOTTOM, _scoreField);
            Position.hALign(_replayButton, HAlign.CENTER, _scoreField);

            Position.hALign(_replayElements, HAlign.CENTER, _panelImage);
            Position.vAlign(_replayElements, VAlign.CENTER, _panelImage);
        }

        private function onReadyButtonTriggered(e:Event):void
        {
            hide();
            _go.dispatch();
        }

        private function onReplayButtonTriggered(e:Event):void
        {
            hide();
            _replay.dispatch();
        }

        public function showScore(score:uint):void
        {
            visible = true;
            _replayElements.visible = true;
            _readyElements.visible = false;

            _scoreField.text = score.toString();
        }

        public function showReady():void
        {
            visible = true;
            _readyElements.visible = true;
            _replayElements.visible = false;
        }

        public function hide():void
        {
            visible = false;
            _readyElements.visible = false;
            _replayElements.visible = false;
        }

        public function get go():Signal
        {
            return _go;
        }

        public function get replay():Signal
        {
            return _replay;
        }

    }

}