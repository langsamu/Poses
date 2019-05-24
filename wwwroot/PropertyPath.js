import Control from "./Control.js";

class PropertyPath extends Control {
    constructor() {
        super();
        super.instance = this;
    }

    process(e) {
        var input = e.path[0];

        const properties = tokenize(input.dataset.path);
        const boundStepper = getPathNavigatorReduceFunction(input.value);

        super.enumerate(input, function (svgElement) {
            properties.reduce(boundStepper, svgElement);
        });
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
