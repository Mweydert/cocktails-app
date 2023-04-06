import { File } from "../../src/medias/medias.model";
import { ResultObject } from "../../src/utils";
import { DeleteMediaGatewayResult, GetMediaSignedUrlGatewayResult, MediaGateway, StoreMediaGatewayResult } from "./../../src/medias/medias.contract";

export default class MediaInMemoryGateway implements MediaGateway {
    data: Map<string, File>

    static computeMediaKey(file: File) {
        return `id-${file.fileName}`;
    }

    constructor(initialData?: File[]) {
        this.data = new Map<string, File>(
            initialData?.map(
                file => ([
                    MediaInMemoryGateway.computeMediaKey(file),
                    file
                ])
            ) || []
        );
    }

    async storeMedia(
        file: File
    ): Promise<ResultObject<StoreMediaGatewayResult, string>> {
        const id = MediaInMemoryGateway.computeMediaKey(file);
        this.data.set(id, file);
        return new ResultObject(
            StoreMediaGatewayResult.SUCCESS,
            id
        );
    }

    async getMediaSignedUrl(
        key: string
    ): Promise<ResultObject<GetMediaSignedUrlGatewayResult, string>> {
        const media = this.data.get(key);
        if (!media) {
            throw new Error("No media corresponding to key");
        }
        return new ResultObject(
            GetMediaSignedUrlGatewayResult.SUCCESS,
            `http://fakeUrl/${key}?abcsd`
        );
    }

    async deleteMedia(
        key: string
    ): Promise<ResultObject<DeleteMediaGatewayResult, undefined>> {
        if (!this.data.has(key)) {
            throw new Error(`Media does not exist ${key}`);
        } else {
            this.data.delete(key);
        }
        return new ResultObject(DeleteMediaGatewayResult.SUCCESS);
    }
}