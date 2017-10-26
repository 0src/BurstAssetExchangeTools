import * as fsPath from 'fs-path';
import * as fs from 'fs';
import * as path from 'path';

const dataFile = 'data';

export class Database {
    private availableKeys = new Set<string>();
    private cachedData = new Map<string, any>();

    constructor() {
        // Get the list of keys (database files) that are available
        fsPath.find(path.resolve('data'), (filepath, stats, filename) => {
            // Validate that the file we are getting are JSON files.
            return (stats === 'file' && /\.json$/.test(filename));

        }, (err, list) => {
            if(err) return;

            list.files.map((file) => { return file.match(/[ \w]+?(?=\.)/)[0]; }).forEach(key => {
                this.availableKeys.add(key);
            });
        });
    }

    /**
     * Get all the keys stored
     * @returns {Promise}
     */
    keys() {
        return new Promise((resolve, reject) => {
            const tmpKeys = [];
            this.availableKeys.forEach(key => tmpKeys.push(key));

            resolve(tmpKeys);
        });
    }

    /**
     * Check if this key exists for the database
     * @param {string} key
     */
    has(key: string) {
        return this.availableKeys.has(key);
    }

    /**
     * Get the content from a key
     * @param {string} key
     * @returns {Promise<any>}
     */
    get(key: string) {
        return new Promise((resolve, reject) => {
            if(this.cachedData.has(key)) {
                return resolve(this.cachedData.get(key));
            }

            if(!fs.existsSync(path.resolve(dataFile, `${key}.json`))) {
                return reject();
            }

            try {
                resolve(JSON.parse(fs.readFileSync(path.resolve(dataFile, `${key}.json`), 'utf8')));
            } catch(e) {
                console.log(e);
                reject({error: "JSON file is corrupted.", errorCode: Database.ERROR.CORRUPTED_FILE});
            }
        });
    }

    /**
     * Set content for a key
     * @param {string} key
     * @param data
     */
    set(key: string, data) {
        return new Promise((resolve, reject) => {
            this.availableKeys.add(key);
            this.cachedData.set(key, data);
            fsPath.writeFile(path.resolve(dataFile, `${key}.json`), JSON.stringify(data, null, '\t'), err => {
                if(err) {
                    console.log(err);
                    this.availableKeys.delete(key);
                    this.cachedData.delete(key);
                    reject();
                }

                resolve();
            });
        });
    }



}

export module Database {
    export enum ERROR {
        CORRUPTED_FILE
    }
}

export const database = new Database();