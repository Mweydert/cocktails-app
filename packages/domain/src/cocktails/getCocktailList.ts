import { CocktailGateway } from "./cocktails.contract";
import Cocktail from "./model";

export default class GetCocktailList {
    #cocktailGateway: CocktailGateway

    constructor(cocktailGateway: CocktailGateway) {
        this.#cocktailGateway = cocktailGateway;
    }

    async execute(): Promise<Cocktail[]> {
        return this.#cocktailGateway.getCocktailList();
    }
}