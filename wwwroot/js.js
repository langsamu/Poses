// TODO: need to click twice on controls
import "./ControlGroup.js";
import "./Control.js";
import "./ScaleY.js";

(function () {
    "use strict";

    function getSvgElement(id) {
        const svg = document.getElementById("e");
        return svg.getElementById(id);
    }
    function tokenize(input) {
        const element = document.createElement("div");
        element.className = input;
        return Array.from(element.classList);
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
            const f = document.createElement("poses-control-group");
            f.node = input;
            fieldsets.appendChild(f);
        });

        attachListeners();
    }

    function attachListeners() {
        document.getElementById("fieldsets").addEventListener("click", handle);
        document.getElementById("fieldsets").addEventListener("input", handle);
    }

    function handle(e) {
        const item = e.path[0];

        const listenerType = item.dataset.type;
        const listener = listeners[listenerType];

        if (listener) {
            listener.call(item);
        }
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
            const rot = rotationAmount * Math.PI / 180;
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
