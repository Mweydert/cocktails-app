import { GetObjectCommand, PutObjectCommand, DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuid } from "uuid";
import logger from "../utils/logger";
import { File, MediaGateway } from "app-domain";

export default class S3MediaGateway implements MediaGateway {
    #s3Client: S3Client;
    #bucketName: string;

    constructor(
        s3Client: S3Client,
        bucketName: string
    ) {
        this.#s3Client = s3Client;
        this.#bucketName = bucketName;
        logger.debug("S3MediaGateway created with bucket", bucketName);
    }

    private static URL_TTL = 60 * 60; // 1 hour validity

    async storeMedia(file: File): Promise<string> {
        logger.debug("Store file", file.fileName);

        const fileExtension = file.fileName.match(/\.[0-9a-z]+$/i)?.[0];
        if (!fileExtension) {
            throw new Error(`Unable to found extension in file ${file.fileName}`);
        }

        const key = `${uuid()}${fileExtension}`;

        const command = new PutObjectCommand({
            Bucket: this.#bucketName,
            Key: key,
            Body: file.buffer
        });
        await this.#s3Client.send(command);
        return key;
    }

    async getMediaSignedUrl(key: string): Promise<string> {
        logger.debug("Get signed URL for file", key);

        const command = new GetObjectCommand({
            Bucket: this.#bucketName,
            Key: key,
        });
        const signedUrl = await getSignedUrl(
            this.#s3Client,
            command,
            { expiresIn: S3MediaGateway.URL_TTL }
        );
        return signedUrl;
    }

    async deleteMedia(key: string): Promise<void> {
        logger.debug("Delete file", key);

        const command = new DeleteObjectCommand({
            Bucket: this.#bucketName,
            Key: key,
        });
        await this.#s3Client.send(command);
    }
}