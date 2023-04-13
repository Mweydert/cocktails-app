import { ResultObject } from "../utils";
import { GetIngredientsByNameResult } from "./getIngredientsByName.contract";
import { GET_INGREDIENTS_WITH_NAME_MATCHING_RESULT, IngredientGateway } from "./ingredients.contract";
import Ingredient from "./ingredients.model";

export default class GetIngredientsByName {
    #ingredientGateway: IngredientGateway;

    constructor(ingredientGateway: IngredientGateway) {
        this.#ingredientGateway = ingredientGateway;
    }

    async execute(
        name: string
    ): Promise<ResultObject<GetIngredientsByNameResult, Ingredient[]>> {
        const getIngredientsByNameRes = await this.#ingredientGateway.getIngredienstWithNameMatching(name);
        if (getIngredientsByNameRes.result !== GET_INGREDIENTS_WITH_NAME_MATCHING_RESULT.SUCCESS) {
            return new ResultObject(GetIngredientsByNameResult.UNHANDLED_ERROR);
        }

        return new ResultObject(
            GetIngredientsByNameResult.SUCCESS,
            getIngredientsByNameRes.data
        );
    }
}