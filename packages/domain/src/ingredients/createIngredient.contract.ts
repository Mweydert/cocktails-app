export interface CreateIngredientCommand {
    name: string;
}

export enum CreateIngredientResult {
    SUCCESS = "success",
    UNHANDLED_ERROR = "unhandled_error"
}