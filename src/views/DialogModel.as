package views 
{
	import engine.mvc.Model;
	
	/**
	 * File: DialogModel.as
	 * Created: 14/04/2014 00:35
	 * @author Joshua Barnett
	 */
	public class DialogModel extends Model 
	{
		protected var _title	:String;
		protected var _button	:String;
		
		public function get title()		:String	{	return _title;	}
		public function get button()	:String	{	return _button;	}
		
		public function DialogModel(title:String, button:String) 
		{
			super();
			_title = title;
			_button = button;
		}
		
	}

}