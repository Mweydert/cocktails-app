import { ResultObject } from "../utils";
import { CreateIngredientCommand, CreateIngredientResult } from "./createIngredient.contract";
import { CREATE_INGREDIENT_RESULT, IngredientGateway } from "./ingredients.contract";
import Ingredient from "./ingredients.model";

export default class CreateIngredient {
    #ingredientGateway: IngredientGateway;

    constructor(ingredientGateway: IngredientGateway) {
        this.#ingredientGateway = ingredientGateway;
    }

    async execute(
        command: CreateIngredientCommand
    ): Promise<ResultObject<CreateIngredientResult, Ingredient>> {
        const ingredient = new Ingredient({
            name: command.name
        });

        const createIngredientRes = await this.#ingredientGateway.createIngredient(ingredient);
        if (createIngredientRes.result !== CREATE_INGREDIENT_RESULT.SUCCESS) {
            // TODO: characterize error returned here (fail to create ingredient for example)
            return new ResultObject(CreateIngredientResult.UNHANDLED_ERROR);
        }

        return new ResultObject(CreateIngredientResult.SUCCESS, ingredient);
    }
}