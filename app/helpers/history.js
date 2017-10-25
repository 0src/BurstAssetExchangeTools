"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const assets_1 = require("../components/assets");
class History {
    static save(type, data) {
        fs.writeFile(path.resolve('history', `${type}-${assets_1.assetsComponents.getCurrentAsset().asset} [${new Date().toJSON().split('.')[0]}].txt`), data, console.log);
    }
}
exports.History = History;
