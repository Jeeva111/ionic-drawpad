import { fabric } from 'fabric';
import { DrawingMode, IObjectDrawer, IObjects } from "../Interface";
import OvalDisplayComponent from "./OvalDisplayComponent";

class OvalDrawer implements IObjectDrawer {
    private origX!: number;
    private origY!: number;

    drawingMode: DrawingMode = DrawingMode.Oval;

    make(x: number, y: number, options: fabric.IObjectOptions, rx?: number, ry?: number): Promise<fabric.Object> {
        this.origX = x;
        this.origY = y;

        return new Promise<fabric.Object>(resolve => {
            resolve(new fabric.Ellipse({
                left: x,
                top: y,
                rx: rx,
                ry: ry,
                fill: 'transparent',
                ...options
            }));
        });
    }

    resize(object: IObjects, x: number, y: number): Promise<fabric.Object> {

        if(object instanceof fabric.Ellipse) {
            object.set({
                originX: this.origX > x ? 'right' : 'left',
                originY: this.origY > y ? 'bottom' : 'top',
                rx: Math.abs(x - object.left!) / 2,
                ry: Math.abs(y - object.top!) / 2
            }).setCoords();
        }

        return new Promise<fabric.Object>(resolve => {
            resolve(object);
        });
    }
}

export { OvalDrawer, OvalDisplayComponent };