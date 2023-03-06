import { CocktailGateway } from "../../src/cocktails/cocktails.contract";
import Cocktail from "../../src/cocktails/model";

export default class CocktailInMemoryGateway implements CocktailGateway {
    data: Map<string, Cocktail>

    constructor() {
        this.data = new Map<string, Cocktail>();
    }

    async createCocktail(cocktail: Cocktail) {
        if (!this.data.has(cocktail.id)) {
            this.data.set(cocktail.id, cocktail);
        }
    }
}
