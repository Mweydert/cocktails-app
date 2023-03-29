import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { MediaGateway } from "app-domain/src/medias/medias.contract";
import logger from "../utils/logger";
import { File } from "app-domain/src/medias/medias.model";

export default class S3MediaGateway implements MediaGateway {
    #s3Client: S3Client;
    #bucketName: string;

    constructor(
        s3Client: S3Client,
        bucketName: string
    ) {
        this.#s3Client = s3Client;
        this.#bucketName = bucketName;
    }

    async storeMedia(file: File): Promise<string> {
        logger.debug("Store file", file.fileName);

        const command = new PutObjectCommand({
            Bucket: this.#bucketName,
            Key: file.fileName,
            Body: file.buffer
        });
        await this.#s3Client.send(command);
        return `${this.#bucketName}/${file.fileName}`;
    }
}