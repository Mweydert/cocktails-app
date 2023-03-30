export interface GetCocktailQuery {
    id: string;
}

export interface GetCocktailResult {
    id: string;
    name: string;
    note?: number;
    pictureUrl?: string;
}