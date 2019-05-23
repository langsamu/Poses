(function () {
    "use strict";

    function getSvgElement(id) {
        var svg = e;
        return svg.getElementById(id);
    }
    function tokenize(input) {
        var element = document.createElement("div");
        element.className = input;
        return element.classList.toArray();
    }
    function onResetClick() {
        var forItem = document.getElementById(this.dataset["for"]);
        forItem.value = forItem.defaultValue;
        forItem.update();
    }
    function enumerate(input, callback) {
        var svgElementIds = tokenize(input.dataset.for);

        svgElementIds
            .map(getSvgElement)
            .forEach(function (svgElement) {
                callback.call(input, svgElement);
            });
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
        var response = await fetch("inputs.json");
        var inputs = await response.json();

        inputs.forEach(function (input) {
            processNode(input, fieldsets);
        });

        attachListeners();
        attachResetButtons();
    }
    function processNode(node, context) {
        var processingFunctions = {
            fieldset: processFieldset,
            input: processInput
        };

        var processingFunction = processingFunctions[node.nodeType];
        if (processingFunction) {
            processingFunction.call(this, node, context);
        }
    }
    function processFieldset(node, context) {
        var detailsElement = document.createElement("details");
        context.appendChild(detailsElement);

        detailsElement.id = generateId(detailsElement, context);

        var summaryElement = document.createElement("summary");
        detailsElement.appendChild(summaryElement);

        summaryElement.innerText = node.legend;

        node.children.forEach(function (child) {
            processNode(child, detailsElement);
        });
    }
    function processInput(node, context) {
        var divElement = document.createElement("div");
        context.appendChild(divElement);

        var id = generateId(divElement, context);

        divElement.title = node.title;

        var label = document.createElement("label");
        divElement.appendChild(label);

        label.htmlFor = id;
        label.innerText = node.label;

        var inputElement = document.createElement("input");
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

        var outputElement = document.createElement("output");
        divElement.appendChild(outputElement);

        outputElement.setAttribute("for", id);

        if (node.inputType !== "button") {
            var buttonElement = document.createElement("button");
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
            var listenerType = item.dataset.type;
            var listener = listeners[listenerType];

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

    var listeners = {
        saveSvg: function () {
            var svg = e;
            var xml = svg.outerHTML;

            var svgBlob = new Blob([xml], { type: "image/svg+xml; charset=utf-8" });
            var url = URL.createObjectURL(svgBlob);

            var link = document.createElement("a");
            link.download = "pose.svg";
            link.href = url;
            link.click();

            URL.revokeObjectURL(svgBlob);
        },
        savePng: function () {
            var svg = e;
            var xml = svg.outerHTML;

            var image = new Image(e.clientWidth, e.clientHeight);

            var svgBlob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
            var url = URL.createObjectURL(svgBlob);

            image.addEventListener("load", function () {
                var canvas = document.createElement("canvas");
                canvas.setAttribute("width", e.clientWidth);
                canvas.setAttribute("height", e.clientHeight);

                var context = canvas.getContext("2d");

                context.drawImage(image, 0, 0);

                var link = document.createElement("a");
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
                var pathData = svgElement.getPathData();
                pathData[this.dataset.pointIndex].values[this.dataset.valueIndex] = this.value;
                svgElement.setPathData(pathData);
            });
        },
        propertyPath: function () {
            var properties = tokenize(this.dataset.path);
            var boundStepper = getPathNavigatorReduceFunction(this.value);

            enumerate(this, function (svgElement) {
                properties.reduce(boundStepper, svgElement);
            });
        },
        rotate: function () {
            enumerate(this, function (svgElement) {
                var transformIndex = this.dataset.transformIndex;

                svgElement.transform.baseVal[transformIndex].setRotate(this.value, 0, 0);
            });
        },
        scaleX: function () {
            enumerate(this, function (svgElement) {
                var transform = svgElement.transform.baseVal[2];
                transform.setScale(this.value, transform.matrix.d);
            });
        },
        scaleY: function () {
            enumerate(this, function (svgElement) {
                var transform = svgElement.transform.baseVal[2];
                transform.setScale(transform.matrix.a, this.value);
            });
        },
        distance: function () {
            var svgElements = tokenize(this.dataset.for)
                .map(getSvgElement);

            svgElements[0].transform.baseVal[0].matrix.e = -this.valueAsNumber;
            svgElements[1].transform.baseVal[0].matrix.e = this.valueAsNumber;
        },
        rotateMirrored: function () {
            var svgElements = tokenize(this.dataset.for)
                .map(getSvgElement);

            svgElements[0].transform.baseVal[1].setRotate(this.valueAsNumber, 0, 0);
            svgElements[1].transform.baseVal[1].setRotate(-this.valueAsNumber, 0, 0);
        },
        hairQuantity: function () {
            var element = e.getElementById("hair");
            element.setAttribute("data-quantity", this.valueAsNumber);

            recreateHair();
        },
        hairDistance: function () {
            var element = e.getElementById("hair");
            element.setAttribute("data-distance", this.valueAsNumber);

            recreateHair();
        },
        hairProperty: function () {
            listeners.propertyPath.call(this);

            recreateHair();
        }
    };

    function recreateHair() {
        var svg = e;
        var hair = svg.getElementById("hair");
        var head = svg.getElementById("head");
        var distance = parseInt(hair.getAttribute("data-distance"));
        var quantity = parseInt(hair.getAttribute("data-quantity"));

        var uses = hair.querySelectorAll("use");
        for (var i = uses.length - 1; i > -1; i--) {
            hair.removeChild(uses[i]);
        }

        var rotationAmount = (quantity - 1) * distance / -2;
        var a = head.ry.baseVal.value;
        var b = head.rx.baseVal.value;

        for (var j = 0; j < quantity; j++) {
            var rot = rotationAmount.toRadians();
            var translateAmount = -a * b / Math.sqrt(Math.pow(b * Math.cos(rot), 2) + Math.pow(a * Math.sin(rot), 2));

            var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
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
