package 
{
    import engine.core.Engine;

    import starling.core.Starling;
    import starling.utils.HAlign;
    import starling.utils.VAlign;

    /**
	 * GDTMain.as
	 * @author Joshua Barnett
	 */
	
	[SWF(width="800", height="480", backgroundColor="0xFFFFFF", frameRate="60")]
	public class GDTMain extends Engine
	{
		
		public function GDTMain()
		{
            Starling.handleLostContext = true;

			super(GDTGame);

			starling.showStatsAt(HAlign.LEFT, VAlign.BOTTOM);

            start();
		}
	
	}

}