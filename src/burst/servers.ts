import {BurstApi} from "./burst";

class ServersApi extends BurstApi {
    getBlockchainStatus() {
        const data = {
            requestType: 'getBlockchainStatus'
        };

        return this.get(data);
    }
}

export const serversApi = new ServersApi();