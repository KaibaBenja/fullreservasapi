import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const uploadFileToS3 = async (
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
) => {
  const bucketName = process.env.AWS_S3_BUCKET_NAME!;
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: fileBuffer,
    ContentType: mimeType,
  };
  try {
    const uploadCommand = new PutObjectCommand(params);
    await s3.send(uploadCommand);
    const getCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
    });
    const signedUrl = async (
      directory: string,
      fileName: string
    ): Promise<string> => {
      try {
        const fullKey = `${directory}/${fileName}`;
        const command = new PutObjectCommand({
          Bucket: bucketName,
          Key: fullKey,
        });
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        return url;
      } catch (error) {
        console.error("Error getting signed URL from S3:", error);
        throw error;
      }
    };

    return {
      fileurl: `https://${bucketName}.s3.amazonaws.com/${fileName}`,
      signedUrl,
    };
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error;
  }
};

export const deleteFileFromS3 = async (fileName: string) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: fileName,
  };
  try {
    const command = new DeleteObjectCommand(params);
    await s3.send(command);
    return `File ${fileName} deleted successfully from S3`;
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    throw error;
  }
};
