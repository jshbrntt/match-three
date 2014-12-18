package   
{
	/**
	 * GDTAssets.as
	 * @author Joshua Barnett
	 */
	public class GDTAssets 
	{

        // Labels

        public static const TEXTURE_ATLAS_SHEET:String = "sheet";
        public static const FONT_MODE_NINE:String = "ModeNine";
        public static const SOUND_GLASS:String = "glass";
        public static const SOUND_GLASS_1:String = "glass1";
        public static const SOUND_GLASS_2:String = "glass2";
        public static const SOUND_GLASS_3:String = "glass3";
        public static const SOUND_GLASS_4:String = "glass4";
        public static const SOUND_GLASS_5:String = "glass5";
        public static const SOUND_SMASH:String = "smash";
        public static const SOUND_SMASH_1:String = "smash1";
        public static const SOUND_SMASH_2:String = "smash2";
        public static const SOUND_SMASH_3:String = "smash3";
        public static const SOUND_SMASH_4:String = "smash4";
        public static const SOUND_SWAP:String = "swap";
        public static const SOUND_UNDO:String = "undo";
        public static const TEXTURE_PANEL:String = "panel";
        public static const TEXTURE_BTN_SMALL:String = "btn_small";
        public static const TEXTURE_BTN_LARGE:String = "btn_large";
        public static const TEXTURE_BORDER:String = "border";
        public static const PARTICLE_GEM_REMOVED:String = "gem_removed";

        // Particles

        [Embed(source="../assets/particles/gem_removed.pex", mimeType="application/octet-stream")]
        public static const gem_removed:Class;

		// Texture Atlases
		
		[Embed(source="../assets/atlases/sheet.png")]
		public static const sheet:Class;
		
		[Embed(source="../assets/atlases/data.xml", mimeType="application/octet-stream")]
		public static const data:Class;
		
		// Fonts
		
		[Embed(source="../assets/fonts/modenine.ttf", embedAsCFF="false", fontFamily="ModeNine")]
		public static const modenine:Class;
		
		// Sounds
		[Embed(source = "../assets/sounds/glass1.mp3")]
		public static const glass1:Class;
		[Embed(source = "../assets/sounds/glass2.mp3")]
		public static const glass2:Class;
		[Embed(source = "../assets/sounds/glass3.mp3")]
		public static const glass3:Class;
		[Embed(source = "../assets/sounds/glass4.mp3")]
		public static const glass4:Class;
		[Embed(source = "../assets/sounds/glass5.mp3")]
		public static const glass5:Class;
		[Embed(source = "../assets/sounds/smash1.mp3")]
		public static const smash1:Class;
		[Embed(source = "../assets/sounds/smash2.mp3")]
		public static const smash2:Class;
		[Embed(source = "../assets/sounds/smash3.mp3")]
		public static const smash3:Class;
		[Embed(source = "../assets/sounds/smash4.mp3")]
		public static const smash4:Class;
		[Embed(source = "../assets/sounds/swap.mp3")]
		public static const swap:Class;
		[Embed(source = "../assets/sounds/undo.mp3")]
		public static const undo:Class;
		
		// Physics
		
		[Embed(source="../assets/physics/physics.json", mimeType="application/octet-stream")]
		public static const physics:Class;
		
		// Textures
		
		[Embed(source="../assets/textures/tile_blue.png")]
		public static const tile_blue:Class;
		
		[Embed(source="../assets/textures/tile_green.png")]
		public static const tile_green:Class;
		
		[Embed(source="../assets/textures/tile_purple.png")]
		public static const tile_purple:Class;
		
		[Embed(source="../assets/textures/tile_red.png")]
		public static const tile_red:Class;
		
		[Embed(source="../assets/textures/tile_yellow.png")]
		public static const tile_yellow:Class;
		
	}

}