import { File } from "../../src/medias/medias.model";
import { MediaGateway } from "./../../src/medias/medias.contract";

export default class MediaInMemoryGateway implements MediaGateway {
    data: Map<string, File>

    constructor(initialData?: File[]) {
        this.data = new Map<string, File>(
            initialData?.map(
                file => ([file.fileName, file])
            ) || []
        );
    }

    async storeMedia(file: File): Promise<string> {
        const id = `id-${this.data.size}`;
        this.data.set(id, file);
        return id;
    }

    async getMediaSignedUrl(key: string): Promise<string> {
        const media = this.data.get(key);
        if (!media) {
            throw new Error("No media corresponding to key");
        }

        return `http://fakeUrl/${key}?abcsd`;
    }
}