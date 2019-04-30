import { cloneDeep, merge } from 'lodash'
import { config as testConfig } from './config'
import { config as defaultConfig } from '../src/config'
import { buildAWSConfig, formatConfig } from '../src/util/index'
import { setLogger } from '../src/util/logger'

// merge config with defaults
const assetStore: any = merge(cloneDeep(defaultConfig), testConfig).assetStore

describe('# Check utility methods', () => {
  describe('Check buildAWSConfig()', () => {
    test('Provide config.creds.accessKeyId', () => {
      assetStore.credentials = {
        accessKeyId: 'access_key_id',
        secretAccessKey: 'secret_access_key'
      }

      const AWSConfig = {
        apiVersion: assetStore.apiVersion,
        region: assetStore.region,
        accessKeyId: assetStore.credentials.accessKeyId,
        secretAccessKey: assetStore.credentials.secretAccessKey
      }

      expect(buildAWSConfig(assetStore)).toEqual(AWSConfig)
      
      return
    })
  })

  describe('Check formatConfig()', () => {
    test('Do not provide config.apiVersion', () => {
      assetStore.apiVersion = false
      const formattedConfig = formatConfig(assetStore)

      expect(formattedConfig.apiVersion).toEqual('latest')
      
      return
    })
  })

  describe('Check setLogger()', () => {
    test('Do not provide params to setLogger()', () => {

      expect(setLogger()).toHaveProperty('info')
      expect(setLogger()).toHaveProperty('warn')
      expect(setLogger()).toHaveProperty('error')
      expect(setLogger()).toHaveProperty('log')
      
      return
    })
  })
})
