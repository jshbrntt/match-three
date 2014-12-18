package models
{
	import engine.mvc.Model;
	
	/**
	 * CellModel.as
	 * @author Joshua Barnett
	 */
	public class CellModel extends Model
	{
		protected var _x:int;
		protected var _y:int;
		
		public function CellModel(x:int, y:int)
		{
			super();
			_x = x;
			_y = y;
			_updated.dispatch();
		}
		
		public function distance(cell:CellModel):Number
		{
			return (Math.sqrt(Math.pow(cell.x - this.x, 2) + Math.pow(cell.y - this.y, 2)));
		}
		
		public function equals(cell:CellModel):Boolean
		{
			return (this.x == cell.x && this.y == cell.y);
		}
		
		public function difference(cell:CellModel):CellModel
		{
			return (new CellModel(this.x - cell.x, this.y - cell.y));
		}
		
		public function get x():int
		{
			return _x;
		}
		
		public function set x(value:int):void
		{
			_x = value;
			_updated.dispatch();
		}
		
		public function get y():int
		{
			return _y;
		}
		
		public function set y(value:int):void
		{
			_y = value;
			updated.dispatch();
		}
	
	}

}