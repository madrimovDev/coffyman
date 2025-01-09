import { diskStorage } from 'multer';
import * as crypto from 'crypto';
import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

const defaultDest = process.cwd() + '/uploads';

export const multerConfig: (sub?: string) => MulterOptions = (
  sub?: string,
) => ({
  preservePath: true,
  limits: {
    fileSize: 1024 * 1024 * 1,
  },
  storage: diskStorage({
    destination: sub ? `${defaultDest}/${sub}` : defaultDest,
    filename: (_, file, cb) => {
      const requiredMimeTypes = 'image/*';
      if (!file.mimetype.match(requiredMimeTypes)) {
        return cb(new BadRequestException('File type not allowed'), null);
      }

      const randomName = crypto.randomBytes(8).toString('hex');
      return cb(null, `${randomName}-${file.originalname}`);
    },
  }),
});
