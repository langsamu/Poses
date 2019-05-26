import HairControl from "./HairControl.js";

class HairQuantity extends HairControl {
    constructor() {
        super();
        super.instance = this;
    }

    process(e) {
        var input = e.path[0];

        const svg = document.getElementById("e");
        const element = svg.getElementById("hair");
        element.setAttribute("data-quantity", input.valueAsNumber);

        super.recreateHair();
    }
}

customElements.define("poses-hair-quantity", HairQuantity);

