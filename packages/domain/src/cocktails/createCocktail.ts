import { CocktailGateway } from "./cocktails.contract";
import Cocktail from "./model";
import logger from "../utils/logger";
import { CreateCocktailCommand } from "./createCocktail.contract";

// TODO: manage conflict in cocktail name

export default class CreateCocktail {
    #cocktailGateway: CocktailGateway;

    constructor(cocktailGateway: CocktailGateway) {
        this.#cocktailGateway = cocktailGateway;
    }

    async execute({ name, note }: CreateCocktailCommand): Promise<Cocktail> {
        logger.debug("Create new cocktail");

        const cocktail = new Cocktail({
            name,
            note
        })
        await this.#cocktailGateway.createCocktail(cocktail);


        logger.debug(`Successfully created new cocktail ${cocktail.id}`);
        return cocktail;
    }
}