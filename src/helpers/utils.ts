class Utils {

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

    toEightDecimals = (e) => {
        return +e.toString().match(/^-?\d+(?:\.\d{0,8})?/)[0];
    }
}
export const utils = new Utils();