"use strict";
/**
 * Requests to the Asset Exchange.
 * @version 1.0.0
 * @author Zeus <https://github.com/GoldZeus>
 */
Object.defineProperty(exports, "__esModule", { value: true });
const burst_1 = require("./burst");
class AssetExchangeApi extends burst_1.BurstApi {
    /**
     * Get all asset from one or an array of account IDs
     * @param {string | string[]} account
     * @param {number} firstIndex
     * @param {number} lastIndex
     * @returns {Promise}
     */
    getAssetsByIssuer(account, firstIndex = null, lastIndex = null) {
        const data = {
            requestType: 'getAssetsByIssuer',
            account,
            firstIndex,
            lastIndex
        };
        return this.get(data);
    }
    getAssetAccounts(asset, height = '', firstIndex = null, lastIndex = null) {
        const data = {
            requestType: 'getAssetAccounts',
            asset,
            height,
            firstIndex,
            lastIndex
        };
        return this.get(data);
    }
}
exports.assetExchangeApi = new AssetExchangeApi();
