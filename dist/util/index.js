"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildAWSConfig = exports.formatConfig = void 0;
const lodash_1 = require("lodash");
const patternInterpretation = (config) => {
    return (0, lodash_1.compact)(config.pattern.split('/'));
};
const formatConfig = (config) => {
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
exports.formatConfig = formatConfig;
const buildAWSConfig = (config) => {
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
exports.buildAWSConfig = buildAWSConfig;
