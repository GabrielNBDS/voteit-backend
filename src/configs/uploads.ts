import multer from 'multer';
import path from 'path';

export default {
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', 'uploads'),
    filename(request, file, callback) {
      const [, extension] = file.originalname.split('.');
      const filename = `${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}.${extension}`;
      return callback(null, filename);
    },
  }),
};