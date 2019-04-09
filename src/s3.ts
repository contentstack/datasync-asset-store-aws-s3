import Debug from 'debug'
import { join } from 'path'
import { cloneDeep } from 'lodash'
import request from 'request'
import stream from 'stream'
import { validatePublishedAsset, validateUnpublishedAsset, validateDeletedAsset } from './util/validations'

const debug = Debug('s3')

/**
 * @interface
 * @member IAsset
 * @summary Expected asset interface
 */
interface IAsset {
  locale: string,
  url: string,
  uid: string,
  _internal_url?: string,
  apiVersion?: string,
  apiKey?: string,
  download_id?: string,
  downloadId?: string,
  filename?: string,
  title?: string,
  Key?: string,
  Location?: string,
  VersionId?: string,
}

/**
 * @class S3
 * @public
 * @summary Wrapper around AWS S3, to upload, unpublish and delete Contentstack's assets
 * @example
 * const s3 = new S3(awsS3Instance, appConfig)
 * return s3.download(asset: Iasset)
 *  .then((uploadResponse) => console.log)
 * @returns {S3} Returns S3 instance
 */
export class S3 {
	private config: any
  private s3: any

	constructor (s3, config) {
    this.config = config.assetStore
    this.s3 = s3
	}

  /**
   * @public
   * @method download
   * @summary Download asset from Contentstack and upload it to AWS S3
   * @param {object} asset to be stored in AWS S3. Asset is of type: IAsset
   * @example
   * const s3 = new S3(awsS3Instance, appConfig)
   * return s3.download(asset: Iasset)
   *  .then((uploadResponse) => console.log)
   * 
   * @returns {Promise} Returns the uploaded file details embedded in the input asset object
   */
  public download (asset: IAsset) {
    return new Promise((resolve, reject) => {
      validatePublishedAsset(asset)
      const out = request({ url: asset.url });
      out.on('response', response => {
        if (asset.download_id) {
          let attachment: string = <string>response.headers['content-disposition']
          asset.filename =  decodeURIComponent(attachment.split('=')[1])
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

  /**
   * @private
   * @method uploadStream
   * @summary Uploads asset into AWS S2=3
   * @param {object} asset Asset to be stored in AWS S3. Asset is of type: IAsset
   * @param {Promise} resolve Promise.resolve
   * @param {Promise} reject Promise.reject
   * @returns {Promise} Returns the uploaded file details embedded in the input asset object
  */
  private uploadStream (asset, resolve, reject) {
    // [<prefix?>, 'locale', 'uid', 'filename']
    const patternKeys = this.extractDetails(asset)
    const uriPattern = join.apply(this, patternKeys)
    const pass = new stream.PassThrough()
    const params = cloneDeep(this.config.uploadParams)
    params.Key = uriPattern
    params.Body = pass
    this.s3.upload(params)
      .on('httpUploadProgress', debug)
      .promise()
      .then((s3Response) => {
        debug(`S3 asset upload response: ${JSON.stringify(s3Response)}`)
        asset.VersionId = (s3Response as any).VersionId
        asset.Location = s3Response.Location
        asset.ETag = s3Response.ETag
        asset.Key = s3Response.Key
        asset.Bucket = this.config.bucketParams.Bucket

        return resolve(asset)
      })
      .catch(reject)

    return pass
  }

  /**
   * @public
   * @method delete
   * @summary Delete the selected assets from AWS S3
   * @param {array} assets to be deleted from AWS S3. Asset is of type: IAsset
   * @example
   * const s3 = new S3(awsS3Instance, appConfig)
   * return s3.delete(asset: Iasset[])
   *  .then((deleteResponse) => console.log)
   * 
   * @returns {Promise} Returns the delete marker details embedded in the input asset object
  */
  public delete (assets: IAsset[]) {
    assets.forEach((asset) => validateDeletedAsset(asset))

    const promisifiedBucket = []

    assets.forEach((asset) => {
      promisifiedBucket.push(
        (() => {
          return new Promise((resolve, reject) => {

            return this.s3.deleteObject({
              Bucket: this.config.bucketParams.Bucket,
              Key: asset.Key
            }, (error, response) => {
              if (error) {
                return reject(error)
              }
              debug(`S3 asset (${asset.uid}) response ${JSON.stringify(response)}`)
      
              return resolve(asset)
            })
          })
        }
      )())
    })

    return Promise.all(promisifiedBucket)
  }

  /**
   * @public
   * @method unpublish
   * @summary Unpublish the selected asset from AWS S3
   * @param {object} asset to be deleted from AWS S3. Asset is of type: IAsset
   * @example
   * const s3 = new S3(awsS3Instance, appConfig)
   * return s3.unpublish(asset: Iasset[])
   *  .then((deleteResponse) => console.log)
   * 
   * @returns {Promise} Returns the delete marker details embedded in the input asset object
  */
  public unpublish (asset: IAsset) {

    return new Promise((resolve, reject) => {
      validateUnpublishedAsset(asset)

      return this.s3.deleteObject({
        Bucket: this.config.bucketParams.Bucket,
        Key: asset.Key
      }, (error, response) => {
        if (error) {
          return reject(error)
        }
        debug(`S3 asset (${asset.uid}) response ${JSON.stringify(response)}`)

        return resolve(asset)
      })
    })
  }

  /**
   * @private
   * @method extractDetails
   * @summary Checks for and extracts property details from the input asset
   * @param {object} asset Asset, who's properties are checked and extracted
   * @returns {array} Returns an array of property values extracted from the asset
   */
  private extractDetails(asset: IAsset) {
    const values: any = []
    const keys: string[] = this.config.patternKeys

    const regexp = new RegExp('https://(assets|images).contentstack.io/(v[\\d])/assets/(.*?)/(.*?)/(.*?)/(.*)', 'g')
    let matches

    while ((matches = regexp.exec(asset.url)) !== null) {
      if (matches && matches.length) {
        if (matches[2]) {
          asset.apiVersion = matches[2]
        }
        if (matches[3]) {
          asset.apiKey = matches[3]
        }
        if (matches[4]) {
          asset.downloadId = matches[4]
        }
      }
    }
    debug(`extracting asset url from: ${JSON.stringify(asset)}.\nKeys expected from this asset are: ${JSON.stringify(keys)}`)

    for (let i = 0, keyLength = keys.length; i < keyLength; i++) {
      if (keys[i].charAt(0) === ':') {
        const k = keys[i].substring(1)
        if (asset[k]) {
          values.push(asset[k])
        } else {
          throw new TypeError(`The key ${keys[i]} did not exist on ${JSON.stringify(asset)}`)
        }
      } else {
        values.push(keys[i])
      }
    }

    return values
  }
}