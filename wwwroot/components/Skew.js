import RangeControl from "./RangeControl.js";

class Skew extends RangeControl {
    constructor() {
        super();
    }

    process() {
        super.enumerate(svgElement => {
            let transformType;
            let transformFunction;

            switch (this._dimension) {
                case "x":
                    transformType = SVGTransform.SVG_TRANSFORM_SKEWX;
                    transformFunction = SVGTransform.prototype.setSkewX;
                    break;

                case "y":
                    transformType = SVGTransform.SVG_TRANSFORM_SKEWY;
                    transformFunction = SVGTransform.prototype.setSkewY;
                    break;
            }

            let transform = Array.from(svgElement.transform.baseVal).filter(t => t.type === transformType)[0];

            if (transform === undefined) {
                transform = document.getElementById("e").createSVGTransform();
                svgElement.transform.baseVal.appendItem(transform);
            }

            transformFunction.call(transform, this.value);
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
