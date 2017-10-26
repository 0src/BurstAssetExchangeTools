import * as Materialize from 'materialize-css';

import {burstApiConfig, defaultWallets} from "../burst/burst";
import {serversApi} from "../burst/servers";
import {BlockchainStatusResponseInterface} from "../burst/interfaces/server";
import {database} from "../helpers/database";

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
    storageKey = 'server.config';
    currentWallet = '';

    constructor() {
        burstApiConfig.wallets = defaultWallets;

        database.get(this.storageKey).then((data: string[]) => {
            if(!data.length) return;

            this.setWallet(data);
        }).catch(err => {
            console.log(err);
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
        this.$inputServerUrl.val(this.currentWallet.split('/burst')[0]);

        this.getBlockInfo().catch(e => { console.log(e) });
    }

    private saveWallet(walletArr: string[]) {
        console.log(walletArr);
        // TODO: Setting the default server to the database isn't working, is it an error in the filename or what is going on?
        database.set(this.storageKey, walletArr).then().catch(e => {
            console.log(e);
        });
        this.setWallet(walletArr);
    }
    private clearWallets() {
        database.set(this.storageKey, []);
        this.setWallet(defaultWallets);

        this.$inputServerUrl.val('');

        this.getBlockInfo().catch(e => { console.log(e) });
    }

    private events() {
        this.$btnSaveServer.on('click', e => {
            e.preventDefault();

            let serverURI = $.trim(this.$inputServerUrl.val());

            if(this.$inputServerUrl.hasClass('invalid')) {
                return Materialize.toast('Incorrect wallet server.', 3000);
            }

            if(!serverURI.length) {
                this.clearWallets();
            } else {
                serverURI = serverURI.split('/index.html')[0];

                if(serverURI.indexOf(':') === -1) {
                    Materialize.toast('Missing :PORT', 3000);
                }

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