export interface PaginationParams {
    page?: number;
    itemPerPage?: number;
}

export interface PaginationResult {
    total: number;
    itemPerPage: number;
    page: number;
    pageCount: number;
}

export interface PaginatedListResult<T> {
    data: T[];
    meta: PaginationResult;
}