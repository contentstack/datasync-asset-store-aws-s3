export declare const config: {
    assetStore: {
        pattern: string;
        region: string;
        apiVersion: string;
        bucketParams: {
            ACL: string;
        };
        uploadParams: {
            ACL: string;
        };
        CORSConfiguration: {
            CORSRules: {
                AllowedHeaders: string[];
                AllowedMethods: string[];
                AllowedOrigins: string[];
                ExposeHeaders: any[];
                MaxAgeSeconds: number;
            }[];
        };
        Policy: {
            Version: string;
            Statement: {
                Sid: string;
                Effect: string;
                Principal: string;
                Action: string[];
            }[];
        };
        assetFolderPrefixKey: string;
    };
};
