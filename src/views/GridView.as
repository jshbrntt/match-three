package views
{
    import engine.mvc.View;

    import feathers.display.Scale9Image;
    import feathers.textures.Scale9Textures;

    import flash.geom.Point;
    import flash.geom.Rectangle;

    import models.CellModel;
    import models.GridModel;
    import models.TileModel;

    import starling.core.Starling;
    import starling.display.Sprite;
    import starling.events.Event;
    import starling.extensions.PDParticleSystem;
    import starling.filters.ColorMatrixFilter;
    import starling.textures.Texture;

    /**
     * File: MapView.as
     * Created: 09/04/2014 17:12
     * @author Joshua Barnett
     */
    public class GridView extends View
    {
        private var _highlightFilter:ColorMatrixFilter;
        private var _textures:Vector.<Texture>;
        private var _textureSize:uint;
        private var _tileViews:Vector.<TileView>;
        private var _borderImage:Scale9Image;
        private var _tilesView:Sprite;
        private var _particleSystems:Vector.<PDParticleSystem>;
        private var _particleConfig:XML;

        public function GridView(model:GridModel)
        {
            super(model);

            model.tileMoved.add(onMoved);
            model.tileAdded.add(onAdded);
            model.tileRemoved.add(onRemoved);

            model.randomized.add(onRandomized);

            _particleSystems = new Vector.<PDParticleSystem>();
            _particleConfig = game.assets.getXml(GDTAssets.PARTICLE_GEM_REMOVED);

            _textures = GDTGame(Starling.current.root).assets.getTextureAtlas(GDTAssets.TEXTURE_ATLAS_SHEET).getTextures("tile_");
            _textureSize = _textures[0].width;

            _highlightFilter = new ColorMatrixFilter();
            _highlightFilter.adjustSaturation(1);
            _highlightFilter.adjustContrast(0.1);
            _highlightFilter.adjustBrightness(0.1);

            createBorder();
        }

        private function onRemoved(tileModel:TileModel):void
        {
            var particleTexture:Texture = _textures[tileModel.value];
            var particleSystem:PDParticleSystem = new PDParticleSystem(_particleConfig, particleTexture);

            particleSystem.emitterX = tileModel.cell.x * particleSystem.texture.width + (particleSystem.texture.width / 2);
            particleSystem.emitterY = tileModel.cell.y * particleSystem.texture.height + (particleSystem.texture.height / 2);

            particleSystem.addEventListener(Event.COMPLETE, onParticleSystemComplete);

            addChild(particleSystem);
            Starling.juggler.add(particleSystem);

            particleSystem.start(1);
        }

        private function onParticleSystemComplete(event:Event):void
        {
            var particleSystem:PDParticleSystem = event.target as PDParticleSystem;

            if (particleSystem)
            {
                particleSystem.dispose();
            }

        }

        private function onRandomized():void
        {
            createTileViews();
        }

        protected function createTileViews():void
        {
            if (!_tilesView)
            {
                _tilesView = new Sprite();
                _tilesView.clipRect = new Rectangle(0, _textureSize, model.width * _textureSize, (model.height - 1) * _textureSize);
                addChild(_tilesView);
            }
            _tilesView.removeChildren();
            _tileViews = new Vector.<TileView>();
            for (var i:int = 0; i < model.size; ++i)
            {
                var tileCell:CellModel = model.convert1D2D(i);
                var tileModel:TileModel = model.getTileModel(tileCell);
                if (!tileModel)
                {
                    _tileViews.push(null);
                    continue;
                }

                var tileView:TileView = new TileView(tileModel, _textures, _highlightFilter);
                tileView.x = tileCell.x * tileView.width;
                tileView.y = tileCell.y * tileView.height;
                _tilesView.addChild(tileView);
                _tileViews.push(tileView);
            }
        }

        private function createBorder():void
        {
            var texture:Texture = GDTGame(Starling.current.root).assets.getTextureAtlas(GDTAssets.TEXTURE_ATLAS_SHEET).getTexture(GDTAssets.TEXTURE_BORDER);
            var rect:Rectangle = new Rectangle(15, 17, 38, 34);
            var textures:Scale9Textures = new Scale9Textures(texture, rect);
            _borderImage = new Scale9Image(textures);
            _borderImage.x = -rect.x;
            _borderImage.y = _textureSize - rect.y;
            _borderImage.width = _textureSize * model.width + rect.x * 2;
            _borderImage.height = _textureSize * (model.height - 1) + rect.y;
            addChild(_borderImage);
        }

        protected function onAdded(tileModel:TileModel):void
        {
            var tileView:TileView = new TileView(tileModel, _textures, _highlightFilter);
            tileView.x = tileModel.cell.x * tileView.width;
            tileView.y = tileModel.cell.y * tileView.height;
            _tilesView.addChild(tileView);
            setTileView(tileModel.cell, tileView);
        }

        protected function onMoved(cell1:CellModel, cell2:CellModel):void
        {
            setTileView(cell2, getTileView(cell1));
            setTileView(cell1, null);
        }

        public function getTileView(cellModel:CellModel):TileView
        {
            var i:int = model.convert2D1D(cellModel);
            if (i < 0)
                return null;
            return _tileViews[i];
        }

        public function setTileView(p:CellModel, v:TileView):Boolean
        {
            var i:int = model.convert2D1D(p);
            if (i < 0)
                return false;
            _tileViews[i] = v;
            return true;
        }

        public function getTileCell(point:Point):CellModel
        {
            var cell:CellModel = new CellModel(Math.floor(point.x / _textureSize), Math.floor(point.y / _textureSize));
            return cell;
        }

        public function get model():GridModel
        {
            return _model as GridModel;
        }

        public function get textureSize():uint
        {
            return _textureSize;
        }

        private function get game():GDTGame
        {
            return Starling.current.root as GDTGame;
        }
    }

}