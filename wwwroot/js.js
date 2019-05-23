(function () {
    "use strict";

    function getSvgElement(id) {
        const svg = document.getElementById("e");
        return svg.getElementById(id);
    }
    function tokenize(input) {
        const element = document.createElement("div");
        element.className = input;
        return element.classList.toArray();
    }
    function onResetClick() {
        const forItem = document.getElementById(this.dataset["for"]);
        forItem.value = forItem.defaultValue;
        forItem.update();
    }
    function enumerate(input, callback) {
        tokenize(input.dataset.for)
            .map(getSvgElement)
            .forEach(callback.bind(input));
    }
    function getPathNavigatorReduceFunction(value) {
        return function (previousValue, currentValue, index, array) {
            if (index === array.length - 1) {
                previousValue[currentValue] = value;
            } else {
                return previousValue[currentValue];
            }
        };
    }

    async function processInputs() {
        const response = await fetch("inputs.json");
        const inputs = await response.json();

        inputs.forEach(function (input) {
            processNode(input, fieldsets);
        });

        attachListeners();
        attachResetButtons();
    }
    function processNode(node, context) {
        const processingFunctions = {
            fieldset: processFieldset,
            input: processInput
        };

        const processingFunction = processingFunctions[node.nodeType];
        if (processingFunction) {
            processingFunction.call(this, node, context);
        }
    }
    function processFieldset(node, context) {
        const detailsElement = document.createElement("details");
        context.appendChild(detailsElement);

        detailsElement.id = generateId(detailsElement, context);

        const summaryElement = document.createElement("summary");
        detailsElement.appendChild(summaryElement);

        summaryElement.innerText = node.legend;

        node.children.forEach(function (child) {
            processNode(child, detailsElement);
        });
    }
    function processInput(node, context) {
        const divElement = document.createElement("div");
        context.appendChild(divElement);

        const id = generateId(divElement, context);

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
        }
    }
    function generateId(element, context) {
        return context.id + "_" + context.childNodes.toArray().indexOf(element);
    }

    function attachListeners() {
        document.querySelectorAll("[data-type]").toArray().forEach(function (item) {
            const listenerType = item.dataset.type;
            const listener = listeners[listenerType];

            switch (item.type) {
                case "button":
                    item.addEventListener("click", listener);

                    break;

                default:
                    item.addEventListener("input", listener);

                    break;

            }
        });
    }
    function attachResetButtons() {
        document.querySelectorAll("button[data-type=reset]").toArray().forEach(function (button) {
            button.addEventListener("click", onResetClick);
        });
    }

    const listeners = {
        saveSvg: function () {
            const svg = document.getElementById("e");
            const xml = svg.outerHTML;

            const svgBlob = new Blob([xml], { type: "image/svg+xml; charset=utf-8" });
            const url = URL.createObjectURL(svgBlob);

            const link = document.createElement("a");
            link.download = "pose.svg";
            link.href = url;
            link.click();

            URL.revokeObjectURL(svgBlob);
        },
        savePng: function () {
            const svg = document.getElementById("e");
            const xml = svg.outerHTML;

            const image = new Image(e.clientWidth, e.clientHeight);

            const svgBlob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
            const url = URL.createObjectURL(svgBlob);

            image.addEventListener("load", function () {
                const canvas = document.createElement("canvas");
                canvas.setAttribute("width", e.clientWidth);
                canvas.setAttribute("height", e.clientHeight);

                const context = canvas.getContext("2d");

                context.drawImage(image, 0, 0);

                const link = document.createElement("a");
                link.download = "pose.png";
                link.href = canvas.toDataURL();
                link.click();

                URL.revokeObjectURL(url);
                URL.revokeObjectURL(link.href);
            });
            image.src = url;
        },
        pathData: function () {
            enumerate(this, function (svgElement) {
                const pathData = svgElement.getPathData();
                pathData[this.dataset.pointIndex].values[this.dataset.valueIndex] = this.value;
                svgElement.setPathData(pathData);
            });
        },
        propertyPath: function () {
            const properties = tokenize(this.dataset.path);
            const boundStepper = getPathNavigatorReduceFunction(this.value);

            enumerate(this, function (svgElement) {
                properties.reduce(boundStepper, svgElement);
            });
        },
        rotate: function () {
            enumerate(this, function (svgElement) {
                const transformIndex = this.dataset.transformIndex;

                svgElement.transform.baseVal[transformIndex].setRotate(this.value, 0, 0);
            });
        },
        scaleX: function () {
            enumerate(this, function (svgElement) {
                const transform = svgElement.transform.baseVal[2];
                transform.setScale(this.value, transform.matrix.d);
            });
        },
        scaleY: function () {
            enumerate(this, function (svgElement) {
                const transform = svgElement.transform.baseVal[2];
                transform.setScale(transform.matrix.a, this.value);
            });
        },
        distance: function () {
            const svgElements = tokenize(this.dataset.for)
                .map(getSvgElement);

            svgElements[0].transform.baseVal[0].matrix.e = -this.valueAsNumber;
            svgElements[1].transform.baseVal[0].matrix.e = this.valueAsNumber;
        },
        rotateMirrored: function () {
            const svgElements = tokenize(this.dataset.for)
                .map(getSvgElement);

            svgElements[0].transform.baseVal[1].setRotate(this.valueAsNumber, 0, 0);
            svgElements[1].transform.baseVal[1].setRotate(-this.valueAsNumber, 0, 0);
        },
        hairQuantity: function () {
            const element = e.getElementById("hair");
            element.setAttribute("data-quantity", this.valueAsNumber);

            recreateHair();
        },
        hairDistance: function () {
            const element = e.getElementById("hair");
            element.setAttribute("data-distance", this.valueAsNumber);

            recreateHair();
        },
        hairProperty: function () {
            listeners.propertyPath.call(this);

            recreateHair();
        }
    };

    function recreateHair() {
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
            const rot = rotationAmount.toRadians();
            const translateAmount = -a * b / Math.sqrt(Math.pow(b * Math.cos(rot), 2) + Math.pow(a * Math.sin(rot), 2));

            const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
            use.setAttribute("transform", "rotate(" + rotationAmount + ") translate(0, " + translateAmount + ")");
            use.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#hairStrand");
            hair.appendChild(use);

            rotationAmount += distance;
        }
    }

    window.addEventListener("load", function () {
        processInputs();
    });
}());
