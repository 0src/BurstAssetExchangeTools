"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fsPath = require("fs-path");
const path = require("path");
const assets_1 = require("../components/assets");
class History {
    save(type, data) {
        if (type === 'summary') {
            this.d = new Date();
        }
        fsPath.writeFile(path.resolve('history', `${assets_1.assetsComponents.getCurrentAsset().asset}/${this.d.getFullYear()}.${this.d.getMonth() + 1}.${this.d.getDay()}.${this.d.getHours()}.${this.d.getMinutes()}.${this.d.getSeconds()}.${type}.txt`), data, console.log);
    }
}
exports.history = new History();
