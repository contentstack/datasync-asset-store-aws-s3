interface IAsset {
    locale: string;
    url: string;
    uid: string;
    _internal_url?: string;
    apiVersion?: string;
    apiKey?: string;
    download_id?: string;
    downloadId?: string;
    filename?: string;
    title?: string;
    Key?: string;
    Location?: string;
    VersionId?: string;
}
export declare class S3 {
    private config;
    private s3;
    constructor(s3: any, config: any);
    download(asset: IAsset): Promise<{}>;
    private uploadStream;
    delete(assets: IAsset[]): Promise<any[]>;
    unpublish(asset: IAsset): Promise<{}>;
    private extractDetails;
}
export {};
