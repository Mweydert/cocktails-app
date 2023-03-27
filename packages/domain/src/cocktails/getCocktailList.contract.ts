import { PaginationParams, PaginationResult } from "../utils/pagination.model";
import Cocktail from "./model";

export interface GetCocktailListQuery {
    pagination?: PaginationParams;
}

export interface CocktailListResult {
    data: Cocktail[];
    meta: PaginationResult;
}