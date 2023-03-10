import { v4 as uuid } from "uuid";

interface CocktailPayload {
    id?: string;
    name: string;
    note?: number;
}

class Cocktail {
    id: string;
    name: string;
    note?: number;

    constructor(payload: CocktailPayload) {
        this.id = payload.id ?? uuid();
        this.name = payload.name;
        this.note = payload.note;
    }
}

export default Cocktail;