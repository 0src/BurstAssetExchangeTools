"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Utils {
    constructor() {
        this.toEightDecimals = (e) => {
            return +e.toString().match(/^-?\d+(?:\.\d{0,8})?/)[0];
        };
    }
    /**
     * Converts JSON object to Query String.
     * @param jsonObj
     * @returns {string}
     */
    JSONtoQueryString(jsonObj) {
        return '?' +
            Object.keys(jsonObj).map((key) => {
                return encodeURIComponent(key) + '=' + encodeURIComponent(jsonObj[key]);
            }).join('&');
    }
}
exports.utils = new Utils();
