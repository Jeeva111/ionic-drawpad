import { IconBaseProps } from 'react-icons/lib';
import { GiPencilBrush, GiArrowCursor } from 'react-icons/gi';
import { MdTitle, MdPanTool, MdOpenWith, MdPalette, MdFormatSize, MdDelete } from 'react-icons/md';

type UIElements = {
    title: string;
    element: Array<UIElement>;
    status: boolean;
}
type UIElement = {
    key: Element;
    icon: IconBaseProps;
    isActive:boolean;
    status: boolean;
}
type RenderUIProps = {
    onPress: (elementIndex: number, optionIndex: number, param:UIElement)=>void;
}
type SelectElement = {
    selectedElement: number;
    selectedOptionIndex: number;
    selectedOptionKey: Element;
}
enum Element {
    cursor,
    pan,
    move,
    delete,
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
        icon:<GiArrowCursor size={20}/>,
        isActive:false,
        status: true
    }, {
        key: Element.pan,
        icon:<MdPanTool size={20}/>,
        isActive:false,
        status: true
    }, {
        key: Element.delete,
        icon:<MdDelete size={20}/>,
        isActive:false,
        status: true
    }]
}, {
    title:"Draw",
    status: true,
    element:[{
        key: Element.pencil,
        icon:<GiPencilBrush size={20}/>,
        isActive:true,
        status: true
    }]
}, {
    title:"Text",
    status: true,
    element:[{
        key: Element.text,
        icon:<MdTitle size={23}/>,
        isActive:false,
        status: true
    }, {
        key: Element.textsize,
        icon:<MdFormatSize size={20}/>,
        isActive:false,
        status: false
    }]
},  {
    title:"Utility",
    status: true,
    element:[{
        key: Element.palette,
        icon:<MdPalette size={20}/>,
        isActive:false,
        status: true
    }]
}];

const defaultOption = {
    selectedElement: 1,
    selectedOptionIndex:0,
    selectedOptionKey: Element.pencil
}

export type { UIElements, UIElement, RenderUIProps, SelectElement };
export { UIOptions, defaultOption, Element };