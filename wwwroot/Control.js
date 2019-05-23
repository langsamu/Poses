class Control {
    render(node, context) {
        const divElement = document.createElement("div");
        context.appendChild(divElement);

        const id = '_' + Math.random().toString(36).substr(2, 9);

        divElement.title = node.title;

        const label = document.createElement("label");
        divElement.appendChild(label);

        label.htmlFor = id;
        label.innerText = node.label;

        const inputElement = document.createElement("input");
        divElement.appendChild(inputElement);

        inputElement.id = id;
        inputElement.type = node.inputType;
        inputElement.min = node.min;
        inputElement.max = node.max;
        inputElement.value = node.value;
        inputElement.defaultValue = node.value;

        switch (inputElement.type) {
            case "range":
                if (node.step) {
                    inputElement.step = node.step;
                }
                break;
        }

        inputElement.dataset.type = node.type;
        inputElement.dataset.for = node.target;
        inputElement.dataset.transformIndex = node.transformIndex;
        inputElement.dataset.path = node.path;
        inputElement.dataset.pointIndex = node.pointIndex;
        inputElement.dataset.valueIndex = node.valueIndex;

        const outputElement = document.createElement("output");
        divElement.appendChild(outputElement);

        outputElement.setAttribute("for", id);

        if (node.inputType !== "button") {
            const buttonElement = document.createElement("button");
            divElement.appendChild(buttonElement);

            buttonElement.dataset.type = "reset";
            buttonElement.dataset.for = id;
            buttonElement.innerText = "❌";

            buttonElement.addEventListener("click", function () {
                inputElement.value = inputElement.defaultValue;

                inputElement.dispatchEvent(new Event("input", {
                    bubbles: true
                }));
            });
        }
    }
}

export default Control;