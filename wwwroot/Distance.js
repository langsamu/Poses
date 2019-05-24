import Control from "./Control.js";

class Distance extends Control {
    constructor() {
        super();
        super.instance = this;
    }

    process(e) {
        var input = e.path[0];
        const svgElements = super.query(input);

        svgElements[0].transform.baseVal[0].matrix.e = -input.valueAsNumber;
        svgElements[1].transform.baseVal[0].matrix.e = input.valueAsNumber;
    }
}

customElements.define("poses-distance", Distance);
