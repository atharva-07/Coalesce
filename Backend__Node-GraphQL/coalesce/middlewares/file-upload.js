const multer = require('multer');
const { v1 } = require('uuid');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};

const fileUpload = multer({
  limits: 10 * 1024 * 1024,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.fieldname === 'pfp') {
        cb(null, 'images/pfp');
      } else if (file.fieldname === 'banner') {
        cb(null, 'images/banner');
      } else {
        cb(null, 'images/posts');
      }
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, v1() + '.' + ext);
    }
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error('Invalid mime type!');
    cb(error, isValid);
  }
});

module.exports = fileUpload;
