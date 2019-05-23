import Control from "./Control.js";

class Fieldset {
    render(node, context) {
        const detailsElement = document.createElement("details");
        context.appendChild(detailsElement);

        detailsElement.id = '_' + Math.random().toString(36).substr(2, 9);

        const summaryElement = document.createElement("summary");
        detailsElement.appendChild(summaryElement);

        summaryElement.innerText = node.legend;

        node.children.forEach(function (child) {
            switch (child.nodeType) {
                case "fieldset":
                    new Fieldset().render(child, detailsElement);
                    break;

                case "input":
                    new Control().render(child, detailsElement);
                    break;
            }
        });
    }
}

export default Fieldset;