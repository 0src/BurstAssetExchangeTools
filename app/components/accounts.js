"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const accounts_1 = require("../burst/accounts");
const assets_1 = require("./assets");
class AccountsComponent {
    constructor() {
        this.passPhrase = '';
        this.account = '';
        this.accountRS = '';
    }
    /**
     * Called when App.init() is called.
     */
    init() {
        console.log('Initializing AccountsComponents...');
        this.initjQuery();
        this.events();
    }
    getPassPhrase() { return this.passPhrase; }
    getAccount() { return this.account; }
    getAccountRS() { return this.accountRS; }
    /**
     * Set the account details
     * @param passPhrase
     * @param account
     * @param accountRS
     */
    setAll(passPhrase, account, accountRS) {
        this.passPhrase = passPhrase;
        this.account = account;
        this.accountRS = accountRS;
        this.$accountRs.text(`(${accountRS})`);
        assets_1.assetsComponents.updateAssets(account);
    }
    /**
     * Clear the account details
     */
    clear() {
        this.$accountRs.text('');
        this.passPhrase = '';
        this.account = '';
        this.accountRS = '';
        assets_1.assetsComponents.clear();
    }
    /**
     * Store the needed jQuery Objects
     */
    initjQuery() {
        this.$phrase = $('#phrase');
        this.$accountRs = $('.js-account-rs');
    }
    /**
     * Event handler
     */
    events() {
        this.$phrase.on('change', () => {
            let tempPhrase = this.$phrase.val();
            if (!tempPhrase.length) {
                this.clear();
                return false;
            }
            accounts_1.accountsApi.getAccountId(tempPhrase).then((account) => {
                this.setAll(tempPhrase, account.account, account.accountRS);
            }).catch(e => {
                this.clear();
                console.log(e);
            });
        });
    }
}
exports.accountsComponent = new AccountsComponent();
