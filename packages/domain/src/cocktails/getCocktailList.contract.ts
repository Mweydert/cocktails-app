import { PaginationParams, PaginationResult } from "../utils/pagination.model";

export interface GetCocktailListQuery {
    pagination?: PaginationParams;
}

export enum GetCocktaiListResult {
    SUCCESS = "success",
    UNHANDLED_ERROR = "unhandled_error"
}

export interface GetCocktailListItem {
    id: string;
    name: string;
    note?: number;
    pictureUrl?: string;
}

export interface CocktailListData {
    data: GetCocktailListItem[];
    meta: PaginationResult;
}