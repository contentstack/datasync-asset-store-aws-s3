import Debug from 'debug'
import { join } from 'path'
import { cloneDeep } from 'lodash'
import request from 'request'
import stream from 'stream'

const debug = Debug('s3-core')

export class S3 {
  private appConfig: any
	private config: any
  private s3: any

	constructor (s3, config) {
    this.appConfig = config
    this.config = config.assetStore
    this.s3 = s3
	}

  public download (asset) {
    return new Promise((resolve, reject) => {
      const out = request({ url: asset.data.url });
      out.on('response', response => {
        if (asset.data.download_id) {
          let attachment: string = <string>response.headers['content-disposition']
          asset.data.filename =  decodeURIComponent(attachment.split('=')[1])
        }
      })
      .pipe(this.uploadStream(asset, resolve, reject))
      .on('error', reject)
      .on('close', status => {
        debug(`Connection closed. Status: ${JSON.stringify(status)}`)

        return resolve(asset)
      })
      .end()
    })
  }

  private uploadStream (asset, resolve, reject) {
    // [<prefix?>, 'locale', 'uid', 'filename']
    const folderPath = this.extractFolderPaths(asset)
    const folderKey = join.apply(this, folderPath)
    const pass = new stream.PassThrough()
    const params = cloneDeep(this.config.uploadParams)
    params.Key = folderKey
    params.Body = pass
    this.s3.upload(params)
      .on('httpUploadProgress', debug)
      .promise()
      .then((s3Response) => {
        debug(`S3 asset upload response: ${JSON.stringify(s3Response)}`)
        asset.VersionId = (s3Response as any).VersionId
        asset.Location = s3Response.Location
        asset.ETag = s3Response.ETag
        return resolve(asset)
      })
      .catch(reject)

    return pass
  }

  // public delete (asset) {
  //   return new Promise((resolve, reject) => {

  //   })
  // }

  // public unpublish (asset) {
  //   return new Promise((resolve, reject) => {

  //   })
  // }

  // Used to generate asset path from keys using asset
  private extractFolderPaths(asset: any) {
    const values: any = []
    const keys = this.config.keys

    if (this.config.assetFolderPrefixKey && typeof this.config.assetFolderPrefixKey === 'string') {
      values.push(this.config.assetFolderPrefixKey)
    }

    const regexp = new RegExp('https://(assets|images).contentstack.io/(v[\\d])/assets/(.*?)/(.*?)/(.*?)/(.*)', 'g')
    let matches

    while ((matches = regexp.exec(asset.data.url)) !== null) {
      if (matches && matches.length) {
        if (matches[2]) {
          asset.data.apiVersion = matches[2]
        }
        if (matches[3]) {
          asset.data.apiKey = matches[3]
        }
        if (matches[4]) {
          asset.data.downloadId = matches[4]
        }
      }
    }
    debug(`extracting asset url from: ${JSON.stringify(asset.data)}.\nKeys expected from this asset are: ${JSON.stringify(keys)}`)

    for (let i = 0, keyLength = keys.length; i < keyLength; i++) {
      if (asset.data[keys[i]]) {
        values.push(asset.data[keys[i]])
      } else {
        throw new TypeError(`The key ${keys[i]} did not exist on ${JSON.stringify(asset.data)}`)
      }
    }

    return values
  }
}