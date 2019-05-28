import RangeControl from "./RangeControl.js";

class Translate extends RangeControl {
    constructor() {
        super();
    }

    process() {
        super.enumerate((svgElement, index, all) => {
            let transform = Array.from(svgElement.transform.baseVal).filter(t => t.type === SVGTransform.SVG_TRANSFORM_TRANSLATE)[0];

            if (transform === undefined) {
                transform = svgElement.ownerSVGElement.createSVGTransform();
                svgElement.transform.baseVal.appendItem(transform);
            }

            const v = parseFloat(this.value);
            const d = v + index * -2 * v / (all.length - 1 || 1);

            switch (this._dimension) {
                case "x":
                    transform.setTranslate(d, transform.matrix.f);
                    break;

                case "y":
                    transform.setTranslate(transform.matrix.e, d);
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

customElements.define("poses-translate", Translate);
