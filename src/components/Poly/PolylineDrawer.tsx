import { fabric } from 'fabric';
import { DrawingMode, IObjectDrawer, IObjects } from "../Interface";
import PolylineDisplayComponent from './PolylineDisplayComponent';

class PolylineDrawer implements IObjectDrawer {
    drawingMode: DrawingMode = DrawingMode.Polyline;

    make(x: number, y: number, options: fabric.IObjectOptions,  rx?: number, ry?: number): Promise<fabric.Object> {
        return new Promise<fabric.Object>(resolve => {
            resolve(new fabric.Polyline(
                [{ x, y }],
                { ...options, fill: 'transparent', evented:false }
            ));
        });
    }

    resize(object: IObjects, x: number, y: number) : Promise<fabric.Object> {

        //Create and push a new Point for the Polyline
        if(object instanceof fabric.Polyline) {
            object.points?.push(new fabric.Point(x, y));
            const dim = object._calcDimensions();
            object.set({
                left: dim.left,
                top: dim.top,
                width: dim.width,
                height: dim.height,
                dirty: true,
                pathOffset: new fabric.Point(dim.left + dim.width / 2, dim.top + dim.height / 2)
            }).setCoords();
        }

        return new Promise<fabric.Object>(resolve => {
            resolve(object);
        });
    }
}

export { PolylineDrawer, PolylineDisplayComponent };