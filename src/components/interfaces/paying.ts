import {DeferredAccountInterface} from "./deferred";

export interface PayingAccountInterface extends DeferredAccountInterface {
    assets: number;
}