import RangeControl from "./RangeControl.js";

class Scale extends RangeControl {
    constructor() {
        super();
        super.instance = this;
    }

    process(e) {
        const input = e.path[0];

        super.enumerate(input, svgElement => {
            let transform = Array.from(svgElement.transform.baseVal).filter(t => t.type === SVGTransform.SVG_TRANSFORM_SCALE)[0];

            if (transform === undefined) {
                transform = document.getElementById("e").createSVGTransform();
                svgElement.transform.baseVal.appendItem(transform);
            }

            switch (this._dimension) {
                case "x":
                    transform.setScale(input.value, transform.matrix.d);
                    break;

                case "y":
                    transform.setScale(transform.matrix.a, input.value);
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

customElements.define("poses-scale", Scale);
