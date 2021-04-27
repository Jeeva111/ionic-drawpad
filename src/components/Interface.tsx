enum DrawingMode {
    Line,
    Rectangle,
    Oval,
    Text,
    Polyline,
    Path
}

enum CursorMode {
    Draw,
    Select
}

type IObjects = fabric.Object | fabric.Line;

type DrawAddComponent = {
    id: string;
    type: string;
}[];

interface IObjectDrawer {
    drawingMode: DrawingMode;
    //Makes the current object
    readonly make: (x: number, //Horizontal starting point
        y: number, //Vertical starting point
        options: fabric.IObjectOptions,
        x2?: number, //Horizontal ending point
        y2?: number) //Vertical ending point
            => Promise<fabric.Object>;
    //Resizes the object (used during the mouseOver event below)
    readonly resize: (object: IObjects, x: number, y: number)  => Promise<fabric.Object>;
}

export type { IObjectDrawer, IObjects, DrawAddComponent };
export { DrawingMode, CursorMode };