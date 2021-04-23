import { IconBaseProps, IconType } from 'react-icons/lib';
type IconProps = {
    icon: IconType;  
    options?: IconBaseProps  
}
const customCursor = (reactIcon:IconProps): string => {
    var encodedIcon: string = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="20" width="20" xmlns="http://www.w3.org/2000/svg"> <path d="${reactIcon.icon(reactIcon.options?reactIcon.options:{}).props.children[0].props.d}" /></svg>`;
    return `data:image/svg+xml;base64,${ window.btoa(encodedIcon) }`;
}

export { customCursor };