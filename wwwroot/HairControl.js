import Control from "./Control.js";

class HairControl extends Control {
    constructor() {
        super();
    }

    recreateHair() {
        const svg = document.getElementById("e");
        const hair = svg.getElementById("hair");
        const head = svg.getElementById("head");
        const distance = parseInt(hair.getAttribute("data-distance"));
        const quantity = parseInt(hair.getAttribute("data-quantity"));

        const uses = hair.querySelectorAll("use");
        for (let i = uses.length - 1; i > -1; i--) {
            hair.removeChild(uses[i]);
        }

        let rotationAmount = (quantity - 1) * distance / -2;
        const a = head.ry.baseVal.value;
        const b = head.rx.baseVal.value;

        for (let j = 0; j < quantity; j++) {
            const rot = rotationAmount * Math.PI / 180;
            const translateAmount = -a * b / Math.sqrt(Math.pow(b * Math.cos(rot), 2) + Math.pow(a * Math.sin(rot), 2));

            const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
            use.setAttribute("transform", "rotate(" + rotationAmount + ") translate(0, " + translateAmount + ")");
            use.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#hairStrand");
            hair.appendChild(use);

            rotationAmount += distance;
        }
    }
}

export default HairControl;
