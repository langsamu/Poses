import Control from "./Control.js";

class HairControl extends Control {
    constructor() {
        super();
        this.type = "range";
    }

    recreateHair() {
        const svg = document.getElementById("e");
        const hair = svg.getElementById("hair");
        const distance = parseInt(hair.getAttribute("data-distance"));
        const quantity = parseInt(hair.getAttribute("data-quantity"));

        for (var i of hair.querySelectorAll("use")) {
            hair.removeChild(i);
        }

        let rotationAmount = (quantity - 1) * distance / -2;

        for (let j = 0; j < quantity; j++) {
            const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
            use.setAttribute("transform", "rotate(" + rotationAmount + ") scale(" + (rotationAmount < 0 ? "-" : "") + "1 1)");
            use.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#hairStrand");
            hair.appendChild(use);

            rotationAmount += distance;
        }
    }
}

export default HairControl;
