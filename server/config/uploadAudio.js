const multer = require('multer');
const multerS3 = require('multer-s3');
const {s3} = require('./s3Config');

const bucketName = process.env.NODE_ENV === 'production' ? process.env.S3_AUDIO_ANSWER_BUCKET_NAME_PROD : process.env.S3_AUDIO_ANSWER_BUCKET_NAME_DEV;

const uploadAudio = multer({
  storage: multerS3({
    s3: s3,
    bucket: bucketName,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, Date.now().toString() + '-' + file.originalname);
    },
  }),
});

module.exports = uploadAudio;
