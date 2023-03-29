import { File } from "./medias.model";

export interface MediaGateway {
    storeMedia: (file: File) => Promise<string>;
}