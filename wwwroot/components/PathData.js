import Control from "./Control.js";
import "https://cdn.jsdelivr.net/npm/path-data-polyfill@1.0.3/path-data-polyfill.min.js";

class PathData extends Control {
    constructor() {
        super();
        super.instance = this;
        this.type = "range";
    }

    process(e) {
        var input = e.path[0];

        super.enumerate(input, function (svgElement) {
            const pathData = svgElement.getPathData();
            pathData[input.dataset.pointindex].values[input.dataset.valueindex] = input.value;
            svgElement.setPathData(pathData);
        });
    }
}

customElements.define("poses-path-data", PathData);
