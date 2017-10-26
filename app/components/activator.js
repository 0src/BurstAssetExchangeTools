"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const calculator_1 = require("./calculator");
const accounts_1 = require("../burst/accounts");
const accounts_2 = require("./accounts");
const assets_1 = require("./assets");
const history_1 = require("../helpers/history");
const database_1 = require("../helpers/database");
class ActivatorComponent {
    init() {
        this.initjQuery();
        this.events();
    }
    activate() {
        $('input, select, button').attr('disabled', 'disabled');
        this.toPay = calculator_1.calculatorComponent.getToPay();
        this.toStore = calculator_1.calculatorComponent.getToStore();
        history_1.history.save('summary', this.$result.text());
        this.$result.text('Amount paid, Account, TX\n');
        this.send();
    }
    send(index = 0) {
        const account = this.toPay[index];
        const recipient = account.accountRS;
        const amount = account.amountToSend;
        accounts_1.accountsApi.sendMoney(accounts_2.accountsComponent.getPassPhrase(), recipient, amount, `[${new Date().toLocaleString()}] ${assets_1.assetsComponents.getCurrentAsset().name} Dividends Payment`).then(result => {
            if (result.errorCode) {
                this.$result.text(this.$result.text() + `Error Sending ${account.amountToSend} to ${account.accountRS}. ${result.errorDescription}.\n`);
            }
            else if (result.transaction) {
                this.$result.text(this.$result.text() + `${account.amountToSend}, ${account.accountRS}, ${result.transaction}\n`);
            }
            else {
                console.log(result);
            }
            if (this.toPay.length > ++index) {
                setTimeout(() => {
                    this.send(index);
                }, 100);
            }
            else {
                this.$result.text(this.$result.text() + `----------- All transactions processed --------\n`);
                this.store();
            }
            this.$result.scrollTop(this.$result[0].scrollHeight - this.$result.height());
        }).catch((e) => {
            this.$result.text(this.$result.text() + 'Unable to conect to the wallet API.\n');
            console.log(e);
        });
    }
    store() {
        database_1.database.set(assets_1.assetsComponents.getCurrentAsset().asset, this.toStore).then(() => {
            $('input, select, button').removeAttr('disabled');
            this.$activate.attr('disabled', 'disabled');
        }).catch(err => {
            console.log(err);
            let html = '';
            this.toStore.forEach((account) => {
                html += `${account.accountRS}, ${account.amountToSend}\n`;
            });
            this.$result.text(this.$result.text() + `----------------------\nUnable to save deferred data:\n${html}`);
            $('input, select, button').removeAttr('disabled');
            this.$activate.attr('disabled', 'disabled');
        });
        history_1.history.save('result', this.$result.text());
    }
    initjQuery() {
        this.$activate = $('.js-activate');
        this.$result = $('#result');
    }
    events() {
        this.$activate.on('click', e => {
            e.preventDefault();
            this.activate();
        });
    }
}
exports.activatorComponent = new ActivatorComponent();
