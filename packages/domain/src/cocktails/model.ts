import { v4 as uuid } from "uuid";
import { Ingredient } from "../ingredients";

interface CocktailPayload {
    id?: string;
    name: string;
    note?: number;
    pictureKey?: string;
}

class Cocktail {
    id: string;
    name: string;
    note?: number;
    pictureKey?: string;
    ingredients?: Ingredient[];

    constructor(
        payload: CocktailPayload,
        ingredients?: Ingredient[]
    ) {
        this.id = payload.id ?? uuid();
        this.name = payload.name;
        this.note = payload.note;
        this.pictureKey = payload.pictureKey;
        if (ingredients) {
            this.ingredients = ingredients;
        }
    }
}

export default Cocktail;