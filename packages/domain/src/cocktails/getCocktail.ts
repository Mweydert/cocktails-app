import { CocktailGateway, GetCocktailQuery } from "./cocktails.contract";
import Cocktail from "./model";
import logger from "../utils/logger";

export default class GetCocktail {
    #cocktailGateway: CocktailGateway;

    constructor(cocktailGateway: CocktailGateway) {
        this.#cocktailGateway = cocktailGateway;
    }

    async execute({id}: GetCocktailQuery): Promise<Cocktail | null> {
        logger.debug(`Get cocktail ${id}`);

        const cocktail = await this.#cocktailGateway.getCocktail(id);
        
        logger.debug(`Successfully got cocktail ${id}`);
        return cocktail;
    }
}