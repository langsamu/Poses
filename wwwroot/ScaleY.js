﻿import Control from "./Control.js";

class ScaleY extends Control {
    constructor() {
        super();
        super.instance = this;
    }

    process(e) {
        var input = e.path[0];

        super.enumerate(input, function (svgElement) {
            const transform = svgElement.transform.baseVal[2];
            transform.setScale(transform.matrix.a, input.value);
        });
    }
}

customElements.define("poses-scale-y", ScaleY);
