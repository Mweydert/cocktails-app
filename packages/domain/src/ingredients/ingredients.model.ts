import { v4 as uuid } from "uuid";

interface IngredientPayload {
    id?: string;
    name: string;
}

export default class Ingredient {
    id: string;
    name: string;

    constructor({
        id,
        name
    }: IngredientPayload) {
        this.id = id ?? uuid();
        this.name = name;
    }
}