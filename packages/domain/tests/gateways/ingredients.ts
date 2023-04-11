import { Ingredient } from "../../src/ingredients";
import { CREATE_INGREDIENT_RESULT, GET_INGREDIENT_RESULT, IngredientGateway } from "../../src/ingredients/ingredients.contract";
import { ResultObject } from "../../src/utils";

export default class InMemoryIngredientGateway implements IngredientGateway {
    data: Map<string, Ingredient>;

    constructor(initialData?: Ingredient[]) {
        this.data = new Map<string, Ingredient>(
            initialData?.map(
                ingredient => ([ingredient.id, ingredient])
            ) || []
        );
    }

    async createIngredient(
        ingredient: Ingredient
    ): Promise<ResultObject<CREATE_INGREDIENT_RESULT, void>> {
        if (this.data.has(ingredient.id)) {
            throw new Error("Ingredient already exist");
        }

        this.data.set(ingredient.id, ingredient);
        return new ResultObject(CREATE_INGREDIENT_RESULT.SUCCESS);
    }

    async getIngredientByName(
        name: string
    ): Promise<ResultObject<GET_INGREDIENT_RESULT, Ingredient>> {
        for (const [_, item] of this.data) {
            if (item.name.toLowerCase() === name.toLowerCase()) {
                return new ResultObject(GET_INGREDIENT_RESULT.SUCCESS, item);
            }
        }
        return new ResultObject(GET_INGREDIENT_RESULT.NOT_FOUND);
    }
}