import {AssetInterface} from "../burst/interfaces/assets";
import {assetExchangeApi} from "../burst/assets";

declare const $, operative;

class AssetsComponents {
    private assets: AssetInterface[] = [];
    private currentAsset: AssetInterface = null;
    private $asset;

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

    /**
     * Web Workers
     */
    private worker = operative({
        assetsToOptions: (assets: AssetInterface[], cb) => {
            let html = '';

            assets.forEach((asset: AssetInterface) => {
                html += `<option value="${asset.asset}">${asset.name}</option>`;
            });

            cb(html);
        }
    });

    private updateOptions() {
        this.worker.assetsToOptions(this.assets, (html: string) => {
            this.$asset.html(html).material_select();
        });
    }

    updateAssets(account: string) {
        assetExchangeApi.getAssetsByIssuer(account).then((result) => {
            if(result.errorCode) {
                return this.clear();
            }
            const tempAsset: AssetInterface[] = result.assets[0];

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
    private initjQuery() {
        this.$asset = $('#asset');
    }

    private events() {
        this.$asset.on('change', () => {
            this.currentAsset = this.assets[this.$asset.find('option:selected').index()];
        });
    }
}
export const assetsComponents = new AssetsComponents();