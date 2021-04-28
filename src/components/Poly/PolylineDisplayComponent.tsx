import DrawingEditor from "../DrawingEditor";
import { DisplayComponent, DisplayComponentOptions } from "../DisplayComponent";
import { DrawingMode } from "../Interface";

export default class PolylineDisplayComponent extends DisplayComponent {
    constructor(target: string, parent: DrawingEditor) {
        const options = new DisplayComponentOptions();
        Object.assign(options, {
            altText: 'Pencil',
            classNames: 'fa fa-pencil',
            childName: null
        });
        super(DrawingMode.Polyline, target, parent, options);
    }
}