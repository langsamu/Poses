import ButtonControl from "./ButtonControl.js";

class SaveSvg extends ButtonControl {
    constructor() {
        super();
        super.instance = this;
    }

    process() {
        const svg = document.getElementById("e");
        const xml = svg.outerHTML;

        const svgBlob = new Blob([xml], { type: "image/svg+xml; charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);

        const link = document.createElement("a");
        link.download = "pose.svg";
        link.href = url;
        link.click();

        URL.revokeObjectURL(svgBlob);
    }
}

customElements.define("poses-save-svg", SaveSvg);
