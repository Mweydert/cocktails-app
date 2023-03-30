import { S3Client } from "@aws-sdk/client-s3";
import logger from "./utils/logger";

export const getS3Client = ({
    endpoint,
    accessKey,
    secret,
    region
}: {
    endpoint: string;
    accessKey: string;
    secret: string;
    region: string;
}) => {
    const client = new S3Client({
        credentials: {
            accessKeyId: accessKey,
            secretAccessKey: secret,
        },
        endpoint,
        region,
        forcePathStyle: true
    });
    logger.info(`Open s3 client for endpoint ${endpoint} and region: ${region}`)

    return client;
}
