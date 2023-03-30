export interface File {
    fileName: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
}