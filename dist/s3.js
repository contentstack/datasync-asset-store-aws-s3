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
const validations_1 = require("./util/validations");
const debug = debug_1.default('s3');
class S3 {
    constructor(s3, config) {
        this.config = config.assetStore;
        this.s3 = s3;
    }
    download(asset) {
        return new Promise((resolve, reject) => {
            validations_1.validatePublishedAsset(asset);
            const out = request_1.default({ url: asset.url });
            out.on('response', response => {
                if (asset.download_id) {
                    let attachment = response.headers['content-disposition'];
                    asset.filename = decodeURIComponent(attachment.split('=')[1]);
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
        const patternKeys = this.extractDetails(asset);
        const uriPattern = path_1.join.apply(this, patternKeys);
        const pass = new stream_1.default.PassThrough();
        const params = lodash_1.cloneDeep(this.config.uploadParams);
        params.Key = uriPattern;
        params.Body = pass;
        this.s3.upload(params)
            .on('httpUploadProgress', debug)
            .promise()
            .then((s3Response) => {
            debug(`S3 asset upload response: ${JSON.stringify(s3Response)}`);
            asset.VersionId = s3Response.VersionId;
            asset.Location = s3Response.Location;
            asset.ETag = s3Response.ETag;
            asset.Key = s3Response.Key;
            asset.Bucket = this.config.bucketParams.Bucket;
            return resolve(asset);
        })
            .catch(reject);
        return pass;
    }
    delete(assets) {
        assets.forEach((asset) => validations_1.validateDeletedAsset(asset));
        const promisifiedBucket = [];
        assets.forEach((asset) => {
            promisifiedBucket.push((() => {
                return new Promise((resolve, reject) => {
                    return this.s3.deleteObject({
                        Bucket: this.config.bucketParams.Bucket,
                        Key: asset.Key
                    }, (error, response) => {
                        if (error) {
                            return reject(error);
                        }
                        debug(`S3 asset (${asset.uid}) response ${JSON.stringify(response)}`);
                        return resolve(asset);
                    });
                });
            })());
        });
        return Promise.all(promisifiedBucket);
    }
    unpublish(asset) {
        return new Promise((resolve, reject) => {
            validations_1.validateUnpublishedAsset(asset);
            return this.s3.deleteObject({
                Bucket: this.config.bucketParams.Bucket,
                Key: asset.Key
            }, (error, response) => {
                if (error) {
                    return reject(error);
                }
                debug(`S3 asset (${asset.uid}) response ${JSON.stringify(response)}`);
                return resolve(asset);
            });
        });
    }
    extractDetails(asset) {
        const values = [];
        const keys = this.config.patternKeys;
        const regexp = new RegExp('https://(assets|images).contentstack.io/(v[\\d])/assets/(.*?)/(.*?)/(.*?)/(.*)', 'g');
        let matches;
        while ((matches = regexp.exec(asset.url)) !== null) {
            if (matches && matches.length) {
                if (matches[2]) {
                    asset.apiVersion = matches[2];
                }
                if (matches[3]) {
                    asset.apiKey = matches[3];
                }
                if (matches[4]) {
                    asset.downloadId = matches[4];
                }
            }
        }
        debug(`extracting asset url from: ${JSON.stringify(asset)}.\nKeys expected from this asset are: ${JSON.stringify(keys)}`);
        for (let i = 0, keyLength = keys.length; i < keyLength; i++) {
            if (keys[i].charAt(0) === ':') {
                const k = keys[i].substring(1);
                if (asset[k]) {
                    values.push(asset[k]);
                }
                else {
                    throw new TypeError(`The key ${keys[i]} did not exist on ${JSON.stringify(asset)}`);
                }
            }
            else {
                values.push(keys[i]);
            }
        }
        return values;
    }
}
exports.S3 = S3;
