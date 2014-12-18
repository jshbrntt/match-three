package views
{
	import engine.mvc.View;
	import flash.geom.Matrix;
	import models.PolyModel;
	import nape.geom.GeomPoly;
	import nape.geom.GeomPolyList;
	import nape.geom.Mat23;
	import nape.geom.Vec2;
	import nape.geom.Vec2List;
	import nape.shape.Polygon;
	import nape.shape.ValidationResult;
	import starling.display.DisplayObject;
	import starling.display.Image;
	import starling.display.Shape;
	
	/**
	 * File: PolyView.as
	 * @author Joshua Barnett
	 */
	public class PolyView extends View
	{
		protected var _view		:DisplayObject;
		
		public function PolyView(model:PolyModel, view:DisplayObject)
		{
			super(model);
			
			model.aligned.add(onAligned);
			
			_view = view;
			
			this.pivotX	= _view.width / 2;
			this.pivotY	= _view.height / 2;
			
			addChild(_view);
			
			model.updated.dispatch();
		}
		
		override protected function onUpdated():void 
		{
			super.onUpdated();
			var polyModel:PolyModel	= _model as PolyModel;
			if (polyModel)
			{
				this.x			= polyModel.body.position.x;
				this.y			= polyModel.body.position.y;
				this.rotation	= polyModel.body.rotation;
			}
		}
		
		protected function onAligned(alignment:Vec2):void
		{
			this.pivotX	+= alignment.x;
			this.pivotY	+= alignment.y;
		}
		
		public function explode():Vector.<PolyView>
		{
			var polyModel:PolyModel	= _model as PolyModel;
			if (polyModel)
			{
				var pieces:Vector.<PolyView> = fracture(polyModel.body.position, 2);
				for each (var piece:PolyView in pieces)
				{
					piece.model.body.velocity.subeq(polyModel.body.position.sub(piece.model.body.position).mul(20));
					piece.model.body.velocity.addeq(new Vec2(0, -1000));
				}
				return pieces;
			}
			return null;
		}
		
		public function fracture(origin:Vec2, cuts:uint):Vector.<PolyView>
		{
			var polyModel:PolyModel		= _model as PolyModel;
			var rootImage:Image			= _view as Image;
			var pieceList:GeomPolyList	= new GeomPolyList();
			var cutList:GeomPolyList	= new GeomPolyList();
			var cutMatrix:Mat23			= Mat23.rotation(polyModel.body.rotation).concat(Mat23.translation(polyModel.body.position.x, polyModel.body.position.y));
			
			pieceList.push(new GeomPoly(polyModel.hull));
			
			for (var i:int = 0; i < cuts; i++)
			{
				var cutStart:Vec2		= new Vec2(origin.x, origin.y);
				var cutEnd:Vec2			= cutStart.copy().add(new Vec2((Math.random() * 2) - 1, (Math.random() * 2) - 1));
				
				cutStart	= cutMatrix.inverse().transform(cutStart);
				cutEnd		= cutMatrix.inverse().transform(cutEnd);
				
				pieceList.foreach(performCut);
				function performCut(pieceGeom:GeomPoly):void
				{
					cutList.merge(pieceGeom.cut(cutStart, cutEnd, false, false));
				}
				pieceList	= cutList.copy();
				cutList.clear();
			}
			
			var pieces:Vector.<PolyView>	= new Vector.<PolyView>();
			
			pieceList.foreach(constructPiece);
			function constructPiece(pieceGeom:GeomPoly):void
			{
				var piecePoly:Polygon	= new Polygon(pieceGeom);
				var pieceVerts:Vec2List	= piecePoly.localVerts;
				var vert:Vec2;
				
				if (piecePoly.validity() == ValidationResult.DEGENERATE)
				{
					return;
				}
				
				var pieceMatrix:Matrix  = new Matrix();
				pieceMatrix.translate(0.5, 0.5);
				pieceMatrix.scale(0.5, 0.5);
				
				if (rootImage)
				{
					var pieceView:Shape	= new Shape();
					pieceView.graphics.beginTextureFill(rootImage.texture, pieceMatrix);
					pieceView.graphics.moveTo(pieceVerts.at(0).x, pieceVerts.at(0).y);
					for (i = 1; i < pieceVerts.length + 1; ++i)
					{
						vert	= pieceVerts.at(i % pieceVerts.length);
						pieceView.graphics.lineTo(vert.x, vert.y);
					}
					pieceView.graphics.endFill();
				}
				
				var piece:PolyModel		= new PolyModel(polyModel.body.position, pieceVerts);
				piece.body.rotation		= polyModel.body.rotation;
				piece.body.velocity		= polyModel.body.velocity;
				piece.body.angularVel	= polyModel.body.angularVel;
				
				var view:PolyView = new PolyView(piece, pieceView);
				view.pivotX = view.pivotY = 0;
				pieces.push(view);
				piece.align();
			}
			
			return pieces;
		}
		
		public function get model():PolyModel 
		{
			return _model as PolyModel;
		}
		
	}

}