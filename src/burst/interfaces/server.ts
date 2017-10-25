/**
 * Server Interfaces
 * @version 1.0.0
 * @author Zeus <https://github.com/GoldZeus>
 */
import {BurstResponseGlobalInterface} from "./global";

export interface BlockchainStatusResponseInterface extends BurstResponseGlobalInterface {
    lastBlock: string;
    application: string;
    isScanning: boolean;
    cumulativeDifficulty: string;
    lastBlockchainFeederHeight: number;
    numberOfBlocks: number;
    time: number;
    requestProcessingTime: number;
    version: string;
    lastBlochainFeeder: string;
}