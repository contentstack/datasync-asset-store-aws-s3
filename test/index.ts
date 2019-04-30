import { config } from './config'
import { setConfig, setLogger, start } from '../src/index'

// set app config
setConfig(config)

describe('# Init', () => {
  test('Connect to aws-s3-assets-store', () => {
    return start()
      .then((s3Driver) => {
        expect(s3Driver).toHaveProperty('download')
        expect(s3Driver).toHaveProperty('delete')
        expect(s3Driver).toHaveProperty('unpublish')
        return
      })
  }, 20*1000)

  test('Set logger', () => {
    const logger = {
      info: () => {},
      log: () => {},
      warn: () => {},
      error: () => {},
      debug: () => {},
    }

    expect(setLogger(logger)).toEqual(logger)
    return
  })
})
