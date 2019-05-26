import RangeControl from "./RangeControl.js";

class Skew extends RangeControl {
    constructor() {
        super();
        super.instance = this;
    }

    process(e) {
        const input = e.path[0];

        super.enumerate(input, svgElement => {
            let type;
            switch (this._dimension) {
                case "x":
                    type = SVGTransform.SVG_TRANSFORM_SKEWX;
                    break;

                case "y":
                    type = SVGTransform.SVG_TRANSFORM_SKEWY;
                    break;
            }

            let transform = Array.from(svgElement.transform.baseVal).filter(t => t.type === type)[0];

            if (transform === undefined) {
                transform = document.getElementById("e").createSVGTransform();
                svgElement.transform.baseVal.appendItem(transform);
            }

            switch (this._dimension) {
                case "x":
                    transform.setSkewX(input.value);
                    break;

                case "y":
                    transform.setSkewY(input.value);
                    break;
            }
        });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);

        switch (name) {
            case "dimension":
                this._dimension = newValue;
                break;
        }
    }

    static get observedAttributes() {
        return [
            "dimension"
        ].concat(super.observedAttributes);
    }
}

customElements.define("poses-skew", Skew);
