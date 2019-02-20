export const formatConfig = (config) => {
  const bucket = config.Bucket
  if (bucket.name) {
    bucket.Bucket = bucket.name
    delete bucket.name
  }

  if (typeof bucket.ACL !== 'string') {
    bucket.ACL = 'public-read-write'
  }

  config.region = config.region || process.env.AWS_REGION
  config.apiVersion = config.apiVersion || 'latest'

  return config
}