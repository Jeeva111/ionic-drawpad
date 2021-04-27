import React from "react";
import { IonButton } from "@ionic/react";
import DrawingEditor from "./DrawingEditor";
import { DrawingMode } from "./Interface";

class DisplayComponent {

    drawingMode: DrawingMode; //Line, Rectangle, Oval, etc.
    target: string; //The selector for the HTML element 
                    //this Component will be rendered in
    hoverText: string; //The tooltip text
    svg: string; //The SVG for the component's icon
    cssClass: string | undefined; //CSS class for the FontAwesome 
                      //icon used by this display component
    childName: string | undefined; //Selector for the child element; 
                       //only used by text components.
    canvasDrawer: DrawingEditor;

    constructor(mode: DrawingMode, selector: string, parent: DrawingEditor, options: DisplayComponentOptions) {
        this.drawingMode = mode;
        this.target = selector; 
        this.cssClass = options.classNames;
        this.hoverText = options.altText;
        this.svg = options.svg;
        this.childName = options.childName;
        this.canvasDrawer = parent;
        this.render();
        this.attachEvents();
    }

    //This method replaces the target HTML with the component's HTML.
    //The radio button is included to have Bootstrap use the correct styles.
    render() {
        const ionicHtml = `<IonButton onClick={selectedOption}> ${this.hoverText} </IonButton>`;
        document.getElementById(this.target)!.replaceWith(ionicHtml);
    }

    //This method attaches the componentSelected event in DrawingEditor
    attachEvents() {
        const data = {
            mode: this.drawingMode,
            container: this.canvasDrawer,
            target: this.target
        };

        //When clicking the <label>, fire this event.
        // this.target.click(data, function () {
        //     data.container.drawingMode = data.mode;
        //     data.container.componentSelected(data.target);
        // });
    }

    selectedOption(data:any) {
        console.log(data);
    }

    selectedChanged(componentName: string) { }
    
}

class DisplayComponentOptions {
    altText!: string;
    svg!: string;
    classNames?: string;
    childName?: string;
}

export { DisplayComponent, DisplayComponentOptions };