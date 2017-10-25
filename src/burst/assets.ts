/**
 * Requests to the Asset Exchange.
 * @version 1.0.0
 * @author Zeus <https://github.com/GoldZeus>
 */

import {BurstApi} from "./burst";

class AssetExchangeApi extends BurstApi {

    /**
     * Get all asset from one or an array of account IDs
     * @param {string | string[]} account
     * @param {number} firstIndex
     * @param {number} lastIndex
     * @returns {Promise}
     */
    getAssetsByIssuer(account: string|string[], firstIndex: number = null, lastIndex: number = null) {
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

export const assetExchangeApi = new AssetExchangeApi();