import Control from "./Control.js";
import  "./path-data-polyfill.js";

class PathData extends Control {
    constructor() {
        super();
        super.instance = this;
    }

    process(e) {
        var input = e.path[0];

        super.enumerate(input, function (svgElement) {
            const pathData = svgElement.getPathData();
            pathData[input.dataset.pointIndex].values[input.dataset.valueIndex] = input.value;
            svgElement.setPathData(pathData);
        });
    }
}

customElements.define("poses-path-data", PathData);
