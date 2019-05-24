import Control from "./Control.js";

class ScaleY extends Control {
    constructor() {
        super();
        super.instance = this;
    }   

    process() {
        console.log("ScaleY.process");
    }
}

customElements.define("poses-scale-y", ScaleY);
