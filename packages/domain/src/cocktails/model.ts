import { v4 as uuid } from "uuid";

interface CocktailPayload {
    id?: string;
    name: string;
    note?: number;
    pictureUrl?: string;
}

class Cocktail {
    id: string;
    name: string;
    note?: number;
    pictureUrl?: string

    constructor(payload: CocktailPayload) {
        this.id = payload.id ?? uuid();
        this.name = payload.name;
        this.note = payload.note;
        this.pictureUrl = payload.pictureUrl;
    }
}

export default Cocktail;