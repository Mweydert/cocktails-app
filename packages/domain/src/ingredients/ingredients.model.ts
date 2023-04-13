import { v4 as uuid } from "uuid";
import { Cocktail } from "../cocktails";

interface IngredientPayload {
    id?: string;
    name: string;
    cocktails?: Cocktail[];
}

export default class Ingredient {
    id: string;
    name: string;
    cocktails?: Cocktail[];

    constructor({
        id,
        name,
        cocktails
    }: IngredientPayload) {
        this.id = id ?? uuid();
        this.name = name;
        if (cocktails) {
            this.cocktails = cocktails;
        }
    }
}