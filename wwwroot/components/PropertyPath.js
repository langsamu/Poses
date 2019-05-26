import Control from "./Control.js";

class PropertyPath extends Control {
    constructor() {
        super();
    }

    process() {
        const properties = tokenize(this._path);
        const boundStepper = getPathNavigatorReduceFunction(this.value);

        super.enumerate(svgElement => {
            properties.reduce(boundStepper, svgElement);
        });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);

        switch (name) {
            case "path":
                this._path = newValue;
                break;
        }
    }

    static get observedAttributes() {
        return [
            "path"
        ].concat(super.observedAttributes);
    }
}

function tokenize(input) {
    const element = document.createElement("div");
    element.className = input;
    return Array.from(element.classList);
}
function getPathNavigatorReduceFunction(value) {
    return function (previousValue, currentValue, index, array) {
        if (index === array.length - 1) {
            previousValue[currentValue] = value;
        } else {
            return previousValue[currentValue];
        }
    };
}

customElements.define("poses-property-path", PropertyPath);

export default PropertyPath;
