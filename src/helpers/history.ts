import * as path from 'path';
import * as fs from 'fs';

import {assetsComponents} from "../components/assets";

export class History {
    static save(type: 'summary'|'result', data: string) {
        fs.writeFile(path.resolve('history', `${type}-${assetsComponents.getCurrentAsset().asset} [${new Date().toJSON().split('.')[0]}].txt`), data, console.log);
    }
}