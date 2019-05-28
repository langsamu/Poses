import "./components/Scale.js";
import "./components/Translate.js";
import "./components/Rotate.js";
import "./components/Skew.js";
import "./components/PropertyPath.js";
import "./components/PathData.js";
import "./components/SaveSvg.js";
import "./components/SavePng.js";
import "./components/Quantity.js";

document.querySelectorAll(".control").forEach((control, index, controls) =>
    control.addEventListener("change", () => {
        window.location.hash = Array
            .from(controls)
            .filter(control => control.value !== control.defaultValue)
            .map(control => [control.id, encodeURIComponent(control.value)].join("="))
            .join("&");
    }));

window.addEventListener("load", () => {
    const query = window.location.hash.substring(1);
    if (query !== "") {
        document.getElementById("fieldsets").open = false;

        query
            .split("&")
            .map(param => param.split("="))
            .forEach(pair => {
                const control = document.getElementById(pair[0]);
                if (control) {
                    control.value = decodeURIComponent(pair[1]);
                }
            });
    }

    document.body.style.display = "initial";
});
