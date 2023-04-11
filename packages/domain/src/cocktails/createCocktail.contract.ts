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
    ingredientIds?: string[]
}

export enum CreateCocktailResult {
    SUCCESS = "success",
    COCKTAIL_ALREADY_EXIST = "cocktail_already_exist",
    UNHANDLED_ERROR = "unhandled_error"
}