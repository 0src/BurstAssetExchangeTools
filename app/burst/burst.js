"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * All burst requests need to extends this class
 * @type {BurstApi}
 * @version 1.0.0
 * @author Zeus <https://github.com/GoldZeus>
 */
const axios = require("axios");
const utils_1 = require("../helpers/utils");
exports.defaultWallets = ['http://localhost:8125/burst', 'https://wallet1.burstnation.com:8125/burst'];
exports.burstApiConfig = {
    wallets: exports.defaultWallets,
    currentWalletIndex: 0,
    currentWallet: ''
};
class BurstApi {
    /**
     * Does an http/s request to a Burst Api account
     * @param {string} method - request method (POST or GET)
     * @param args
     * @returns {Promise}
     */
    doRequest(method = 'post', args) {
        const urlArgs = utils_1.utils.JSONtoQueryString(args);
        return new Promise((resolve, reject) => {
            if (!exports.burstApiConfig.currentWallet) {
                exports.burstApiConfig.currentWallet = exports.burstApiConfig.wallets[0];
            }
            const url = exports.burstApiConfig.currentWallet + urlArgs;
            axios({
                method: method,
                url: url
            }).then(result => {
                if (result.status !== 200) {
                    if (exports.burstApiConfig.wallets.length > ++exports.burstApiConfig.currentWalletIndex) {
                        exports.burstApiConfig.currentWallet = exports.burstApiConfig.wallets[exports.burstApiConfig.currentWalletIndex];
                        resolve(this.doRequest(method, args));
                    }
                    else {
                        exports.burstApiConfig.currentWalletIndex = 0;
                        exports.burstApiConfig.currentWallet = exports.burstApiConfig.wallets[exports.burstApiConfig.currentWalletIndex];
                        reject(result);
                    }
                    return;
                }
                resolve(result.data);
            }).catch((e) => {
                console.log(e);
                if (exports.burstApiConfig.wallets.length > ++exports.burstApiConfig.currentWalletIndex) {
                    exports.burstApiConfig.currentWallet = exports.burstApiConfig.wallets[exports.burstApiConfig.currentWalletIndex];
                    resolve(this.doRequest(method, args));
                }
                else {
                    exports.burstApiConfig.currentWalletIndex = 0;
                    exports.burstApiConfig.currentWallet = exports.burstApiConfig.wallets[exports.burstApiConfig.currentWalletIndex];
                    reject(e);
                }
            });
        });
    }
    /**
     * Does a GET request to the Burst Api account
     * @param args
     * @returns {Promise}
     */
    get(args) {
        return this.doRequest('get', args);
    }
    /**
     * Does a POST request to the Burst Api account
     * @param args
     * @returns {Promise}
     */
    post(args) {
        return this.doRequest('post', args);
    }
}
exports.BurstApi = BurstApi;
