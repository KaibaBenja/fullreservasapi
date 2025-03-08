import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { R2 } from "../config/dotenv.config";
import multer from "multer";
import multerS3 from "multer-s3";
import { Request } from "express";
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
      cb(null, `${foldername}/${Date.now()}-${file.originalname}`);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
  }),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB límite
});

const deleteFileR2 = async (fileUrl: string): Promise<boolean> => {
  try {
    const fileName = fileUrl.split(`${R2.CLOUDFLARE_R2_PUBLIC_URL}/`)[1];

    if (!fileName) {
      console.error("URL del archivo inválida");
      return false;
    };

    const params = {
      Bucket: R2.CLOUDFLARE_R2_BUCKET_NAME!,
      Key: fileName,
    };

    const response = await CloudFlareS3.send(new DeleteObjectCommand(params));

    if (!response || response.$metadata.httpStatusCode !== 204) {
      return false;
    };

    return true;
  } catch (error) {
    console.error("Error in deleteFileR2.", error);
    return false;
  }
};


export { upload, deleteFileR2 };
