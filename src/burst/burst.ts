/**
 * All burst requests need to extends this class
 * @type {BurstApi}
 * @version 1.0.0
 * @author Zeus <https://github.com/GoldZeus>
 */
import * as axios from 'axios';
import {utils} from "../helpers/utils";

export const defaultWallets = ['http://localhost:8125/burst', 'https://wallet1.burstnation.com:8125/burst'];

export const burstApiConfig = {
    wallets: defaultWallets,
    currentWalletIndex: 0,
    currentWallet: ''
};

export class BurstApi {

    /**
     * Does an http/s request to a Burst Api account
     * @param {string} method - request method (POST or GET)
     * @param args
     * @returns {Promise}
     */
    doRequest(method: string = 'post', args) {
        const urlArgs = utils.JSONtoQueryString(args);

        return new Promise((resolve, reject) => {
            if(!burstApiConfig.currentWallet) {
                burstApiConfig.currentWallet = burstApiConfig.wallets[0];
            }
            const url = burstApiConfig.currentWallet + urlArgs;

            axios({
                method: method,
                url: url
            }).then(result => {
                if(result.status !== 200) {
                    if(burstApiConfig.wallets.length > ++burstApiConfig.currentWalletIndex) {
                        burstApiConfig.currentWallet = burstApiConfig.wallets[burstApiConfig.currentWalletIndex];

                        resolve(this.doRequest(method, args));
                    } else {
                        burstApiConfig.currentWalletIndex = 0;
                        burstApiConfig.currentWallet = burstApiConfig.wallets[burstApiConfig.currentWalletIndex];

                        reject(result);
                    }
                    return;
                }

                resolve(result.data);
            }).catch((e) => {
                console.log(e);

                if(burstApiConfig.wallets.length > ++burstApiConfig.currentWalletIndex) {
                    burstApiConfig.currentWallet = burstApiConfig.wallets[burstApiConfig.currentWalletIndex];

                    resolve(this.doRequest(method, args));
                } else {
                    burstApiConfig.currentWalletIndex = 0;
                    burstApiConfig.currentWallet = burstApiConfig.wallets[burstApiConfig.currentWalletIndex];

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