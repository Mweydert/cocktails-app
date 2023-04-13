import { Ingredient } from "../../src/ingredients";
import { CREATE_INGREDIENT_RESULT, GET_INGREDIENTS_WITH_NAME_MATCHING_RESULT, GET_INGREDIENT_RESULT, IngredientGateway } from "../../src/ingredients/ingredients.contract";
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [_, item] of this.data) {
            if (item.name.toLowerCase() === name.toLowerCase()) {
                return new ResultObject(GET_INGREDIENT_RESULT.SUCCESS, item);
            }
        }
        return new ResultObject(GET_INGREDIENT_RESULT.NOT_FOUND);
    }

    async getIngredient(
        id: string
    ): Promise<ResultObject<GET_INGREDIENT_RESULT, Ingredient>> {
        const ingredient = this.data.get(id);
        if (!ingredient) {
            return new ResultObject(GET_INGREDIENT_RESULT.NOT_FOUND);
        }

        const data = new Ingredient(ingredient);
        return new ResultObject(GET_INGREDIENT_RESULT.SUCCESS, data);
    }

    async getIngredienstWithNameMatching(
        value: string
    ): Promise<ResultObject<GET_INGREDIENTS_WITH_NAME_MATCHING_RESULT, Ingredient[]>> {
        const res: Ingredient[] = [];
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [_, item] of this.data) {
            if (item.name.toLowerCase().includes(value.toLowerCase())) {
                res.push(item);
            }
        }

        return new ResultObject(
            GET_INGREDIENTS_WITH_NAME_MATCHING_RESULT.SUCCESS,
            res
        );
    }
}