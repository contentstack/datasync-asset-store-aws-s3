"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = exports.setLogger = exports.getConfig = exports.setConfig = void 0;
const lodash_1 = require("lodash");
const config_1 = require("./config");
const s3_1 = require("./s3");
const setup_1 = require("./setup");
const logger_1 = require("./util/logger");
Object.defineProperty(exports, "setLogger", { enumerable: true, get: function () { return logger_1.setLogger; } });
const validations_1 = require("./util/validations");
let appConfig = {};
const setConfig = (config) => {
    appConfig = config;
};
exports.setConfig = setConfig;
const getConfig = () => {
    return appConfig;
};
exports.getConfig = getConfig;
const start = (config) => {
    return new Promise((resolve, reject) => {
        try {
            appConfig = (0, lodash_1.merge)(config_1.config, appConfig, config || {});
            (0, validations_1.validateConfig)(appConfig.assetStore);
            return (0, setup_1.init)(appConfig.assetStore)
                .then((awsInstance) => {
                const s3 = new s3_1.S3(awsInstance, appConfig);
                return resolve(s3);
            })
                .catch(reject);
        }
        catch (error) {
            return reject(error);
        }
    });
};
exports.start = start;
