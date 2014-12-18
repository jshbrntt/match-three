package
{
    import controllers.GridController;

    import engine.core.Scene;

    import flash.events.TimerEvent;
    import flash.media.Sound;

    import models.GridModel;
    import models.ScoreModel;
    import models.TimerModel;

    import starling.display.Image;
    import starling.display.Sprite;
    import starling.utils.HAlign;
    import starling.utils.VAlign;

    import treefortress.sound.SoundAS;

    import utils.Position;

    import views.GridView;
    import views.ScoreView;
    import views.TimerView;

    /**
     * GDTScene.as
     * @author Joshua Barnett
     */

    public class GDTScene extends Scene
    {
        // Models
        private var _gridModel:GridModel;
        private var _scoreModel:ScoreModel;
        private var _timerModel:TimerModel;

        // Views
        private var _gridView:GridView;
        private var _ui:Sprite;
        private var _scoreView:ScoreView;
        private var _timerView:TimerView;

        private var _backgroundImage:Image;

        // Controllers
        private var _gridController:GridController;

        // Basic Menu
        private var _menu:GDTMenu;

        public function GDTScene(game:GDTGame)
        {
            super(game);
        }

        override protected function init():void
        {
            super.init();

            setupSounds();
            setupModels();
            setupViews();
            setupControllers();
            setupListners();

            _menu.showReady();
        }

        private function setupListners():void
        {
            _gridModel.checked.add(_scoreModel.addMatches);

            _menu.go.add(startGame);
            _menu.replay.add(startGame);

            _timerModel.finished.add(finishGame);
        }

        private function setupControllers():void
        {
            _gridController = new GridController(_gridModel, _gridView);
        }

        private function setupSounds():void
        {
            SoundAS.addSound(GDTAssets.SOUND_GLASS_1, Sound(new GDTAssets.glass1()));
            SoundAS.addSound(GDTAssets.SOUND_GLASS_2, Sound(new GDTAssets.glass2()));
            SoundAS.addSound(GDTAssets.SOUND_GLASS_3, Sound(new GDTAssets.glass3()));
            SoundAS.addSound(GDTAssets.SOUND_GLASS_4, Sound(new GDTAssets.glass4()));
            SoundAS.addSound(GDTAssets.SOUND_GLASS_5, Sound(new GDTAssets.glass5()));
            SoundAS.addSound(GDTAssets.SOUND_SMASH_1, Sound(new GDTAssets.smash1()));
            SoundAS.addSound(GDTAssets.SOUND_SMASH_2, Sound(new GDTAssets.smash2()));
            SoundAS.addSound(GDTAssets.SOUND_SMASH_3, Sound(new GDTAssets.smash3()));
            SoundAS.addSound(GDTAssets.SOUND_SMASH_4, Sound(new GDTAssets.smash4()));
            SoundAS.addSound(GDTAssets.SOUND_UNDO, Sound(new GDTAssets.swap()));
            SoundAS.addSound(GDTAssets.SOUND_SWAP, Sound(new GDTAssets.undo()));
        }

        private function setupModels():void
        {
            _gridModel = new GridModel(8, 9);
            _scoreModel = new ScoreModel();
            _timerModel = new TimerModel();
        }

        private function setupViews():void
        {
            _backgroundImage = new Image(game.assets.getTextureAtlas(GDTAssets.TEXTURE_ATLAS_SHEET).getTexture("background"));
            _gridView = new GridView(_gridModel);
            _scoreView = new ScoreView(_scoreModel);
            _timerView = new TimerView(_timerModel);
            _ui = new Sprite();
            _menu = new GDTMenu();

            _ui.addChild(_scoreView);
            _ui.addChild(_timerView);
            _gridView.x = 340;

            _gridView.visible = false;
            _scoreView.visible = false;
            _timerView.visible = false;

            addChild(_backgroundImage);
            addChild(_gridView);
            addChild(_ui);
            addChild(_menu);

            Position.stack(_timerView, VAlign.BOTTOM, _scoreView);
            Position.hALign(_ui, HAlign.LEFT, stage);
            Position.vAlign(_ui, VAlign.CENTER, stage);

        }

        private function startGame():void
        {
            _scoreView.visible = true;
            _timerView.visible = true;
            _gridView.visible = true;
            _gridModel.randomize();
            _scoreModel.reset();
            _timerModel.start();
            _gridController.start();
        }


        private function finishGame(e:TimerEvent = null):void
        {
            _gridController.finish();
            if (_gridModel.simulating)
            {
                _gridModel.simulated.addOnce(showScore);
            }
            else
            {
                showScore();
            }
        }

        private function showScore():void
        {
            _scoreView.visible = false;
            _timerView.visible = false;
            _gridView.visible = false;
            _menu.showScore(_scoreModel.score);
        }
    }

}