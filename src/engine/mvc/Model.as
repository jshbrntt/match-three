package engine.mvc 
{
    import org.osflash.signals.Signal;

    /**
	 * Model.as
	 * @author Joshua Barnett
	 */
	public class Model 
	{
		protected var _updated:Signal;
		
		public function Model() 
		{
			_updated = new Signal();
		}
		
		public function get updated():Signal 
		{
			return _updated;
		}
		
	}

}