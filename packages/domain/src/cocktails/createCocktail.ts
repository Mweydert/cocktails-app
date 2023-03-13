import { CocktailGateway, CreateCocktailCommand } from "./cocktails.contract";
import Cocktail from "./model";
import logger from "../utils/logger";

// TODO: manage conflict in cocktail name

export default class CreateCocktail {
    #cocktailGateway: CocktailGateway;

    constructor(cocktailGateway: CocktailGateway) {
        this.#cocktailGateway = cocktailGateway;
    }

    async execute(command: CreateCocktailCommand): Promise<Cocktail> {
        logger.debug("Create new cocktail");
        
        const cocktail = new Cocktail({
            name: command.name,
            note: command.note
        })
        await this.#cocktailGateway.createCocktail(cocktail);
        
        
        logger.debug(`Successfully created new cocktail ${cocktail.id}`);
        return cocktail;
    }
}