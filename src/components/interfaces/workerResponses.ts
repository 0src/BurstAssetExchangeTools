/**
 * Interfaces for each worker response
 */
import {PayingAccountInterface} from "./paying";
import {DeferredAccountInterface} from "./deferred";
import {AccountAssetsResponse} from "../../burst/interfaces/assets";

export interface MergedDeferredAndAccounts extends DeferredAccountInterface, AccountAssetsResponse {

}

export interface RemoveExcludedResponseInterface {
    accounts: string[];
    totalAssets: number;
}

export interface CleanToPayResponseInterface {
    toPay: PayingAccountInterface[];
    toStore: DeferredAccountInterface[];
    totalAssets: number;
}