import HairControl from "./HairControl.js";

class HairDistance extends HairControl {
    constructor() {
        super();
    }

    process() {
        const svg = document.getElementById("e");
        const element = svg.getElementById("hair");
        element.setAttribute("data-distance", this.input.valueAsNumber);

        super.recreateHair();
    }
}

customElements.define("poses-hair-distance", HairDistance);

