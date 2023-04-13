import { Ingredient } from "./ingredients";

export interface Cocktail {
    id: string;
    name: string;
    note?: number;
    pictureUrl?: string;
    ingredients?: Ingredient[];
}