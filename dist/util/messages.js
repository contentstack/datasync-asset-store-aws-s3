"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERRORS = exports.MESSAGES = void 0;
exports.MESSAGES = {
    CONNECTION_CLOSED: (status) => `Connection closed. Status: ${JSON.stringify(status)}`,
    S3_UPLOAD_RESPONSE: (response) => `S3 asset upload response: ${JSON.stringify(response)}`,
    S3_ASSET_RESPONSE: (uid, response) => `S3 asset: ${uid} response: ${JSON.stringify(response)}`,
    EXTRACTING_ASSET_URL: (asset, keys) => `Extracting asset URL from: ${JSON.stringify(asset)}. Keys expected from this asset are: ${JSON.stringify(keys)}`,
    FACTORY_CONFIG: (config) => `Factory config: ${JSON.stringify(config)}`,
    FACTORY_RESULT: (result) => `Result: ${JSON.stringify(result)}`,
    HELLO_WORLD: 'Hello world!',
};
exports.ERRORS = {
    KEY_NOT_FOUND: (key, asset) => `The key '${key}' does not exist on: ${JSON.stringify(asset)}`,
};
