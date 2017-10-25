import * as storage from 'electron-json-storage';
import {assetExchangeApi} from "../burst/assets";
import {AccountAssetsResponse, AssetInterface} from "../burst/interfaces/assets";
import {assetsComponents} from "./assets";
import {accountsComponent} from "./accounts";
import * as prm from 'es6-promise';

const Promise = prm.Promise;

declare const operative, $;

export class CalculatorComponent {
    private toStore = [];
    private toPay = [];
    private amountToPay = 0;

    private $amount;
    private $payGreater;
    private $exclude;
    private $issuerPay;
    private $subFee;
    private $asset;
    private $calculate;
    private $result;

    /**
     * Called inside App.init()
     */
    init() {
        this.initjQuery();
        this.events();
    }

    getToPay() { return this.toPay; }
    getToStore() { return this.toStore; }
    getAmountToPay() { return this.amountToPay; }

    /**
     * Web Workers
     */
    private workers = operative({
        merge: (oldAssets, newAssets, cb) => {
            for(let i = 0, j = oldAssets.length; i < j; i++) {
                for(let k = 0, l = newAssets.length; k < l; k++) {
                    if(oldAssets[i].account === newAssets[k].account) {
                        newAssets[k].amountToSend = +oldAssets[i].amountToSend;
                    }
                }
            }

            return cb(newAssets);
        },

        removeExcluded: (accounts, excludes, cb) => {
            let result = [];
            let totalAssets = 0;
            for (let i = 0, j = accounts.length; i < j; i++) {
                const account = accounts[i];

                let isExcluded = false;
                for(let k = 0, l = excludes.length; k < l; k++) {
                    const exclude = excludes[k];

                    if(exclude === account.accountRS || exclude === account.account) {
                        isExcluded = true;
                        break;
                    }
                }

                if(!isExcluded) {
                    totalAssets += +account.quantityQNT;
                    result.push(account);
                }
            }

            cb(result, totalAssets);
        },

        cleanToPay: (accounts, totalAssets, amount, payGreater, cb) => {
            const toEightDecimals = (e) => {
                return +e.toString().match(/^-?\d+(?:\.\d{0,8})?/)[0];
            };

            let toPay = [];
            let toStore = [];
            let tmpAssets = 0;
            //let dec = 0 // Math.pow(10, 8 - decimals);

            for(let i = 0, j = accounts.length; i < j; i++) {
                const account = accounts[i];
                const assets = (account.quantityQNT)?  +account.quantityQNT : account.assets;
                const percent = assets / totalAssets;
                const prevAmount = account.amountToSend || 0;

                const amountToSend = toEightDecimals((percent * amount) + (+prevAmount));

                if(amountToSend > payGreater) {
                    toPay.push({account: account.account, accountRS: account.accountRS, assets, amountToSend: prevAmount });
                    tmpAssets += +assets;
                } else {
                    toStore.push({account: account.account, accountRS: account.accountRS, amountToSend});
                }
            }

            cb(toPay, toStore, tmpAssets);
        },

        calculatePayout: (toPay, amount, totalAssets, cb) => {
            const toEightDecimals = (e) => {
                return +e.toString().match(/^-?\d+(?:\.\d{0,8})?/)[0];
            };


            for(let i = 0, j = toPay.length; i < j; i++) {
                const percent = toPay[i].assets / totalAssets;

                toPay[i].amountToSend = toEightDecimals((percent * amount) + toPay[i].amountToSend);
            }

            cb(toPay);
        }
    });

