export declare const MESSAGES: {
    CONNECTION_CLOSED: (status: any) => string;
    S3_UPLOAD_RESPONSE: (response: any) => string;
    S3_ASSET_RESPONSE: (uid: string, response: any) => string;
    EXTRACTING_ASSET_URL: (asset: any, keys: any) => string;
    FACTORY_CONFIG: (config: any) => string;
    FACTORY_RESULT: (result: any) => string;
    HELLO_WORLD: string;
};
export declare const ERRORS: {
    KEY_NOT_FOUND: (key: string, asset: any) => string;
};
