"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const path_1 = require("path");
const lodash_1 = require("lodash");
const request_1 = __importDefault(require("request"));
const stream_1 = __importDefault(require("stream"));
const debug = debug_1.default('s3-core');
class S3 {
    constructor(s3, config) {
        this.appConfig = config;
        this.config = config.assetStore;
        this.s3 = s3;
    }
    download(asset) {
        return new Promise((resolve, reject) => {
            const out = request_1.default({ url: asset.data.url });
            out.on('response', response => {
                if (asset.data.download_id) {
                    let attachment = response.headers['content-disposition'];
                    asset.data.filename = decodeURIComponent(attachment.split('=')[1]);
                }
            })
                .pipe(this.uploadStream(asset, resolve, reject))
                .on('error', reject)
                .on('close', status => {
                debug(`Connection closed. Status: ${JSON.stringify(status)}`);
                return resolve(asset);
            })
                .end();
        });
    }
    uploadStream(asset, resolve, reject) {
        const folderPath = this.extractFolderPaths(asset);
        const folderKey = path_1.join.apply(this, folderPath);
        const pass = new stream_1.default.PassThrough();
        const params = lodash_1.cloneDeep(this.config.uploadParams);
        params.Key = folderKey;
        params.Body = pass;
        this.s3.upload(params)
            .on('httpUploadProgress', debug)
            .promise()
            .then((s3Response) => {
            debug(`S3 asset upload response: ${JSON.stringify(s3Response)}`);
            asset.VersionId = s3Response.VersionId;
            asset.Location = s3Response.Location;
            asset.ETag = s3Response.ETag;
            return resolve(asset);
        })
            .catch(reject);
        return pass;
    }
    extractFolderPaths(asset) {
        const values = [];
        const keys = this.config.keys;
        if (this.config.assetFolderPrefixKey && typeof this.config.assetFolderPrefixKey === 'string') {
            values.push(this.config.assetFolderPrefixKey);
        }
        const regexp = new RegExp('https://(assets|images).contentstack.io/(v[\\d])/assets/(.*?)/(.*?)/(.*?)/(.*)', 'g');
        let matches;
        while ((matches = regexp.exec(asset.data.url)) !== null) {
            if (matches && matches.length) {
                if (matches[2]) {
                    asset.data.apiVersion = matches[2];
                }
                if (matches[3]) {
                    asset.data.apiKey = matches[3];
                }
                if (matches[4]) {
                    asset.data.downloadId = matches[4];
                }
            }
        }
        debug(`extracting asset url from: ${JSON.stringify(asset.data)}.\nKeys expected from this asset are: ${JSON.stringify(keys)}`);
        for (let i = 0, keyLength = keys.length; i < keyLength; i++) {
            if (asset.data[keys[i]]) {
                values.push(asset.data[keys[i]]);
            }
            else {
                throw new TypeError(`The key ${keys[i]} did not exist on ${JSON.stringify(asset.data)}`);
            }
        }
        return values;
    }
}
exports.S3 = S3;
