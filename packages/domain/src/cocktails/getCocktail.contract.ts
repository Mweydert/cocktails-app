import { Ingredient } from "../ingredients";

export interface GetCocktailQuery {
    id: string;
}

export enum GetCocktailResult {
    SUCCESS = "success",
    NOT_FOUNT = "not_found",
    UNHANDLED_ERROR = "unhandled_error"
}

export interface GetCocktailData {
    id: string;
    name: string;
    note?: number;
    pictureUrl?: string;
    ingredients?: Ingredient[];
}