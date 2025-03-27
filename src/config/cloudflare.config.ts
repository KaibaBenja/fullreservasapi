import { S3Client } from "@aws-sdk/client-s3";
import { R2 } from "./dotenv.config";

export const CloudFlareS3 = new S3Client({
  region: "auto",
  endpoint: R2.ENDPOINT!,
  credentials: {
    accessKeyId: R2.CLOUDFLARE_R2_ACCESS_KEY!,
    secretAccessKey: R2.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
});
