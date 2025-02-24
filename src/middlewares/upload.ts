import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const client = new S3Client({
  region: process.env.BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});

const upload = (folderName: string) => {
  multer({
    storage: multerS3({
      s3: client,
      bucket: process.env.BUCKET_NAME!,
      metadata: (_req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
      },
      key: (_req, file, cb) => {
        const uniqueId = "shops";
        const uniqueKey = `${folderName}/${uniqueId}-${file.originalname}`;
        cb(null, uniqueKey);
      },
      contentType: (req, file, cb) => {
        cb(null, file.mimetype);
      },
      fileFilter: (req, file, cb) => {
        const fileTypes = ["pdf", "doc", "docx", "jpg", "jpeg", "png"];
        const extname = path.extname(file.originalname).toLowerCase();

        if (fileTypes.includes(extname)) {
          cb(null, true);
        } else {
          cb(null, false);
        }
      },
    }),
  });
};

export default upload;
