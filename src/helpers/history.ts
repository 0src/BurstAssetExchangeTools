import * as fsPath from 'fs-path';
import * as path from 'path';
import {assetsComponents} from "../components/assets";

class History {
    d: Date;

    save(type: 'summary'|'result', data: string) {
        if(type === 'summary') {
            this.d = new Date();
        }

        fsPath.writeFile(path.resolve('history', `${assetsComponents.getCurrentAsset().asset}/${this.d.getFullYear()}.${this.d.getMonth()+1}.${this.d.getDay()}.${this.d.getHours()}.${this.d.getMinutes()}.${this.d.getSeconds()}.${type}.txt`), data, console.log);
    }
}

export const history = new History();