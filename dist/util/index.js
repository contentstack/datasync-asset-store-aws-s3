"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const patternInterpretation = (config) => {
    return lodash_1.compact(config.pattern.split('/'));
};
exports.formatConfig = (config) => {
    const bucket = config.bucketParams;
    if (bucket.name) {
        bucket.Bucket = bucket.name;
        delete bucket.name;
    }
    if (typeof bucket.ACL !== 'string') {
        bucket.ACL = 'public-read-write';
    }
    config.bucketName = bucket.Bucket;
    config.uploadParams.Bucket = bucket.Bucket;
    config.region = config.region || process.env.AWS_REGION;
    config.apiVersion = config.apiVersion || 'latest';
    config.patternKeys = patternInterpretation(config);
    return config;
};
exports.buildAWSConfig = (config) => {
    const awsConfig = {
        apiVersion: config.apiVersion,
        region: config.region
    };
    if (process.env.AWS_ACCESS_KEY_ID || (config.credentials && config.credentials.accessKeyId)) {
        awsConfig.accessKeyId = process.env.AWS_ACCESS_KEY_ID || config.credentials.accessKeyId;
    }
    if (process.env.AWS_SECRET_ACCESS_KEY || (config.credentials && config.credentials.secretAccessKey)) {
        awsConfig.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || config.credentials.secretAccessKey;
    }
    return awsConfig;
};
