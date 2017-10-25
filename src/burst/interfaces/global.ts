/**
 * BurstApi response global interface
 * All burst api interfaces need to extends this.
 * @version 1.0.0
 * @author Zeus <https://github.com/GoldZeus>
 */
export interface BurstResponseGlobalInterface {
    errorDescription: string;
    errorCode: string;
    requestProcessingTime: number;
}