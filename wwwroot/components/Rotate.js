import RangeControl from "./RangeControl.js";

class Rotate extends RangeControl {
    constructor() {
        super();
    }

    process() {
        this.enumerate(Rotate.process.bind(this, parseFloat(this.value)));
    }

    static process(value, svgElement, index, all) {
        let transform = Array.from(svgElement.transform.baseVal).filter(t => t.type === SVGTransform.SVG_TRANSFORM_ROTATE)[0];

        if (transform === undefined) {
            transform = svgElement.ownerSVGElement.createSVGTransform();
            svgElement.transform.baseVal.appendItem(transform);
        }

        transform.setRotate(value + index * -2 * value / ((all.length - 1) || 1), 0, 0);
    }
}

customElements.define("poses-rotate", Rotate);

export default Rotate;
