import { PaginationParams, PaginationResult } from "../utils/pagination.model";

export interface GetCocktailListQuery {
    pagination?: PaginationParams;
}

export interface GetCocktailListItem {
    id: string;
    name: string;
    note?: number;
    pictureUrl?: string;
}

export interface CocktailListResult {
    data: GetCocktailListItem[];
    meta: PaginationResult;
}