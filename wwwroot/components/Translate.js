import RangeControl from "./RangeControl.js";

class Translate extends RangeControl {
    constructor() {
        super();
        super.instance = this;
    }

    process(e) {
        const input = e.path[0];

        super.enumerate(input, svgElement => {
            let transform = Array.from(svgElement.transform.baseVal).filter(t => t.type === SVGTransform.SVG_TRANSFORM_TRANSLATE)[0];

            if (transform === undefined) {
                transform = document.getElementById("e").createSVGTransform();
                svgElement.transform.baseVal.appendItem(transform);
            }

            switch (this._dimension) {
                case "x":
                    transform.setTranslate(input.value, transform.matrix.f);
                    break;

                case "y":
                    transform.setTranslate(transform.matrix.e, input.value);
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
