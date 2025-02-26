import { FileFilterCallback } from "multer";
import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";
import { S3 } from "@/config/dotenv.config";
import { s3Client } from "@/config/s3.config";
import { Request } from "express";

const upload = (folderName: string) => {
  return multer({
    storage: multerS3({
      s3: s3Client,
      bucket: S3.BUCKET_NAME,
      metadata: (
        _req: Request,
        file: Express.Multer.File,
        cb: (error: any, metadata?: any) => void
      ) => {
        cb(null, { fieldName: file.fieldname });
      },
      key: (
        _req: Request,
        file: Express.Multer.File,
        cb: (error: any, key?: string) => void
      ) => {
        const uniqueKey = `${folderName}/${Date.now()}-${file.originalname}`;
        cb(null, uniqueKey);
      },
      contentType: multerS3.AUTO_CONTENT_TYPE,
    }),
    fileFilter: (
      _req: Request,
      file: Express.Multer.File,
      cb: FileFilterCallback
    ) => {
      const allowedExtensions = ["pdf", "doc", "docx", "jpg", "jpeg", "png"];
      const extname = path
        .extname(file.originalname)
        .toLowerCase()
        .replace(".", "");

      if (allowedExtensions.includes(extname)) {
        cb(null, true);
      } else {
        cb(new Error("Invalid file type"));
      }
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  });
};

export default upload;
