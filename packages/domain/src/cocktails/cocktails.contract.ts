import { Ingredient } from "../ingredients";
import { PaginatedListResult, PaginationParams } from "../utils/pagination.model";
import ResultObject from "../utils/resultObject";
import Cocktail from "./model";

export interface UpdateCocktailPayload {
    note?: number;
    pictureKey?: string;
    ingredients?: Ingredient[];
}

export enum CreateCocktailGatewayResult {
    SUCCESS = "success"
}

export enum GetCocktailGatewayResult {
    SUCCESS = "success",
    NOT_FOUND = "not_found"
}

export enum GetCocktailListGatewayResult {
    SUCCESS = "success"
}

export enum UpdateCocktailGatewayResult {
    SUCCESS = "success",
    UNHANDLED_ERROR = "unhandled_error"
}

export interface CocktailGateway {
    createCocktail: (
        cocktail: Cocktail
    ) => Promise<ResultObject<CreateCocktailGatewayResult, undefined>>;
    getCocktail: (
        id: string,
        includeIngredients?: boolean
    ) => Promise<ResultObject<GetCocktailGatewayResult, Cocktail>>;
    getCocktailByName: (
        name: string
    ) => Promise<ResultObject<GetCocktailGatewayResult, Cocktail>>;
    getCocktailList: (
        pagination?: PaginationParams
    ) => Promise<ResultObject<GetCocktailListGatewayResult, PaginatedListResult<Cocktail>>>;
    updateCocktail: (
        id: string,
        payload: UpdateCocktailPayload
    ) => Promise<ResultObject<UpdateCocktailGatewayResult, undefined>>;
}