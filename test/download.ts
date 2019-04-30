import { createReadStream } from 'fs'
import { cloneDeep, merge } from 'lodash'
import nock from 'nock'
import { join } from 'path'
import { config } from './config'
import { config as defaultConfig } from '../src/config'
import { setConfig } from '../src/index'
import { init } from '../src/setup'
import { S3 } from '../src/s3'

// merge config with defaults
const appConfig = merge(cloneDeep(defaultConfig), config)

// set app config
setConfig(appConfig)

let s3
let driver

// Set up connection to AWS s3
beforeAll(() => {
  return init(appConfig.assetStore)
    .then((s3Instance) => {
      s3 = s3Instance
      driver = new S3(s3, appConfig)
      return
    })
}, 20 * 1000)

beforeAll(() => {
  nock('https://images.contentstack.io/v3/assets/stack-api-key')
    .get('/one/one-v1/beats.png')
    .reply(200, createReadStream(join(__dirname, 'assets', 'beats', 'beats.png', )), {'content-disposition': 'filename=beats'})
})

describe('# download', () => {
  test('Stream an asset onto AWS S3', () => {
    const data = require('./assets/beats/index.json')
    const asset = data.data
    asset.download_id = true

    return driver.download(asset)
      .then((response) => {
        expect(response.uid).toEqual(asset.uid)
        expect(response.filename).toEqual(asset.filename)
        expect(response._version).toEqual(asset._version)
        expect(response.url).toEqual(asset.url)
        expect(response.locale).toEqual(asset.locale)
        expect(response.file_size).toEqual(asset.file_size)
        expect(response.title).toEqual(asset.title)
        expect(response.description).toEqual(asset.description)
        expect(response).toHaveProperty('apiKey')
        expect(response.apiKey).toEqual('stack-api-key')

        expect(response).toHaveProperty('apiVersion')
        expect(response.apiVersion).toEqual('v3')

        expect(response).toHaveProperty('downloadId')
        expect(response.downloadId).toEqual('one')

        expect(response).toHaveProperty('VersionId')
        return
      })
  }, 20*1000)
})
