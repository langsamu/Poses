import HairControl from "./HairControl.js";

class HairQuantity extends HairControl {
    constructor() {
        super();
    }

    process() {
        const svg = document.getElementById("e");
        const element = svg.getElementById("hair");
        element.setAttribute("data-quantity", this.input.valueAsNumber);

        super.recreateHair();
    }
}

customElements.define("poses-hair-quantity", HairQuantity);

