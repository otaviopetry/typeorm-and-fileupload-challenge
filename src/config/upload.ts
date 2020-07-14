import multer from 'multer';
import path from 'path';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  directory: tmpFolder,

  storage: multer.diskStorage({
    destination: tmpFolder,

    // handle unique filename generation
    filename(request, file, callback) {
      // add generated hex string to original filename
      const fileName = `${file.originalname}`;

      // return final filename with no errors
      return callback(null, fileName);
    },
  }),
};
