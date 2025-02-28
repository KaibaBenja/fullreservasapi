import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand, } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3 } from "../config/dotenv.config";

export const s3Client = new S3Client({
  region: S3.REGION,
  credentials: {
    accessKeyId: S3.ACCESS_KEY,
    secretAccessKey: S3.SECRET_ACCESS_KEY,
  },
});

export const upload = async (fileBuffer: Buffer, fileName: string, mimeType: string) => {
  const bucketName = S3.BUCKET_NAME;

  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: fileBuffer,
    ContentType: mimeType,
  };

  try {
    const uploadCommand = new PutObjectCommand(params);
    await s3Client.send(uploadCommand);

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
    throw error;
  };
};

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
    throw error;
  };
};

export const uploadFileToS3 = async (file: Express.Multer.File) => {
  if (!file) {
    throw new Error("No se encontró un archivo para subir.");
  };

  const fileBuffer = file.buffer;
  const fileName = `uploads/${Date.now()}-${file.originalname}`;
  const mimeType = file.mimetype;

  return await upload(fileBuffer, fileName, mimeType);
};
