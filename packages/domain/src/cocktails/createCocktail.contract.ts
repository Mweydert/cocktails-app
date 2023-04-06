export interface CreateCocktailCommand {
    name: string;
    note?: number;
    picture?: {
        fileName: string;
        encoding: string;
        mimetype: string;
        buffer: Buffer;
        size: number;
    };
}

export enum CreateCocktailResult {
    SUCCESS = "success",
    UNHANDLED_ERROR = "unhandled_error"
}