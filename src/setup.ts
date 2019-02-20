import AWS from 'aws-sdk'
import Debug from 'debug'

import { formatConfig } from './util'
import { validateConfig } from './util/validations'

const debug = Debug('s3-setup')

const factory = (method, config) => {
  debug(`Factory: ${JSON.stringify(config)}`)
  return new AWS.S3()[method](config).promise().then((result) => {
    debug(`Result: ${JSON.stringify(result)}`)
    return
  })
}

export const init = (config) => {
  return new Promise((resolve, reject) => {
    try {
      validateConfig(config)
      config = formatConfig(config)

      AWS.config.update({region: config.region})
      config.UploadParams = config.UploadParams || {}
      config.UploadParams.apiVersion = config.apiVersion
      config.UploadParams.Bucket = config.Bucket.Bucket

      if (typeof config.CORSConfiguration === 'object' && !(config.CORSConfiguration instanceof Array)) {
        arr.push('setCORS')
      }
      if (typeof this.config.Policy === 'object' && !(this.config.Policy instanceof Array)) {
        arr.push('setBucketPolicies')
      }

      return new AWS.S3().createBucket(this.config.Bucket).promise().then(result => {
        console.dir(result)
        return Promise.map(arr, method => {
          return this[method]().then(() => {
            return
          }).catch(error => {
            throw error
          })
        }, { concurrency: 1}).then(() => {
          logger.info(`S3 bucket and management setup successfully!`)
          return resolve()
        }).catch(error => {
          throw error
        })
      }).catch(error => {
        console.error(error)
        logger.error(`Error while creating/setting up s3 bucket.\n${error}`)
        return reject(error)
      })
    } catch (error) {
      console.error(error)
      logger.error(`Error while creating/setting up s3 bucket.\n${error}`)
      return reject(error)
    }
  })
}