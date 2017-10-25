/**
 * Asset Interface
 * @version 1.0.0
 * @author Zeus <https://github.com/GoldZeus>
 */

import {BurstResponseGlobalInterface} from "./global";

export interface AssetInterface extends BurstResponseGlobalInterface {
    quantityQNT: string;
    numberOfAccounts: number;
    accountRS: string;
    decimals: number;
    numberOfTransfers: number;
    name: string;
    description: string;
    numberOfTrades: number;
    asset: string;
    account: string;
}

export interface AccountAssets {
    quantityQNT: string;
    accountRS: string;
    unconfirmedQuantityQNT: string;
    asset: string;
    account: string;
}

export interface AccountAssetsResponse extends BurstResponseGlobalInterface {
    accountAssets: AccountAssets[];
}