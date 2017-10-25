"use strict";
/**
 * Requests to Accounts
 * @version 1.0.0
 * @author Zeus <https://github.com/GoldZeus>
 */
Object.defineProperty(exports, "__esModule", { value: true });
const burst_1 = require("./burst");
class AccountsApi extends burst_1.BurstApi {
    /**
     * Get account id from pass phrase
     * @param {string} secretPhrase
     * @param {string} publicKey
     * @returns {Promise}
     */
    getAccountId(secretPhrase, publicKey = null) {
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
    sendMoney(secretPhrase, recipient, amount, message) {
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
exports.accountsApi = new AccountsApi();
