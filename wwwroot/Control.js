const template = document.createElement("template");
template.innerHTML = `
<style>
    label {
        display: inline-block;
        width: 150px;
    }

    div {
        padding: 10px;
    }

        div:hover {
            background: #f1f1f1;
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
<div>
    <label for="i"></label>
    <input id="i"></input>
</div>
`;

class Control extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    set node(value) {
        this.shadowRoot.querySelector("div").title = value.title;
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
            this.shadowRoot.querySelector("div").appendChild(buttonElement);

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
}

customElements.define("x-control", Control);
