import {accountsApi} from "../burst/accounts";
import {AccountIdInterface} from "../burst/interfaces/accounts";
import {assetsComponents} from "./assets";

declare const $;

class AccountsComponent {
    private passPhrase = '';
    private account = '';
    private accountRS = '';
    private $phrase;
    private $accountRs;

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
    private setAll(passPhrase, account, accountRS) {
        this.passPhrase = passPhrase;
        this.account = account;
        this.accountRS = accountRS;
        this.$accountRs.text(`(${accountRS})`);

        assetsComponents.updateAssets(account);
    }

    /**
     * Clear the account details
     */
    private clear() {
        this.$accountRs.text('');
        this.passPhrase = '';
        this.account = '';
        this.accountRS = '';

        assetsComponents.clear();
    }

    /**
     * Store the needed jQuery Objects
     */
    private initjQuery() {
        this.$phrase = $('#phrase');
        this.$accountRs = $('.js-account-rs');
    }

    /**
     * Event handler
     */
    private events() {
        this.$phrase.on('change', () => {
            let tempPhrase = this.$phrase.val();

            if(!tempPhrase.length) {
                this.clear();
                return false;
            }

            accountsApi.getAccountId(tempPhrase).then((account: AccountIdInterface) => {
                this.setAll(tempPhrase, account.account, account.accountRS);

            }).catch(e => {
                this.clear();
                console.log(e);
            });
        });
    }
}

export const accountsComponent = new AccountsComponent();