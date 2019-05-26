import Control from "./Control.js";
import "https://cdn.jsdelivr.net/npm/path-data-polyfill@1.0.3/path-data-polyfill.min.js";

class PathData extends Control {
    constructor() {
        super();
        this.type = "range";
    }

    process() {
        super.enumerate(svgElement => {
            const pathData = svgElement.getPathData();
            pathData[this._pointindex].values[this._valueindex] = this.value;
            svgElement.setPathData(pathData);
        });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);

        switch (name) {
            case "pointindex":
            case "valueindex":
                this["_" + name] = newValue;
                break;
        }
    }

    static get observedAttributes() {
        return [
            "pointindex",
            "valueindex"
        ].concat(super.observedAttributes);
    }

}

customElements.define("poses-path-data", PathData);
