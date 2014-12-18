package
{
	import engine.core.Game;
	
	/**
	 * GDTGame.as
	 * @author Joshua Barnett
	 */
	
	public class GDTGame extends Game
	{
		
		public function GDTGame()
		{
			super(GDTAssets);
		}
		
		override protected function init():void
		{
            super.init();
			scene = new GDTScene(this);
		}
	
	}

}