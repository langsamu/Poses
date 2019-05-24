import Control from "./Control.js";

class Rotate extends Control {
    constructor() {
        super();
        super.instance = this;
    }

    process(e) {
        var input = e.path[0];

        super.enumerate(input, function (svgElement) {
            const transformIndex = input.dataset.transformIndex;

            svgElement.transform.baseVal[transformIndex].setRotate(input.value, 0, 0);
        });
    }
}

customElements.define("poses-rotate", Rotate);
