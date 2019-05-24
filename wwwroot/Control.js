const template = document.createElement("template");
template.innerHTML = `
<style>
    :host {
        padding: 10px;
        display: block;
    }

        :host(:hover) {
            background: #f1f1f1;
        }

    label {
        display: inline-block;
        width: 150px;
    }

    button {
        background: #bbb;
        border-radius: 10px;
        border: none;
        height: 30px;
        width: 30px;
    }

    input {
        width: 180px;
    }

    input[type=color] {
        border: none;
        border-radius: 10px;
        background: #bbb;
        height: 20px;
    }

    input[type=range] {
        -webkit-appearance: none !important;
        height: 20px;
        border-radius: 10px;
        background: #bbb;
    }

    input:focus, button:focus {
        outline: none;
    }

    input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none !important;
        background: #888;
        height: 40px;
        width: 40px;
        border-radius: 20px;
    }

        input[type=range]::-webkit-slider-thumb:before {
            background-color: yellow;
        }
</style>
<label for="i"></label>
<input id="i"></input>
`;

class Control extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(template.content.cloneNode(true));
        shadow.addEventListener("input", process.bind(this));
    }

    set instance(value) {
        this._instance = value;
    }

    set node(value) {
        this.title = value.title;
        this.shadowRoot.querySelector("label").innerText = value.label;

        const input = this.shadowRoot.querySelector("input");
        input.type = value.inputType;
        input.min = value.min;
        input.max = value.max;
        input.value = value.value;
        input.defaultValue = value.value;

        switch (input.type) {
            case "range":
                if (value.step) {
                    input.step = value.step;
                }

                break;
        }

        input.dataset.type = value.type;
        input.dataset.for = value.target;
        input.dataset.transformIndex = value.transformIndex;
        input.dataset.path = value.path;
        input.dataset.pointIndex = value.pointIndex;
        input.dataset.valueIndex = value.valueIndex;

        if (value.inputType !== "button") {
            const buttonElement = document.createElement("button");
            this.shadowRoot.appendChild(buttonElement);

            buttonElement.dataset.type = "reset";
            buttonElement.innerText = "❌";

            buttonElement.addEventListener("click", function () {
                input.value = input.defaultValue;

                input.dispatchEvent(new Event("input", {
                    bubbles: true
                }));
            });
        }
    }

    static parse(node) {
        switch (node.type) {
            case "scaleY":
                return "x-scale-y";

            default:
                return "x-control";
        }
    }
}

function process() {
    this._instance.process();
}

customElements.define("x-control", Control);

export default Control;
