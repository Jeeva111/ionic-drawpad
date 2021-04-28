import { fabric } from 'fabric';
import { DrawingMode, IObjectDrawer, IObjects } from "../Interface";
import TextDisplayComponent from './TextDisplayComponent';

class TextDrawer implements IObjectDrawer {
    drawingMode: DrawingMode = DrawingMode.Text;

    make(x: number, y: number, options: fabric.IObjectOptions): Promise<fabric.Object> {
         //We will need to render a textbox for the text to draw
        const text = document.getElementById('textComponentInput') as HTMLInputElement;

        return new Promise<fabric.Object>(resolve => {
            resolve(new fabric.Text(text.value, {
                left: x,
                top: y,
                ...options
            }));
        });
    }

    resize(object: IObjects, x: number, y: number): Promise<fabric.Object> {
        if(object instanceof fabric.Text) {
            object.set({
                left: x,
                top: y
            }).setCoords();
        }
        return new Promise<fabric.Object>(resolve => {
            resolve(object);
        });
    }
}

export { TextDrawer, TextDisplayComponent };