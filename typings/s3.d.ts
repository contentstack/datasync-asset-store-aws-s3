export declare class S3 {
    private appConfig;
    private config;
    private s3;
    constructor(s3: any, config: any);
    download(asset: any): Promise<{}>;
    private uploadStream;
    private extractFolderPaths;
}
