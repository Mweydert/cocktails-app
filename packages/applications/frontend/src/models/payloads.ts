import { Ingredient } from "./ingredients";

export interface CreateCocktailPayload {
    name: string;
    note?: number;
    pictures?: FileList;
    ingredients?: Ingredient[];
}

export interface UpdateCocktailPayload {
    note?: number;
    picture?: File;
    ingredients?: Ingredient[];
}

export interface CreateIngredientPayload {
    name: string;
}