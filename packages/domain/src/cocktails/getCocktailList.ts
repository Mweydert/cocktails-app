import { CocktailGateway } from "./cocktails.contract";
import { CocktailListResult } from "./getCocktailList.contract";

export default class GetCocktailList {
    #cocktailGateway: CocktailGateway

    constructor(cocktailGateway: CocktailGateway) {
        this.#cocktailGateway = cocktailGateway;
    }

    async execute(): Promise<CocktailListResult> {
        const res = await this.#cocktailGateway.getCocktailList();
        return {
            data: res,
            total: res.length
        }
    }
}