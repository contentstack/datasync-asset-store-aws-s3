import { cloneDeep, merge } from 'lodash'
import { config as testConfig } from './config'
import { config as defaultConfig } from '../src/config'
import { validatePublishedAsset, validateConfig, validateLogger } from '../src/util/validations'

// merge config with defaults
const assetStore = merge(cloneDeep(defaultConfig), testConfig).assetStore

describe('# Negative validation cases', () => {

  describe('Check config validator', () => {
    test('Bucket params is empty', () => {
      const config: any = cloneDeep(assetStore)
      config.bucketParams = []
      expect(() => {
        validateConfig(config)
      }).toThrowError(/Kindly provide valid bucket config/)
    })
  
    test('Bucket params does not have required keys', () => {
      const config: any = cloneDeep(assetStore)
      config.bucketParams = {}
      expect(() => {
        validateConfig(config)
      }).toThrowError(/Kindly provide valid bucket config/)
    })

    test('AWS S3 region is undefined', () => {
      const config: any = cloneDeep(assetStore)
      config.region = undefined
      expect(() => {
        validateConfig(config)
      }).toThrowError(/Kindly provide s3 'region'/)
    })
  })

  describe('Check logger', () => {
    test('logger does not have required keys', () => {
      const bool = false
      expect(validateLogger(bool)).toEqual(false)
    })
    test('logger does not have required functions', () => {
      const logger = {
        info: () => {},
        error: () => {},
        debug: () => {},
        warn: () => {},
      }
      expect(validateLogger(logger)).toEqual(false)
    })
  })

  describe('Check asset validator', () => {
    test('Asset is not of type plain object', () => {
      const asset = []
      expect(() => {
        validatePublishedAsset(asset)
      }).toThrowError(/Asset  should be of type 'plain object'/)
    })

    test('Asset does not have required keys', () => {
      const asset = {
        locale: '',
        uid: ''
      }
      expect(() => {
        validatePublishedAsset(asset)
      }).toThrowError(`Required key:url not found in ${JSON.stringify(asset)}`)
    })
  })
})