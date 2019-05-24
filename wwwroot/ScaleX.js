import Control from "./Control.js";

class ScaleX extends Control {
    constructor() {
        super();
        super.instance = this;
    }

    process(e) {
        var input = e.path[0];

        super.enumerate(input, function (svgElement) {
            const transform = svgElement.transform.baseVal[2];
            transform.setScale(input.value, transform.matrix.d);
        });
    }
}

customElements.define("poses-scale-x", ScaleX);
