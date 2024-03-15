import multer from 'multer';
import crypto from 'node:crypto';
import path from 'node:path';

const storage = multer.diskStorage({
  destination: '../room202/images', // this path is based on the project root
  filename: (req, file, cb) => {
    cb(null, crypto.randomUUID() + path.extname(file.originalname));
  }
}); 

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: any) => {
  const allowedMimetypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedMimetypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export default multer({ storage, fileFilter });