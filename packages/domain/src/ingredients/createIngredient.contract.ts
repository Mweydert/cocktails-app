export interface CreateIngredientCommand {
    name: string;
}

export enum CreateIngredientResult {
    SUCCESS = "success",
    INGREDIENT_ALREADY_EXIST = "ingredient_already_exist",
    UNHANDLED_ERROR = "unhandled_error"
}