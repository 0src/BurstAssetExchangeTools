/**
 * Requests to Accounts
 * @version 1.0.0
 * @author Zeus <https://github.com/GoldZeus>
 */

import {BurstApi} from "./burst";

class AccountsApi extends BurstApi {

    /**
     * Get account id from pass phrase
     * @param {string} secretPhrase
     * @param {string} publicKey
     * @returns {Promise}
     */
    getAccountId(secretPhrase: string, publicKey: string = null) {
        const data = {
            requestType: 'getAccountId',
            secretPhrase,
            publicKey
        };

        return this.post(data);
    }

    /**
     * Send burst to recipient
     * @param {string} secretPhrase
     * @param {string} recipient
     * @param {number} amount
     * @param {string} message
     * @returns {Promise}
     */
    sendMoney(secretPhrase: string, recipient: string, amount: number, message: string) {
        const amountNQT = parseInt('' + (amount * 100000000));

        const data = {
            requestType: 'sendMoney',
            secretPhrase,
            recipient,
            amountNQT,
            message,
            feeNQT: 100000000,
            deadline: 1440,
            messageIsText: true
        };

        return this.post(data);
    }
}

export const accountsApi = new AccountsApi();