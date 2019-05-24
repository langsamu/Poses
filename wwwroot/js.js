// TODO: need to click twice on controls
import "./ControlGroup.js";
import "./ScaleY.js";
import "./ScaleX.js";
import "./Rotate.js";
import "./PropertyPath.js";
import "./PathData.js";
import "./SaveSvg.js";
import "./SavePng.js";
import "./Distance.js";
import "./RotateMirrored.js";
import "./HairQuantity.js";
import "./HairDistance.js";

(function () {
    "use strict";

    async function processInputs() {
        const response = await fetch("inputs.json");
        const inputs = await response.json();

        inputs.forEach(function (input) {
            const f = document.createElement("poses-control-group");
            f.node = input;
            fieldsets.appendChild(f);
        });
    }

    window.addEventListener("load", function () {
        processInputs();
    });
}());
