
enum ImageDropdownStyle {
    Fill, //Used for colors
    Copy //Used for text or other displays
}

class ImageOption {
    display: string | undefined;
    value: any;
    text: string | undefined;
}

class ImageDropdownOptions {
    selectedStyle: ImageDropdownStyle | undefined;
    width!: number;
    childWidth?: number;
    selectedIndex: any;
    optionsList!: ImageOption[];
    handlers?: { [key: string]: (value?: any) => void }
}

class ImageDropdown {

    element: HTMLElement; //ID of the element 
                          //where this dropdown will be rendered
    value: any; //Property holder for the value of the selected item
    handlers: { [key: string]: (value?: any) => void };

    constructor(private readonly selector: string, 
                private readonly options: ImageDropdownOptions) {
        this.element = document.getElementById(this.selector)!;
        this.handlers = options.handlers!;
        this.render();
        this.attachEvents();
    }

    //Renders the basic HTML for the control
    render() {
        this.element.outerHTML =
        `<div id="${this.selector}" class='imageDropdown'>
            <div style="width: ${this.options.width}px">
            ${this.renderSelected()}
            <i class="fa fa-caret-square-o-down"></i>
            </div>
            <ul class="hidden dropDownList" style="width: ${this.options.childWidth || this.options.width}px">
            ${this.renderOptions()}                    
            </ul>
         </div>`;
     }

     renderSelected() {
        switch (this.options.selectedStyle) {
            case ImageDropdownStyle.Copy:
                return `<div id="${this.selector}_selected" style="width: ${this.options.width - 20}px">${this.options.optionsList[this.options.selectedIndex].display}</div>`;
            //The below case is used for color options
            case ImageDropdownStyle.Fill:
                return `<div id="${this.selector}_selected" style="width: ${this.options.width - 20}px; height:20px; background-color: ${this.options.optionsList[this.options.selectedIndex].value}"><span></span></div>`;
        }
    }

    //When an option is selected, render that option specially
    renderSelectedDiv() { }

    //Render all options in the dropdown
    renderOptions() {
        let output = '';
        this.options.optionsList.map((record) => {
            switch (this.options.selectedStyle) {
                case ImageDropdownStyle.Copy:
                    output += `<li class="vertical" title="${record.text}">${record.display}</li>`;
                    break;
                case ImageDropdownStyle.Fill:
                    output += `<li class="horizontal" title="${record.text}">${record.display}</li>`;
                    break;
            }
        });
    
        return output;
    }

    //Attach events (e.g. click events) to elements in the dropdown
    attachEvents() {
        this.element = document.getElementById(this.selector) as HTMLLIElement;
        const container = this; //The ImageDropdown itself
        const selectedDiv = this.element.children[0]; //The displayed value
        const list = this.element.children[1]; //The list of values
        const options: Element[] = [...list.children];
    
        //On click, if the selected class already has the CSS class 'hidden'
        //remove that class. Otherwise, add that class.
        selectedDiv.addEventListener('click', () => {
            if (list.classList.contains('hidden'))
                list.classList.remove('hidden');
            else
                list.classList.add('hidden');
        });
    
        //When the user clicks on one of the options,
        //that option should be shown in the display window
        //and the drawing brush should be modified to match the selection.
        options.forEach((element: any, index: number) => {
            element.addEventListener('click', () => {
                const selected = this.options.optionsList[index];
                list.classList.add('hidden');
    
                //Update value and display
                if (container.value != selected.value) {
                    switch (container.options.selectedStyle) {
                        //Use the selected value to modify the drawing brush.
                        case ImageDropdownStyle.Copy:
                            selectedDiv.children[0].innerHTML = selected.display!;
                            container.value = selected.value;
    
                            break;
                            
                        //For colors. Use the selected color to
                        //modify the drawing brush.
                        case ImageDropdownStyle.Fill:
                            Object.assign((selectedDiv.children[0] as HTMLElement).style, {
                                backgroundColor: selected.value
                            });
    
                            container.value = selected.value;
                            break;
                    }
                    
                    //If the Image Dropdown has a "change" event handler, call it.
                    if (container.handlers['change'] != null) {
                        container.handlers['change'](this.value);
                    }
                }
            });
        });
    }
}

export { ImageDropdownStyle, ImageOption, ImageDropdownOptions, ImageDropdown};