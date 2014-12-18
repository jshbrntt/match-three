package views
{
	import engine.core.Engine;
	import engine.mvc.View;
	import models.CellModel;
	import models.TileModel;
	import starling.animation.Transitions;
	import starling.animation.Tween;
	import starling.core.Starling;
	import starling.display.Image;
	import starling.filters.FragmentFilter;
	import starling.textures.Texture;
	
	/**
	 * File: GemView.as
	 * @author Joshua Barnett
	 */
	public class TileView extends View
	{
		protected var _image			:Image;
		protected var _filter			:FragmentFilter;
		
		protected var _tweenQueue		:Vector.<Tween>;
		protected var _callbackQueue	:Vector.<Function>;
		
		public function TileView(model:TileModel, textures:Vector.<Texture>, filter:FragmentFilter)
		{
			super(model);
			
			if (!textures || !textures.length)
				throw new Error("Empty or null textures vector.");
			if (model.value > textures.length - 1)
				throw new Error("No texture exists for this tile's value");
				
			_image			= new Image(textures[model.value]);
			_filter			= filter;
			
			_tweenQueue		= new Vector.<Tween>();
			_callbackQueue	= new Vector.<Function>();
			
			model.moved.add(onMoved);
			model.removed.add(onRemoved);
			
			addChild(_image);
			
			this.x = model.cell.x * _image.texture.width;
			this.y = model.cell.y * _image.texture.height;
		}
		
		protected function onMoved(cell:CellModel, time:Number, onFinished:Function):void
		{
			var tween:Tween = new Tween(this, time, Transitions.EASE_IN);
			tween.onComplete = onTweened;
			tween.moveTo(cell.x * _image.texture.width, cell.y * _image.texture.height);
			
			if (_tweenQueue.length > 0)
			{
				_tweenQueue[_tweenQueue.length - 1].nextTween = tween;
			}
			else
			{
				Engine.starling.juggler.add(tween);
			}
			
			_tweenQueue.push(tween);
			_callbackQueue.push(onFinished);
		}
		
		protected function onRemoved():void
		{
			removeChild(_image);
			_image.dispose();
			this.dispose();
		}
		
		protected function onTweened():void
		{
			_tweenQueue.splice(0, 1);
			var onFinished:Function = _callbackQueue[0];
			if (onFinished != null)
				onFinished.call();
			_callbackQueue.splice(0, 1);
		}
		
		override protected function onUpdated():void 
		{
			super.onUpdated();
			_image.filter = model.highlight ? _filter : null;
		}
		
		public function get moving():Boolean 
		{
			return _tweenQueue.length > 0;
		}
		
		public function get model():TileModel
		{
			return _model as TileModel;
		}
		
	}
	
}