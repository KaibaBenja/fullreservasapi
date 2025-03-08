import {
  S3Client,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { R2 } from "../config/dotenv.config";
import multer from "multer";
import multerS3 from "multer-s3";
import { NextFunction, Request, Response } from "express";
import streamToString from "../utils/streamToString";
import { CloudFlareS3 } from "../config/cloudflare.config";

const upload = (foldername: string) => multer({
  storage: multerS3({
    s3: CloudFlareS3,
    bucket: R2.CLOUDFLARE_R2_BUCKET_NAME!,
    metadata: (req: Request, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req: Request, file, cb) => {
      cb(null, `${foldername}/${Date.now()}-${file.originalname}`);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
  }),
  limits: { fileSize: 50 * 1024 * 1024 }, // 10MB límite
});

const deleteFileMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const fileName = req.body.fileName;

    if (!fileName) {
      return res.status(400).send({ error: "Filename is required" });
    }

    const params = {
      Bucket: R2.CLOUDFLARE_R2_BUCKET_NAME!,
      Key: `uploads/${fileName}`,
    };

    const response = await CloudFlareS3.send(new DeleteObjectCommand(params));

    if (response.$metadata.httpStatusCode !== 204) {
      return res.status(400).send({ error: "File could not be deleted" });
    }
    res.locals.fileDeleteSuccess = true;
    next();
  } catch (error: any) {
    console.error("Error in deleteFileMiddleware:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

const readFileMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const fileName = req.query.fileName as string;

    if (!fileName) {
      return res.status(400).send({ error: "Filename is required" });
    }

    const params = {
      Bucket: R2.CLOUDFLARE_R2_BUCKET_NAME!,
      Key: `uploads/${fileName}`,
    };

    const data = await CloudFlareS3.send(new GetObjectCommand(params));
    if (!data.Body) {
      return res.status(404).send({ error: "File not found" });
    }

    const content = await streamToString(data.Body as any);
    try {
      res.locals.fileContent = JSON.parse(content);
      next();
    } catch (error: any) {
      res.locals.fileContent = content;
      next();
    }
  } catch (error: any) {
    console.error("Error in readFileMiddleware:", error);
    res.status(500).send({ error: error.message || "Internal server error" });
  }
};

export { upload, deleteFileMiddleware, readFileMiddleware };

// export const deleteFileFromS3 = async (fileName: string) => {
//   const params = {
//     Bucket: R2.CLOUDFLARE_R2_BUCKET_NAME,
//     Key: fileName,
//   };

//   try {
//     const command = new DeleteObjectCommand(params);
//     await s3Client.send(command);
//     return `File ${fileName} deleted successfully from S3`;
//   } catch (error) {
//     throw error;
//   }
// };

// export const uploadFileToS3 = async (file: Express.Multer.File) => {
//   if (!file) {
//     throw new Error("No se encontró un archivo para subir.");
//   }

//   const fileBuffer = file.buffer;
//   const fileName = `uploads/${Date.now()}-${file.originalname}`;
//   const mimeType = file.mimetype;

//   return await upload(fileBuffer, fileName, mimeType);
// };
