import { ResultObject } from "../utils";
import { File } from "./medias.model";

export enum StoreMediaGatewayResult {
    SUCCESS = "success",
    FAIL_TO_STORE_MEDIA = "fail_to_store_media"
}

export enum GetMediaSignedUrlGatewayResult {
    SUCCESS = "success"
}

export enum DeleteMediaGatewayResult {
    SUCCESS = "success"
}

export interface MediaGateway {
    storeMedia: (file: File) => Promise<ResultObject<StoreMediaGatewayResult, string>>;
    getMediaSignedUrl: (key: string) => Promise<ResultObject<GetMediaSignedUrlGatewayResult, string>>;
    deleteMedia: (key: string) => Promise<ResultObject<DeleteMediaGatewayResult, undefined>>;
}