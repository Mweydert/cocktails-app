import { ResultObject } from "../utils";
import Ingredient from "./ingredients.model";

export enum CREATE_INGREDIENT_RESULT {
    SUCCESS = "success"
}

export interface IngredientGateway {
    createIngredient: (
        ingredient: Ingredient
    ) => Promise<ResultObject<CREATE_INGREDIENT_RESULT, void>>
}