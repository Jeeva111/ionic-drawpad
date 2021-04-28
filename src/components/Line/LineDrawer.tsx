import { fabric } from 'fabric';
import { DrawingMode, IObjectDrawer, IObjects } from '../Interface';
import LineDisplayComponent from "./LineDisplayComponent ";

class LineDrawer implements IObjectDrawer {

    drawingMode: DrawingMode = DrawingMode.Line;

    make(x: number, y: number, options: fabric.IObjectOptions, x2?: number, y2?: number) : Promise<fabric.Object> { 

        //Return a Promise that will draw a line
        return new Promise<fabric.Object>(resolve => {
            //Inside the Promise, draw the actual line from (x,y) to (x2,y2)
            resolve(new fabric.Line([x, y, x2!, y2!], options));
        });

    }
    
    resize(object: IObjects, x: number, y: number) : Promise<fabric.Object> {
        //Change the secondary point (x2, y2) of the object 
        //This resizes the object between starting point (x,y)
        //and secondary point (x2,y2), where x2 and y2 have new values.
        if(object instanceof fabric.Line) {
            object.set({
                x2: x,
                y2: y
            }).setCoords();

        }
            //Wrap the resized object in a Promise
            return new Promise<fabric.Object>(resolve => {
                resolve(object);
            });
    }
}

export { LineDrawer, LineDisplayComponent };