const assetStore = require('../dist')
const config = {
  assetStore: {
    bucketParams: {
      Bucket: 'dev-contentstack-asset-store-aws-s3'
    },
    credentials: {
      accessKeyId: '',
      secretAccessKey: ''
    },
    Policy: {
      Statement: [
        {
          Sid: 'AddPerm',
          Effect: 'Allow',
          Principal: '*',
          Action: ['s3:GetObject'],
          Resource: ['arn:aws:s3:::dev-contentstack-asset-store-aws-s3/*'] // Required
        }
      ]
    },
    // `apiVersion`, `apiKey` and `downloadId` can be generated by using an asset's url pattern
    pattern: '/:apiKey/:uid/:downloadId/:filename'
  }
}

const asset = {
  locale: 'en-us',
  uid: 'custom-asset',
  content_type_uid: '_assets',
  data: {
    uid: 'custom-asset',
    filename: 'yamaha.png',
    title: 'Yamaha PNG',
    url: 'https://images.contentstack.io/v3/assets/blt44d99c34b040fa61/blt3448fd9080bb7b4f/5c6ab4fae9cab209629287f8/yamaha.png'
  }
}

assetStore.setConfig(config)
assetStore.start()
  .then((s3) => {
    return s3.download(asset)
  })
  .then((assetResponse) => {
    console.log(JSON.stringify(assetResponse))
  })
  .catch(console.error)