import React from 'react';
import { fabric } from "fabric";
import { CursorMode, DrawingMode, IObjectDrawer, IObjects } from './Interface';
import LineDrawer from './LineDrawer';

class DrawingEditor {

    canvas: fabric.Canvas;
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
        this.canvas = new fabric.Canvas(canvasRef, { selection: false });

        this.drawers = [ new LineDrawer() ];
        
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
            console.log("object:selected")
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

}

export default DrawingEditor;