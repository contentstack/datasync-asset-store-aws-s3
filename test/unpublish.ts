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
    .get('/two/two-v2/cnn.png')
    .reply(200, createReadStream(join(__dirname, 'assets', 'cnn', 'cnn.png')))
})

describe('# unpublish', () => {
  test('Unpublish an asset from AWS S3', () => {
    const data = require('./assets/cnn/index.json')
    const asset = data.data

    return driver.download(asset)
      .then((uploadResponse) => {
        return driver.unpublish(uploadResponse)
          .then((unpublishResponse) => {
            expect(uploadResponse).toEqual(unpublishResponse)

            return
          })
      })
  }, 20 * 1000)
})
