import {calculatorComponent} from "./calculator";
import {accountsApi} from "../burst/accounts";
import {accountsComponent} from "./accounts";
import {assetsComponents} from "./assets";
import {history} from "../helpers/history";
import {database} from "../helpers/database";

declare const $;

class ActivatorComponent {
    private toPay;
    private toStore;

    private $activate;
    private $result;

    init() {
        this.initjQuery();
        this.events();
    }

    private activate() {
        $('input, select, button').attr('disabled', 'disabled');
        this.toPay = calculatorComponent.getToPay();
        this.toStore = calculatorComponent.getToStore();

        history.save('summary', this.$result.text());

        this.$result.text('Amount paid, Account, TX\n');
        this.send();
    }

    private send(index = 0) {
        const account = this.toPay[index];

        const recipient = account.accountRS;
        const amount = account.amountToSend;

        accountsApi.sendMoney(accountsComponent.getPassPhrase(), recipient, amount, `[${new Date().toLocaleString()}] ${assetsComponents.getCurrentAsset().name} Dividends Payment`).then(result => {
            if(result.errorCode) {
                this.$result.text(this.$result.text() + `Error Sending ${account.amountToSend} to ${account.accountRS}. ${result.errorDescription}.\n`);
            } else if(result.transaction) {
                this.$result.text(this.$result.text() + `${account.amountToSend}, ${account.accountRS}, ${result.transaction}\n`);
            } else {
                console.log(result);
            }

            if(this.toPay.length > ++index) {
                setTimeout(() => {
                    this.send(index);
                }, 100);
            } else {
                this.$result.text(this.$result.text() + `----------- All transactions processed --------\n`);
                this.store();
            }

            this.$result.scrollTop(this.$result[0].scrollHeight - this.$result.height());
        }).catch((e) => {
            this.$result.text(this.$result.text() + 'Unable to conect to the wallet API.\n');
            console.log(e);
        });
    }

    private store() {
        database.set(assetsComponents.getCurrentAsset().asset, this.toStore).then(() => {
            $('input, select, button').removeAttr('disabled');
            this.$activate.attr('disabled', 'disabled');
        }).catch( err => {
            console.log(err);

            let html = '';
            this.toStore.forEach((account) => {
                html += `${account.accountRS}, ${account.amountToSend}\n`;
            });
            this.$result.text(this.$result.text() + `----------------------\nUnable to save deferred data:\n${html}`);

            $('input, select, button').removeAttr('disabled');
            this.$activate.attr('disabled', 'disabled');
        });
        history.save('result', this.$result.text());
    }

    private initjQuery() {
        this.$activate = $('.js-activate');
        this.$result = $('#result');
    }
    private events() {
        this.$activate.on('click', e => {
            e.preventDefault();

            this.activate();
        });
    }
}
export const activatorComponent = new ActivatorComponent();