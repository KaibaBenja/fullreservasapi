import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3 } from "../config/dotenv.config";
import { Request } from "express";

export const s3Client = new S3Client({
  region: S3.REGION,
  credentials: {
    accessKeyId: S3.ACCESS_KEY,
    secretAccessKey: S3.SECRET_ACCESS_KEY,
  },
});

/**
 * Sube un archivo a S3 y genera un signed URL de lectura.
 */
export const uploadFileToS3 = async (
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
) => {
  const bucketName = S3.BUCKET_NAME;

  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: fileBuffer,
    ContentType: mimeType,
  };

  try {
    // Subir el archivo a S3
    const uploadCommand = new PutObjectCommand(params);
    await s3Client.send(uploadCommand);

    // Generar el signed URL para lectura
    const signedUrl = await getSignedUrl(
      s3Client,
      new GetObjectCommand({ Bucket: bucketName, Key: fileName }),
      { expiresIn: 3600 } // Expira en 1 hora
    );

    return {
      fileUrl: `https://${bucketName}.s3.amazonaws.com/${fileName}`,
      signedUrl,
    };
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error;
  }
};

/**
 * Elimina un archivo de S3.
 */
export const deleteFileFromS3 = async (fileName: string) => {
  const params = {
    Bucket: S3.BUCKET_NAME,
    Key: fileName,
  };

  try {
    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);
    return `File ${fileName} deleted successfully from S3`;
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    throw error;
  }
};

export const uploadFileMiddleware = async (req: Request) => {
  if (!req.file) {
    throw new Error("No se encontró un archivo para subir.");
  }

  const fileBuffer = req.file.buffer;
  const fileName = `uploads/${Date.now()}-${req.file.originalname}`;
  const mimeType = req.file.mimetype;

  return await uploadFileToS3(fileBuffer, fileName, mimeType);
};
