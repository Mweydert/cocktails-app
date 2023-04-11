import { ResultObject } from "../utils";
import Ingredient from "./ingredients.model";

export enum CREATE_INGREDIENT_RESULT {
    SUCCESS = "success"
}

export enum GET_INGREDIENT_RESULT {
    SUCCESS = "success",
    NOT_FOUND = "not_found"
}

export enum GET_INGREDIENTS_WITH_NAME_MATCHING_RESULT {
    SUCCESS = "success"
}

export interface IngredientGateway {
    createIngredient: (
        ingredient: Ingredient
    ) => Promise<ResultObject<CREATE_INGREDIENT_RESULT, void>>
    getIngredientByName: (
        name: string
    ) => Promise<ResultObject<GET_INGREDIENT_RESULT, Ingredient>>
    getIngredienstWithNameMatching: (
        value: string
    ) => Promise<ResultObject<GET_INGREDIENTS_WITH_NAME_MATCHING_RESULT, Ingredient[]>>
}