import Control from "./Control.js";

class ButtonControl extends Control {
    constructor() {
        super();
        this.type = "button";
        this.shadowRoot.querySelector("button").style.display = "none";
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);

        switch (name) {
            case "name":
                this.input.value = newValue;
                break;
        }
    }

    static get observedAttributes() {
        return [
            "name"
        ].concat(super.observedAttributes);
    }
}

export default ButtonControl;
