"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assets_1 = require("../burst/assets");
class AssetsComponents {
    constructor() {
        this.assets = [];
        this.currentAsset = null;
        /**
         * Web Workers
         */
        this.worker = operative({
            assetsToOptions: (assets, cb) => {
                let html = '';
                assets.forEach((asset) => {
                    html += `<option value="${asset.asset}">${asset.name}</option>`;
                });
                cb(html);
            }
        });
    }
    /**
     * Called inside App.init()
     */
    init() {
        console.log('Initializing AssetsComponents...');
        this.initjQuery();
        this.events();
    }
    getCurrentAsset() {
        return this.currentAsset;
    }
    updateOptions() {
        this.worker.assetsToOptions(this.assets, (html) => {
            this.$asset.html(html).material_select();
        });
    }
    updateAssets(account) {
        assets_1.assetExchangeApi.getAssetsByIssuer(account).then((result) => {
            if (result.errorCode) {
                return this.clear();
            }
            const tempAsset = result.assets[0];
            this.assets = tempAsset;
            this.currentAsset = tempAsset[0];
            this.updateOptions();
        });
    }
    clear() {
        this.assets = [];
        this.currentAsset = null;
        this.$asset.html('<option value="" selected disabled>- NONE -</option>').material_select();
    }
    /**
     * Store the needed jQuery Objects
     */
    initjQuery() {
        this.$asset = $('#asset');
    }
    events() {
        this.$asset.on('change', () => {
            this.currentAsset = this.assets[this.$asset.find('option:selected').index()];
        });
    }
}
exports.assetsComponents = new AssetsComponents();
