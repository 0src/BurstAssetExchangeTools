"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const burst_1 = require("./burst");
class ServersApi extends burst_1.BurstApi {
    getBlockchainStatus() {
        const data = {
            requestType: 'getBlockchainStatus'
        };
        return this.get(data);
    }
}
exports.serversApi = new ServersApi();
