import { CocktailGateway, CreateCocktailCommand } from "./cocktails.contract";
import Cocktail from "./model";

// TODO: manage conflict in cocktail name

export default class CreateCocktail {
    #cocktailGateway: CocktailGateway;

    constructor(cocktailGateway: CocktailGateway) {
        this.#cocktailGateway = cocktailGateway;
    }

    async execute(command: CreateCocktailCommand) {
        console.log("toto");
        const cocktail = new Cocktail({
            name: command.name,
            note: command.note
        })
        await this.#cocktailGateway.createCocktail(cocktail);
        return cocktail;
    }
}