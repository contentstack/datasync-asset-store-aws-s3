/**
 * @summary Centralized messages for logging and errors
 * @description This file contains all user-facing messages, debug logs, and error messages
 * used throughout the application for consistency and easier maintenance.
 */

/**
 * Debug and informational messages
 */
export const MESSAGES = {
  // S3 operations
  CONNECTION_CLOSED: (status: any) => `Connection closed. Status: ${JSON.stringify(status)}`,
  S3_UPLOAD_RESPONSE: (response: any) => `S3 asset upload response: ${JSON.stringify(response)}`,
  S3_ASSET_RESPONSE: (uid: string, response: any) => `S3 asset: ${uid} response: ${JSON.stringify(response)}`,
  EXTRACTING_ASSET_URL: (asset: any, keys: any) => `Extracting asset URL from: ${JSON.stringify(asset)}. Keys expected from this asset are: ${JSON.stringify(keys)}`,
  
  // Setup operations
  FACTORY_CONFIG: (config: any) => `Factory config: ${JSON.stringify(config)}`,
  FACTORY_RESULT: (result: any) => `Result: ${JSON.stringify(result)}`,
  
  // Logger example
  HELLO_WORLD: 'Hello world!',
}

/**
 * Error messages
 */
export const ERRORS = {
  KEY_NOT_FOUND: (key: string, asset: any) => `The key '${key}' does not exist on: ${JSON.stringify(asset)}`,
}

