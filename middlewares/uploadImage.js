const multer = require('multer');
const mkdirp = require('mkdirp');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

aws.config.update({
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  accessKeyId: process.env.ACCESS_KEY_ID,
  region: 'ap-southeast-1',
  signatureVersion: 'v4',
});

module.exports.uploadImage = (type) => {
  const upload = multer({
    storage: multerS3({
      s3: new aws.S3(),
      bucket: 'upload',
      acl: 'public-read',
      key: function (req, file, cb) {
        if (file.mimetype === 'application/octet-stream') type = '.jpg';
        cb(null, type + '/' + Date.now() + '-' + file.originalname);
      },
    }),
  });
  return upload.single(type);
};
