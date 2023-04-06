import { ResultObject } from "../utils";
import { File } from "./medias.model";

export enum StoreMediaGatewayResult {
    SUCCESS = "success"
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