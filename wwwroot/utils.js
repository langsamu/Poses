(function () {
    NodeList.prototype.toArray = Array.prototype.slice;

    DOMTokenList.prototype.toArray = Array.prototype.slice;

    HTMLInputElement.prototype.update = function () {
        this.dispatchEvent(new Event("input", {
            bubbles: true
        }));
    };

    Number.prototype.toRadians = function() {
        return this * Math.PI / 180;
    };
}());