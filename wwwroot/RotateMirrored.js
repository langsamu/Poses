import Control from "./Control.js";

class RotateMirrored extends Control {
    constructor() {
        super();
        super.instance = this;
    }

    process(e) {
        var input = e.path[0];
        const svgElements = super.query(input);

        svgElements[0].transform.baseVal[1].setRotate(input.valueAsNumber, 0, 0);
        svgElements[1].transform.baseVal[1].setRotate(-input.valueAsNumber, 0, 0);
    }
}

customElements.define("poses-rotate-mirrored", RotateMirrored);
