import { IconBaseProps } from 'react-icons/lib';
import { GiPencilBrush, GiArrowCursor } from 'react-icons/gi';
import { MdTitle, MdPanTool, MdOpenWith, MdPalette, MdFormatSize } from 'react-icons/md';

type UIElements = {
    title: string;
    element: Array<UIElement>;
    status: boolean;
}
type UIElement = {
    key: Element;
    icon: IconBaseProps;
}
type RenderUIProps = {
    onPress: (param:UIElement)=>void;
}
enum Element {
    cursor,
    pan,
    move,
    pencil,
    text,
    textsize,
    palette
}

const UIOptions:Array<UIElements> = [{
    title:"Basic",
    status: true,
    element:[{
        key: Element.cursor,
        icon:<GiArrowCursor size={20}/>
    }, {
        key: Element.pan,
        icon:<MdPanTool size={20}/>
    }, {
        key: Element.move,
        icon:<MdOpenWith size={20}/>
    }]
}, {
    title:"Draw",
    status: true,
    element:[{
        key: Element.pencil,
        icon:<GiPencilBrush size={20}/>
    }]
}, {
    title:"Text",
    status: true,
    element:[{
        key: Element.text,
        icon:<MdTitle size={23}/>
    }, {
        key: Element.textsize,
        icon:<MdFormatSize size={20}/>
    }]
},  {
    title:"Utility",
    status: true,
    element:[{
        key: Element.palette,
        icon:<MdPalette size={20}/>
    }]
}];

export type { UIElements, UIElement, RenderUIProps };
export { UIOptions };