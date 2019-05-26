import ButtonControl from "./ButtonControl.js";

class SavePng extends ButtonControl {
    constructor() {
        super();
        super.instance = this;
    }

    process() {
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
    }
}

customElements.define("poses-save-png", SavePng);
