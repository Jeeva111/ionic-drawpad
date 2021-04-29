import DrawingEditor from "./DrawingEditor";

abstract class ControlComponent {
    target: string; //Selector for the component's render location
    cssClass: string; //CSS classes for icons
    hoverText: string; //Tooltip text
    canvasDrawer: DrawingEditor;
    handlers: { [key: string]: () => void };
    
    constructor(selector: string, classNames: string, altText: string, parent: DrawingEditor, handlers: { [key: string]: () => void }) {
        this.target = selector;
        this.cssClass = classNames;
        this.hoverText = altText;
        this.canvasDrawer = parent;
        this.render();
        this.handlers = handlers;
        this.attachEvents();
    }

    abstract render(): void;

    attachEvents() {
        if (this.handlers['click'] != null) {
            document.getElementById(this.target)?.addEventListener("click", () => {
                this.handlers['click']();
            });
        }

        if (this.handlers['change'] != null) {
            document.getElementById(this.target)?.addEventListener("change", () => {
                this.handlers['change']();
            });
        }
    }
}

export default ControlComponent;