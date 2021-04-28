import { fabric } from "fabric";
import { CursorMode, DrawAddComponent, DrawingMode, IObjectDrawer, IObjects } from './Interface';
import { DisplayComponent } from './DisplayComponent';
import { LineDrawer, LineDisplayComponent } from './Line/LineDrawer';
import { RectangleDrawer, RectangleDisplayComponent} from "./Rect/RectangleDrawer";
import { OvalDrawer, OvalDisplayComponent } from "./Oval/OvalDrawer";
import { TriangleDisplayComponent, TriangleDrawer } from "./Triangles/TriangleDrawer";
import { TextDrawer, TextDisplayComponent } from "./Text/TextDrawer";
import { PolylineDisplayComponent, PolylineDrawer } from "./Poly/PolylineDrawer";

class DrawingEditor {

    canvas: fabric.Canvas;

    private components: {[key: string] :DisplayComponent};
    private _drawer: IObjectDrawer; //Current drawer
    private cursorMode: CursorMode;
    readonly drawerOptions: fabric.IObjectOptions; //Current drawer options
    private readonly drawers: IObjectDrawer[]; //All possible drawers
    private object: IObjects | undefined; //The object currently being drawn
    private isDown: boolean;
    
    constructor(private readonly canvasRef: HTMLCanvasElement,  canvasHeight: number,  canvasWidth: number) {
        //Instantiate a new FabricJS Canvas on the created Canvas element.
        canvasRef.height = canvasHeight;
        canvasRef.width = canvasWidth;
        this.canvas = new fabric.Canvas(canvasRef, { selection: false, allowTouchScrolling:false });

        this.components = {};
        this.drawers = [ 
            new LineDrawer(),
            new RectangleDrawer(),
            new OvalDrawer(),
            new TriangleDrawer(),
            new TextDrawer(),
            new PolylineDrawer()
        ];
        
        //Set the current "drawer" class
        this._drawer = this.drawers[DrawingMode.Line];
        this.cursorMode = CursorMode.Draw;
        //Set the default options for the "drawer" class, including 
        //stroke color, width, and style
        this.drawerOptions = {
            stroke: 'white',
            strokeWidth: 1,
            selectable: true,
            strokeUniform: true
        };
        this.isDown = false;
        this.initializeCanvasEvents();
    }

    //Properties
    get drawingMode() { return this._drawer.drawingMode; }

    set drawingMode(value: DrawingMode) { this._drawer = this.drawers[value]; }

    private initializeCanvasEvents() { 
        this.canvas.on('mouse:down', (o) => {
            const e = o.e as MouseEvent;

            const pointer = this.canvas.getPointer(o.e);
            this.mouseDown(pointer.x, pointer.y);
        });

        this.canvas.on('mouse:move', (o) => {
            const pointer = this.canvas.getPointer(o.e);
            this.mouseMove(pointer.x, pointer.y);
        });

        this.canvas.on('mouse:up', (o) => {
            this.isDown = false;
        });

        this.canvas.on('selection:created', (o) => {
            this.cursorMode = CursorMode.Select;
            //sets currently selected object
            this.object = o.target;
        });
    
        this.canvas.on('selection:cleared', (o) => {
            this.cursorMode = CursorMode.Draw;
        });
    }

    private async mouseDown(x: number, y: number): Promise<any> {
        this.isDown = true; //The mouse is being clicked
        if (this.cursorMode !== CursorMode.Draw) {
            return;
        }
        //Create an object at the point (x,y)
        this.object = await this.make(x, y);
        
        //Add the object to the canvas
        this.canvas.add(this.object);
        
        //Renders all objects to the canvas
        this.canvas.renderAll();
    }

    private async make(x: number, y: number): Promise<fabric.Object> {
        return await this._drawer.make(x, y, this.drawerOptions);
    }

    private mouseMove(x: number, y: number): any {
        if (!(this.cursorMode.valueOf() === CursorMode.Draw.valueOf() && this.isDown)) {
            return;
        }
        
        //Use the Resize method from the IObjectDrawer interface
        this._drawer.resize(this.object!, x, y);
        this.canvas.renderAll();
    }

    addComponents(componentList: DrawAddComponent) {
        componentList.forEach((item) => {
            this.addComponent(item.id, item.type);
        });
    }

    //Creates new classes for each included component
    addComponent(target: string, component: string) {

        switch (component) {
            case 'line':
                this.components[component] = new LineDisplayComponent(target, this);
                break;
            case 'rect': 
                this.components[component] =  new RectangleDisplayComponent(target, this);
                break;
            case 'oval':
                this.components[component] =  new OvalDisplayComponent(target, this);
                break;
            case 'triangle':
                this.components[component] =  new TriangleDisplayComponent(target, this);
                break;
            case 'text':
                //New component
                this.components[component]  = new TextDisplayComponent(target, this);
                break;
            case 'polyline':
                this.components[component]  = new PolylineDisplayComponent(target, this);
                break;
        }

    }

    componentSelected(componentName: string) {
        //Deselect any objects on the canvas that are selected
        this.canvas.discardActiveObject();
        //FOREACH component in the drawing editor...
        for (var key in this.components) {
        
            // IF this component has a property with the passed-in name
            // THEN do nothing
            if (!this.components.hasOwnProperty(key)) continue;

            //OTHERWISE...
            const obj: DisplayComponent = this.components[key];

            //IF the component with the passed-in name
            //IS the component we expect
            if (obj.target === componentName) {
                //SET the drawing mode to the drawing mode
                //needed by the component
                this.drawingMode = obj.drawingMode;
            }

            //IF the method selectedChanged is defined on the component,
            //THEN call that method
            if (obj.selectedChanged !== undefined) {
                obj.selectedChanged(componentName);
            }
        }
    }

}

export default DrawingEditor;