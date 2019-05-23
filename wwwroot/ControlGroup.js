import "./Control.js";

const template = document.createElement("template");
template.innerHTML = `
<style>
    details {
        border: 1px solid #808080;
        padding: 10px;
    }

    details:hover {
        background: #f9f9f9;
        border: 1px solid;
    }

    details summary {
        color: #808080;
        outline: none;
        cursor: pointer;
        user-select: none;
    }
</style>
<details>
    <summary></summary>
    <div></div>
</details>
`;

class ControlGroup extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    set node(value) {
        this.shadowRoot.querySelector("div").innerHTML = null;

        this.shadowRoot.querySelector("summary").innerText = value.legend;

        value.children.forEach(child => {
            switch (child.nodeType) {
                case "fieldset":
                    const controlGroup = document.createElement("x-control-group");
                    controlGroup.node = child;

                    this.shadowRoot.querySelector("div").appendChild(controlGroup);

                    break;

                case "input":
                    const i = document.createElement("x-control");
                    i.node = child;

                    this.shadowRoot.querySelector("div").appendChild(i);

                    break;
            }
        });
    }
}

customElements.define("x-control-group", ControlGroup);
