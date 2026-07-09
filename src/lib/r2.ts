import { S3Client } from "@aws-sdk/client-s3";

console.log("R2_ENDPOINT =", process.env.R2_ENDPOINT);
console.log("R2_ACCESS_KEY_ID =", process.env.R2_ACCESS_KEY_ID);
console.log("R2_SECRET_ACCESS_KEY =", process.env.R2_SECRET_ACCESS_KEY ? "OK" : "NG");

export const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});