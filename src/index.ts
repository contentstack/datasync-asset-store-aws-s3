import { merge } from 'lodash'
import { config as internalConfig } from './defaults'
import { setLogger } from './util/logger'
import { validateConfig } from './util/validations'

let appConfig: any = {}
let contentStore
let assetStore
let listener

/**
 * @summary Asset store instance interface
 */
interface IAssetStore {
  download(): any,
  unpublish(): any,
  delete(): any,
}

/**
 * @summary Application config interface
 */
export interface IConfig {
  pattern?: string,
  region: string,
  apiVersion?: string,
  Bucket: {
    name: string,
    ACL?: string,
  },
  CORSConfiguration: any,
  Policy?: any,
}

/**
 * @summary Logger instance interface
 */
export interface ILogger {
  warn(): any,
  info(): any,
  log(): any,
  error(): any,
}

/**
 * @summary Set the application's config
 * @param {Object} config - Application config
 */
export const setConfig = (config: IConfig) => {
  appConfig = config
}

/**
 * @summary Returns the application's configuration
 * @returns {Object} - Application config
 */
export const getConfig = (): IConfig => {
  return appConfig
}

/**
 * @summary Set custom logger for logging
 * @param {Object} instance - Custom logger instance
 */
export { setLogger }

// /**
//  * @summary Event emitter object, that allows client notifications on event raised by sync-manager queue
//  * @returns an event-emitter object, events raised: publish, unpublish, delete, error
//  */
// export { notifications }

/**
 * @summary
 *  Starts the sync manager utility
 * @description
 *  Registers, validates asset, content stores and listener instances.
 *  Once done, builds the app's config and logger
 * @param {Object} config - Optional application config.
 */
export const start = (config?: IConfig): Promise<{}> => {
  return new Promise((resolve, reject) => {
    try {
      appConfig = merge(appConfig, config || {})
      
    } catch (error) {
      return reject(error)
    }
  })
}
