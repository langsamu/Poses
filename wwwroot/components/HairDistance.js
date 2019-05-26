import HairControl from "./HairControl.js";

class HairDistance extends HairControl {
    constructor() {
        super();
        super.instance = this;
    }

    process(e) {
        var input = e.path[0];

        const svg = document.getElementById("e");
        const element = svg.getElementById("hair");
        element.setAttribute("data-distance", input.valueAsNumber);

        super.recreateHair();
    }
}

customElements.define("poses-hair-distance", HairDistance);

