export interface CreateCocktailPayload {
    name: string;
    note?: number;
    pictures?: FileList;
}

export interface UpdateCocktailPayload {
    note?: number;
    picture?: File;
}