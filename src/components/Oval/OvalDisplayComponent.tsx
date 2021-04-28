import { DisplayComponent, DisplayComponentOptions } from "../DisplayComponent";
import DrawingEditor from "../DrawingEditor";
import { DrawingMode } from "../Interface";

export default class OvalDisplayComponent extends DisplayComponent {
    constructor(target: string, parent: DrawingEditor) {
        const options = new DisplayComponentOptions();
        Object.assign(options, {
            altText: 'Oval',
            classNames: 'fa fa-circle-o',
            childName: null
        });
        super(DrawingMode.Oval, target, parent, options);
    }
}