    private calculate() {
        let tmpAmount = +this.$amount.val();
        let tmpPayGreater = +this.$payGreater.val();
        let tmpExclude = this.$exclude.val().split(' ').join('').split(',');
        let tmpSubFee = this.$subFee.is(':checked');
        let tmpIssuerPay = this.$issuerPay.is(':checked');
        let tmpToDistribute = 0;
        let tmpDecimals = assetsComponents.getCurrentAsset().decimals;

        let tmpOldAssets = [];
        tmpExclude.push('BURST-NU58-Z4QR-XXKE-94DHH');

        if(isNaN(tmpAmount) || !tmpAmount) {
            return alert('Set the amount to pay.');
        }

        $('input, select, button').attr('disabled', 'disabled');

        this.getStore(assetsComponents.getCurrentAsset().asset).then((oldAssets) => {
            tmpOldAssets = oldAssets || [];
            return this.getAssetData();
        }).then((newAssets) => {

            return this.merge(tmpOldAssets, newAssets);
        }).then((assets: AssetInterface) => {
            if(tmpIssuerPay) {
                tmpExclude.push(accountsComponent.getAccount());
            }

            return this.removeExcluded(assets, tmpExclude);
        }).then(result => {
            return this.cleanToPay(result.accounts, result.totalAssets, tmpAmount, tmpPayGreater);
        }).then(result => {
            if (tmpSubFee) {
                tmpAmount -= result.toPay.length;
            }
            this.toStore = result.toStore;

            return this.cleanToPay(result.toPay, result.totalAssets, tmpAmount, tmpPayGreater);
        }).then(result => {
            this.toStore = this.toStore.concat(result.toStore);

            tmpToDistribute = result.totalAssets;

            return this.calculatePayout(result.toPay, tmpAmount, result.totalAssets);
        }).then(toPay => {
            this.toPay = toPay;
            this.amountToPay = tmpAmount;

            const pow = Math.pow(10, 8 - tmpDecimals);

            let accountHmtl = '';
            toPay.forEach((account) => {
                const assets = (tmpDecimals > 0)? account.assets / pow : account.assets ;
                accountHmtl += `${assets}, ${account.accountRS}, ${account.amountToSend}\n`;
            });

            let postponed = '';
            this.toStore.forEach((account) => {
                postponed += `${account.accountRS}, ${account.amountToSend}\n`;
            });

            let totalAssets = +assetsComponents.getCurrentAsset().quantityQNT;
            if(tmpDecimals > 0) {
                totalAssets /= pow;
                tmpToDistribute /= pow;
            }

            this.$result.text(`${assetsComponents.getCurrentAsset().name} (${assetsComponents.getCurrentAsset().asset}) Total found assets: ${totalAssets}, Assets to be distributed: ${tmpToDistribute}
Summary of proposed distribution of ${tmpAmount}BURST to ${toPay.length} accounts.
Based on asset holders at timestamp ${new Date().getTime() / 1000} (${new Date().toString()})
-----------------------------
Number of assets, Account, Payout amount
${accountHmtl}
-----------------------------
Deferred accounts
-----------------------------
Account, Payout amount
${postponed}`);

            $('input, select, button').removeAttr('disabled');
        }).catch((e) => {
            $('input, select, button').removeAttr('disabled');
            $('.js-activate').attr('disabled', 'disabled');
            console.log(e);
        });
    }

    private calculatePayout(toPay, amount, totalAssets) {
        return new Promise((resolve, reject) => {
            this.$result.text(this.$result.text() + 'Completing result...\n');
            this.workers.calculatePayout(toPay, amount, totalAssets, (toPay) => {
                resolve(toPay);
            });
        });
    }

    private cleanToPay(accounts, totalAssets, amount, payGreater) {
        return new Promise((resolve, reject) => {
            this.$result.text(this.$result.text() + `Removing lower than ${payGreater}...\n`);
            this.workers.cleanToPay(accounts, totalAssets, amount, payGreater, (toPay, toStore, totalAssets) => {
                resolve({toPay, toStore, totalAssets});
            });
        });
    }

    private removeExcluded(assets, exclude) {
        return new Promise((resolve, reject) => {
            this.$result.text(`${this.$result.text()}Processing ${assets.length} accounts and removing excluded...\n`);
            this.workers.removeExcluded(assets, exclude, (accounts, totalAssets, allAssets) => {
                resolve({accounts, totalAssets, allAssets});
            });
        });
    }

    private merge(oldAssets, newAssets) {
        return new Promise((resolve, reject) => {
            this.$result.text(this.$result.text() + 'Calculating old unpaid accounts with new data...\n');
            this.workers.merge(oldAssets, newAssets, (assets) => {
                resolve(assets);
            });
        });
    }

    private getAssetData() {
        return new Promise((resolve, reject) => {
            assetExchangeApi.getAssetAccounts(assetsComponents.getCurrentAsset().asset).then((response: AccountAssetsResponse) => {
                if(response.accountAssets) {
                    resolve(response.accountAssets);
                } else {
                    console.log(response);
                    reject(response.errorDescription);
                }
            });
        });
    }

    private getStore(assetId) {
        return new Promise((resolve, reject) => {
            storage.get(assetId, (err, data) => {
                if(err) {
                    console.log(err);
                    return resolve();
                }

                resolve(data);
            });
        });
    }

    private initjQuery() {
        this.$amount = $('#amount');
        this.$payGreater = $('#payGreater');
        this.$exclude = $('#exclude');
        this.$subFee = $('#subFee');
        this.$asset = $('#asset');
        this.$calculate = $('.js-calculate');
        this.$issuerPay = $('#issuerPay');
        this.$result = $('#result');
    }
    private events() {
        this.$calculate.on('click', e => {
            e.preventDefault();

            this.calculate();
        });
    }
}

export const calculatorComponent = new CalculatorComponent();