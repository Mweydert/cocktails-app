import { CocktailGateway, CreateCocktailCommand } from "./cocktails.contract";
import Cocktail from "./model";

export class CreateCocktail {
    #cocktailGateway: CocktailGateway;

    constructor(cocktailGateway: CocktailGateway) {
        this.#cocktailGateway = cocktailGateway;
    }

    async execute(command: CreateCocktailCommand) {
        const cocktail = new Cocktail({
            name: command.name,
            note: command.note
        })
        await this.#cocktailGateway.createCocktail(cocktail);
        return cocktail;
    }
}