import DrawingEditor from '../DrawingEditor';
import ControlComponent from '../ControlComponent';

class DeleteComponent extends ControlComponent {
    constructor(target: string, parent: DrawingEditor) {
        super(
            target,
            "fa fa-trash-o", //CSS class for icons
            "Delete Selected Item", //Tooltip text
            parent,
            {
                //The component invokes a method 
                //on DrawingEditor to delete selected objects.
                'click': () => { parent.deleteSelected(); }
            });
    }

    //Render a disabled button with a trash can icon
    render() {
        const html = `<button id="${this.target.replace('#', '')}" title="${this.hoverText}" disabled class="btn btn-danger">
                        <i class="${this.cssClass}"></i>
                     </button>`;

        document.getElementById(this.target)!.innerHTML = html;
    }

    //Enable the button
    //Will be called when a canvas object is selected
    enable() {
        var ele = document.getElementById(this.target.replace('#', ''));

        Object.assign(ele, {
            disabled: false
        });
    }

    //Disable the button
    //Will be called when no canvas objects are selected
    disable() {
        var ele = document.getElementById(this.target.replace('#', ''));

        Object.assign(ele, {
            disabled: true
        });
    }
}

export { DeleteComponent };