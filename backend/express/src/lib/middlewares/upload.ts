import multer from 'multer';

import { InvalidFileTypeError } from '@/lib/error';
import { env } from '@/lib/config';

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/jpg']);

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
  limits: { fileSize: env.MAX_FILE_SIZE },
  dest: 'public/images'
});
