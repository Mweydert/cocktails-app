import { CocktailGateway, GetCocktailQuery } from "./cocktails.contract";
import Cocktail from "./model";

export default class GetCocktail {
    #cocktailGateway: CocktailGateway;

    constructor(cocktailGateway: CocktailGateway) {
        this.#cocktailGateway = cocktailGateway;
    }

    async execute({id}: GetCocktailQuery): Promise<Cocktail | null> {
        return this.#cocktailGateway.getCocktail(id)
    }
}