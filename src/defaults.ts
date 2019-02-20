/**
 * @description Default application's internal config
 */
export const config = {
  pattern: '/:uid/:filename',
  region: 'us-east-1', // Required
  apiVersion: '2006-03-01', // Required
  Bucket: {
    Bucket: 'dev-blt44d99c34b040fa61', // Required
    ACL: 'public-read-write'
  },
  CORSConfiguration: {
    CORSRules: [
      {
        AllowedHeaders: [
          'Authorization'
        ],
        AllowedMethods: ['PUT', 'POST', 'GET', 'DELETE'],
        AllowedOrigins: ['*'],
        ExposeHeaders: [],
        MaxAgeSeconds: 3000
      }
    ]
  },
  Policy: {
    Version: '2012-10-17',
    Statement: [
      {
        Sid: 'AddPerm',
        Effect: 'Allow',
        Principal: '*',
        Action: [
          's3:GetObject'
        ],
        Resource: [
          'arn:aws:s3:::new-bucket-blt44d99c34b040fa61/*'
        ]
      }
    ]
  }
}
