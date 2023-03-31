import { getS3Client } from "infrastructure";
import config from "@/config";

const s3Client = getS3Client({
    endpoint: config.S3_URL,
    accessKey: config.S3_ACCESS_KEY,
    secret: config.S3_SECRET_KEY,
    region: config.S3_REGION
})

export default s3Client;