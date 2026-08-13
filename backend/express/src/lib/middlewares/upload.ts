import path from 'node:path';
import multer from 'multer';

import { InvalidFileTypeError } from '@/lib/error';
import { env } from '@/lib/config';

export const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/jpg'
]);

export const upload = multer({
  fileFilter(_, file, callback) {
    const error = new InvalidFileTypeError();
    const [errors] = error.errors;

    if (!allowedMimeTypes.has(file.mimetype)) {
      errors.path = [file.originalname];
      return callback(error);
    }

    callback(null, true);
  },
  storage: multer.diskStorage({
    filename(request, file, callback) {
      callback(null, `${request.user._id}${path.extname(file.originalname)}`);
    },
    destination: env.UPLOAD_DIR
  }),
  limits: { fileSize: env.MAX_FILE_SIZE }
});
