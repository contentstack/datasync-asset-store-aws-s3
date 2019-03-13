import { compact } from 'lodash'

const patternInterpretation = (config) => {
  const keys = compact(config.pattern.split('/'))
  keys.forEach((key, idx) => {
    if ((key as string).length === 0) {
      keys.splice(idx, 1)
    }
  })

  return keys
}

export const formatConfig = (config) => {
  const bucket = config.bucketParams
  if (bucket.name) {
    bucket.Bucket = bucket.name
    delete bucket.name
  }

  if (typeof bucket.ACL !== 'string') {
    bucket.ACL = 'public-read-write'
  }

  config.bucketName = bucket.Bucket
  config.uploadParams.Bucket = bucket.Bucket
  config.region = config.region || process.env.AWS_REGION
  config.apiVersion = config.apiVersion || 'latest'
  config.keys = patternInterpretation(config)

  return config
}

export const buildAWSConfig = (config) => {
  const awsConfig = {
    apiVersion: config.apiVersion,
    region: config.region
  }

  // https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-envvars.html
  if (process.env.AWS_ACCESS_KEY_ID || (config.credentials && config.credentials.accessKeyId)) {
    (awsConfig as any).accessKeyId = process.env.AWS_ACCESS_KEY_ID || config.credentials.accessKeyId
  }

  if (process.env.AWS_SECRET_ACCESS_KEY || (config.credentials && config.credentials.secretAccessKey)) {
    (awsConfig as any).secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || config.credentials.secretAccessKey
  }

  return awsConfig
}
