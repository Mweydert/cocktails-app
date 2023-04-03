import { v4 as uuid } from "uuid";

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
    pictureKey?: string

    constructor(payload: CocktailPayload) {
        this.id = payload.id ?? uuid();
        this.name = payload.name;
        this.note = payload.note;
        this.pictureKey = payload.pictureKey;
    }

    // TODO: see if needed
    updateNote(note: number) {
        this.note = note;
    }
}

export default Cocktail;