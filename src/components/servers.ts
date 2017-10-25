import * as prm from 'es6-promise';
import * as storage from 'electron-json-storage';

import {burstApiConfig, defaultWallets} from "../burst/burst";
import {serversApi} from "../burst/servers";
import {BlockchainStatusResponseInterface} from "../burst/interfaces/server";

const Promise = prm.Promise;
declare const $;

class ServersComponents {
    $connecting;
    $connected;
    $server;
    $height;
    $inputServerUrl;
    $btnSaveServer;
    $modalEditServer;
    firstCall = true;
    storageKey = 'wallet-server';
    currentWallet = '';

    constructor() {
        burstApiConfig.wallets = defaultWallets;

        storage.get(this.storageKey, (err, data) => {
            if(err || !data.length) return;

            this.setWallet(data);
        });
    }

    /**
     * Called when App.init() is called.
     * @returns {Promise}
     */
    init() {
        console.log('Initializing ServersComponents...');

        this.initjQuery();
        this.events();

        this.$inputServerUrl.val(this.currentWallet);

        return this.getBlockInfo();
    }

    getBlockInfo() {
        return new Promise((resolve, reject) => {
            serversApi.getBlockchainStatus().then((status: BlockchainStatusResponseInterface) => {
                this.$server.text(burstApiConfig.currentWallet.replace(/(^\w+:|^)\/\//, '').split(':')[0]);
                this.$height.text(status.lastBlockchainFeederHeight);

                if(this.firstCall) {
                    this.$connecting.hide();
                    this.$connected.show();

                    this.firstCall = false;
                }

                resolve();
            }).catch(e => {
                console.log(e);

                this.$server.text('Unable to connect to server...');
                this.$height.text('');

                if(this.firstCall) {
                    this.$connecting.hide();
                    this.$connected.show();

                    this.firstCall = false;
                }

                reject(e);
            });
        });
    }

    private initjQuery() {
        this.$connecting = $('.js-wallet-connecting');
        this.$connected = $('.js-wallet-details');
        this.$server = $('.js-connected-server');
        this.$height = $('.js-block-height');
        this.$inputServerUrl = $('.js-server-url');
        this.$btnSaveServer = $('.js-save-server');
        this.$modalEditServer = $('#editServerModal');
    }

    private setWallet(walletArr: string[]) {
        burstApiConfig.wallets = walletArr;
        burstApiConfig.currentWalletIndex = 0;
        burstApiConfig.currentWallet = walletArr[0];
        this.currentWallet = walletArr[0];
        this.$inputServerUrl.val(this.currentWallet);

        this.getBlockInfo().catch(e => { console.log(e) });
    }

    private saveWallet(walletArr: string[]) {
        storage.set(this.storageKey, walletArr);
        this.setWallet(walletArr);
    }
    private clearWallets() {
        storage.remove(this.storageKey);
        this.setWallet(defaultWallets);

        this.$inputServerUrl.val('');

        this.getBlockInfo().catch(e => { console.log(e) });
    }

    private events() {
        this.$btnSaveServer.on('click', e => {
            e.preventDefault();

            let serverURI = $.trim(this.$inputServerUrl.val());

            if(this.$inputServerUrl.hasClass('invalid')) {
                return alert('Incorrect wallet server.');
            }

            if(!serverURI.length) {
                this.clearWallets();
            } else {
                serverURI = serverURI.split('/index.html')[0];

                if(serverURI.indexOf('/burst') === -1) {
                    serverURI += '/burst'
                }

                this.saveWallet([serverURI]);
            }

            this.$modalEditServer.modal('close');
        });
    }
}
export const serversComponents = new ServersComponents();