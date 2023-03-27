import logger from "../utils/logger";
import { CocktailGateway } from "./cocktails.contract";
import { CocktailListResult, GetCocktailListQuery } from "./getCocktailList.contract";

export default class GetCocktailList {
    #cocktailGateway: CocktailGateway

    constructor(cocktailGateway: CocktailGateway) {
        this.#cocktailGateway = cocktailGateway;
    }

    async execute({
        pagination
    }: GetCocktailListQuery): Promise<CocktailListResult> {
        logger.info("GetCocktailList", pagination);
        return this.#cocktailGateway.getCocktailList(pagination);
    }
}