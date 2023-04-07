import { File } from "../medias";

export interface UpdateCocktailCommand {
    id: string;
    note?: number;
    picture?: File;
}

export enum UpdateCocktailResult {
    SUCCESS = "success",
    COCKTAIL_NOT_EXIST = "cocktail_not_exist",
    UNHANDLED_ERROR = "unhandled_error"
}