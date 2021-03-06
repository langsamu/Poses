﻿const template = document.createElement("template");
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

    output {
        display: inline-block;
        width: 50px;
    }
</style>
<label for="i"></label>
<input id="i"></input>
<output for="i"></output>
<button>❌</button>
`;

class Control extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(template.content.cloneNode(true));

        this.input.addEventListener("input", this.process.bind(this));
        this.input.addEventListener("input", e => this.output.value = this.input.value);
        this.input.addEventListener("change", e => this.dispatchEvent(new Event("change")));
        this.input.addEventListener("click", this.process.bind(this));
        this.input.addEventListener("wheel", e => {
            if (this.type === "range") {
                e.preventDefault();
                this.value = parseFloat(this.input.value) + Math.sign(e.deltaY) * parseFloat(this.input.step || 1);
            }
        });

        shadow.querySelector("button").addEventListener("click", e => {
            this.value = this.input.defaultValue;
            this.dispatchEvent(new Event("change"));
        });
    }

    get type() {
        return this.shadowRoot.querySelector("input").type;
    }
    set type(value) {
        this.input.type = value;
    }

    get input() {
        return this.shadowRoot.querySelector("input");
    }

    get output() {
        return this.shadowRoot.querySelector("output");
    }

    get value() {
        return this.input.value;
    }
    set value(value) {
        this.input.value = value;
        this.refresh();
    }

    get defaultValue() {
        return this.input.defaultValue;
    }

    enumerate(callback) {
        Array.from(document.getElementById("e").querySelectorAll(this.input.dataset.for)).forEach(callback);
    }

    refresh() {
        this.input.dispatchEvent(new Event("input"));
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "name":
                this.shadowRoot.querySelector("label").innerText = newValue;
                break;

            case "type":
                this.type = newValue;
                break;

            case "for":
                this.input.dataset[name] = newValue;
                break;

            case "min":
            case "max":
            case "step":
            case "accesskey":
                this.input.setAttribute(name, newValue);
                break;

            case "value":
                this.value = newValue;
                this.input.defaultValue = newValue;
        }
    }

    static get observedAttributes() {
        return [
            "name",
            "type",
            "min",
            "max",
            "step",
            "value",
            "for",
            "accesskey"
        ];
    }
}

export default Control;
