﻿import RangeControl from "./RangeControl.js";
import Rotate from "./Rotate.js";

class Quantity extends RangeControl {
    constructor() {
        super();
    }

    process() {
        this.enumerate(svgElement => {
            const uses = svgElement.querySelectorAll("use");
            const value = parseInt(this.value);

            if (uses.length === value) {
                return;
            }

            for (let use of uses) {
                svgElement.removeChild(use);
            }

            for (let j = 0; j < value; j++) {
                const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
                use.setAttributeNS("http://www.w3.org/1999/xlink", "href", this._href);

                svgElement.appendChild(use);
            }

            if (this._defaultrotation) {
                svgElement.querySelectorAll("use").forEach(Rotate.process.bind(this, parseFloat(this._defaultrotation)));
            }
        });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);

        switch (name) {
            case "href":
            case "defaultrotation":
                this["_" + name] = newValue;
                break;
        }
    }

    static get observedAttributes() {
        return [
            "href",
            "defaultrotation"
        ].concat(super.observedAttributes);
    }
}

customElements.define("poses-quantity", Quantity);

