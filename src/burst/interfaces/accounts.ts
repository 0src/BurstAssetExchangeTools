/**
 * Accounts Interface
 * @version 1.0.0
 * @author Zeus <https://github.com/GoldZeus>
 */

import {BurstResponseGlobalInterface} from "./global";

export interface AccountIdInterface extends BurstResponseGlobalInterface {
    account: string;
    accountRS: string;
    publicKey: string;
}