import RangeControl from "./RangeControl.js";

class Rotate extends RangeControl {
    constructor() {
        super();
    }

    process() {
        super.enumerate(svgElement => {
            let transform = Array.from(svgElement.transform.baseVal).filter(t => t.type === SVGTransform.SVG_TRANSFORM_ROTATE)[0];

            if (transform === undefined) {
                transform = document.getElementById("e").createSVGTransform();
                svgElement.transform.baseVal.appendItem(transform);
            }

            transform.setRotate(this.value, 0, 0);
        });
    }
}

customElements.define("poses-rotate", Rotate);
