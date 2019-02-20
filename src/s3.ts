import Debug from 'debug'
import * as path from 'path'
import request from 'request'
import { find, cloneDeep } from 'lodash'
import * as AWS from 'aws-sdk'
import stream from 'stream'

const debug = Debug('s3-core')

class S3Manager {
	private config
  private langs: any[]
  private s3
  private UploadParams

	constructor (config) {
		this.config = config
	}

  private setCORS (params) {
    debug(`Setting bucket CORS using: ${JSON.stringify(params)}`)
    return new Promise((resolve, reject) => {
      return new AWS.S3().putBucketCors(
        {
          Bucket: this.UploadParams.Bucket,
          CORSConfiguration: this.config.CORSConfiguration
        }
      ).promise().then((result) => {
        debug(`S3 CORS set successfully! Result: ${JSON.stringify(result)}`)
        return resolve()
      }).catch(reject)
    })
  }

  private setBucketPolicies (config) {
    return new Promise((resolve, reject) => {
      debug(`Setting bucket BucketPolicy using: ${JSON.stringify(config)}`)
      return new AWS.S3().putBucketPolicy(
        {
          Bucket: config.UploadParams.Bucket,
          Policy: JSON.stringify(config.Policy)
        }
      ).promise().then((result) => {
        debug(`S3 bucket policy set successfully! Result: ${JSON.stringify(result)}`)
        return resolve()
      }).catch(reject)
    })
  }

  private setBucketVersioning (config) {
    return new Promise((resolve, reject) => {
      debug('Setting bucket versioning')
      return new AWS.S3().putBucketVersioning(
        {
          Bucket: config.UploadParams.Bucket,
          VersioningConfiguration: (config.VersioningConfiguration) ? config.VersioningConfiguration: { MFADelete: 'Disabled', Status: 'Enabled' }
        }
      ).promise().then((result) => {
        debug(`S3 bucket versioning set successfully! Result: ${JSON.stringify(result)}`)
        return resolve()
      }).catch(reject)
    })
  }

  public download (asset, lang_code) {
    const lang = find(this.langs, lang => {
      return lang.code === lang_code
    })
    return new Promise((resolve, reject) => {
      const paths = lang.assets_path
      const pths = this.urlFromObject(asset)
      asset._internal_url = this.getAssetUrl(pths.join('/'), lang)
      pths.unshift(paths)
      const asset_path = path.join.apply(path, pths)
      const out = request({ url: asset.url });
        out.on('response', response => {
          if (asset.download_id) {
            let attachment: string = <string>response.headers['content-disposition']
            asset.filename =  decodeURIComponent(attachment.split('=')[1])
          }
        })
        .pipe(this.uploadStream(asset, asset_path, resolve, reject))
        .on('error', reject)
        .on('close', status => {
          debug(`Connection closed. Status: ${JSON.stringify(status)}`)

          return resolve(asset)
        })
        .end()
    })
  }

  private uploadStream (asset, asset_path, resolve, reject) {
    const pass = new stream.PassThrough()
    const params = cloneDeep(this.UploadParams)
    const _path = asset_path.replace(asset.filename, '')
    params.Key = path.join(_path, asset.filename)
    params.Body = pass
    new AWS.S3().upload(params)
    .on('httpUploadProgress', debug)
    .promise()
    .then(s3Reqponse => {
      console.dir(s3Reqponse, {showHidden: true, colors: true, depth: null})
      asset.VersionId = (s3Reqponse as any).VersionId
      asset.Location = s3Reqponse.Location
      asset.ETag = s3Reqponse.ETag
      return resolve(asset)
    }).catch(reject)

    return pass
  }

  public delete (asset, locale) {
    return new Promise((resolve, reject) => {

    })
  }

  public unpublish (asset, locale) {
    return new Promise((resolve, reject) => {

    })
  }

  // Generate the full assets url foro the given url
  private getAssetUrl (assetUrl, lang) {
    var relativeUrlPrefix = this.config.relative_url_prefix
    assetUrl = relativeUrlPrefix + assetUrl
    if (!(lang.relative_url_prefix === '/' || lang.host)) {
      assetUrl = lang.relative_url_prefix.slice(0, -1) + assetUrl
    }
    return assetUrl
  }

  // Used to generate asset path from keys using asset
  private urlFromObject(asset: any) {
    var values: any = [],
    _keys = this.config.keys

    for (var a = 0, _a = _keys.length; a < _a; a++) {
      if (_keys[a] === 'uid') {
        values.push(asset.uid)
      } else if (asset[_keys[a]]) {
        values.push(asset[_keys[a]])
      } else {
        throw new TypeError(render(msg.error.asset_key_undefined, { key: _keys[a] }))
      }
    }
    return values
  }
}

export = S3Manager