import Cocktail from "app-domain/src/cocktails/model";
import { CocktailGateway } from "app-domain/src/cocktails/cocktails.contract";

export default class CocktailGatewayImpl implements CocktailGateway {
    #data: Map<string, Cocktail>;
    
    constructor() {
        this.#data = new Map<string, Cocktail>();
    }

    async createCocktail(cocktail: Cocktail) {
        this.#data.set(cocktail.id, cocktail)
        return Promise.resolve();
    }
}