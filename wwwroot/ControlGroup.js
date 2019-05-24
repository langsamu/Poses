import Control from "./Control.js";

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
        const div = this.shadowRoot.querySelector("div");
        div.innerHTML = null;

        this.shadowRoot.querySelector("summary").innerText = value.legend;

        value.children.forEach(child => {
            switch (child.nodeType) {
                case "fieldset":
                    const controlGroup = document.createElement("poses-control-group");
                    controlGroup.node = child;

                    div.appendChild(controlGroup);

                    break;

                case "input":
                    const control = document.createElement(Control.parse(child));
                    control.node = child;
                    div.appendChild(control);


                    break;
            }
        });
    }
}

customElements.define("poses-control-group", ControlGroup);
