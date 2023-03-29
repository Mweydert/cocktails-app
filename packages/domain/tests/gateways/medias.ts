import { File } from "../../src/medias/medias.model";
import { MediaGateway } from "./../../src/medias/medias.contract";

export default class MediaInMemoryGateway implements MediaGateway {
    data: Map<string, File>

    constructor() {
        this.data = new Map<string, File>();
    }

    async storeMedia(file: File): Promise<string> {
        const id = `id-${this.data.size}`;
        this.data.set(id, file);
        return id;
    }
}