package utils
{
    import starling.display.DisplayObject;
    import starling.utils.HAlign;
    import starling.utils.VAlign;

    public class Position
    {
        public static function stack(obj1:DisplayObject, type:String, obj2:DisplayObject):void
        {
            if (HAlign.isValid(type) || VAlign.isValid(type))
            {
                switch (type)
                {
                    case VAlign.TOP:
                        obj1.y = obj2.y - obj1.height;
                        break;
                    case VAlign.BOTTOM:
                        obj1.y = obj2.y + obj2.height;
                        break;
                    case HAlign.LEFT:
                        obj1.x = obj2.x + obj1.width;
                        break;
                    case HAlign.RIGHT:
                        obj1.x = obj2.x + obj1.width;
                        break;
                }
            }
        }

        public static function vAlign(obj1:DisplayObject, type:String, obj2:DisplayObject):void
        {
            if (VAlign.isValid(type))
            {
                switch (type)
                {
                    case VAlign.TOP:
                        obj1.y = obj2.y;
                        break;
                    case VAlign.BOTTOM:
                        obj1.y = obj2.y + obj2.height - obj1.height;
                        break;
                    case VAlign.CENTER:
                        obj1.y = obj2.y + obj2.height / 2 - obj1.height / 2;
                        break;
                }
            }
        }



        public static function hALign(obj1:DisplayObject, type:String, obj2:DisplayObject):void
        {
            if (HAlign.isValid(type))
            {
                switch (type)
                {
                    case HAlign.LEFT:
                        obj1.x = obj2.x;
                        break;
                    case HAlign.RIGHT:
                        obj1.x = obj2.x + obj2.width - obj1.width;
                        break;
                    case HAlign.CENTER:
                        obj1.x = obj2.x + obj2.width / 2 - obj1.width / 2;
                        break;
                }
            }
        }
    }
}
