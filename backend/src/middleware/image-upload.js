const multer = require('multer');

const uploadProfile = multer({
  limits: {
    fileSize: 10000000
  },
  fileFilter(request, file, callback) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/))
      return callback(new Error('Upload file in .jpg, .jpeg or .png format'));
    callback(undefined, true);
  }
});

module.exports = { uploadProfile };
