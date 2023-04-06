import { File } from "./medias.model";

export interface MediaGateway {
    storeMedia: (file: File) => Promise<string>;
    getMediaSignedUrl: (key: string) => Promise<string>;
    deleteMedia: (key: string) => Promise<void>;
}