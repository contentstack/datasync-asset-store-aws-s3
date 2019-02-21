import { setLogger } from './util/logger';
export interface IConfig {
    region: string;
    bucketParams: any;
    uploadParams: any;
    apiVersion?: string;
    CORSConfiguration: any;
    pattern?: string;
    Policy?: any;
}
export interface ILogger {
    warn(): any;
    info(): any;
    log(): any;
    error(): any;
}
export declare const setConfig: (config: IConfig) => void;
export declare const getConfig: () => IConfig;
export { setLogger };
export declare const start: (config?: IConfig) => Promise<{}>;
