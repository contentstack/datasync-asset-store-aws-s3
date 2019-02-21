"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    assetStore: {
        pattern: '/:uid/:filename',
        region: 'us-east-1',
        apiVersion: '2006-03-01',
        bucketParams: {
            ACL: 'public-read'
        },
        uploadParams: {
            ACL: 'public-read'
        },
        CORSConfiguration: {
            CORSRules: [
                {
                    AllowedHeaders: ['Authorization'],
                    AllowedMethods: ['PUT', 'POST', 'GET', 'DELETE'],
                    AllowedOrigins: ['*'],
                    ExposeHeaders: [],
                    MaxAgeSeconds: 3000
                }
            ]
        },
        Policy: {
            Version: '2012-10-17',
            Statement: [
                {
                    Sid: 'AddPerm',
                    Effect: 'Allow',
                    Principal: '*',
                    Action: ['s3:GetObject'],
                }
            ]
        },
        assetFolderPrefixKey: 'v3/assets',
    }
};
