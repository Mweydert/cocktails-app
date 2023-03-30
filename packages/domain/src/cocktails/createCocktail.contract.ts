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