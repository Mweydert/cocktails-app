// TODO: folder in data

import { useMutation } from "@tanstack/react-query"
import { Ingredient } from "../models/ingredients";
import { createIngredient } from "../services/ingredients"

export interface UseCreateIngredientParams {
    onSuccess?: (data: Ingredient) => void;
    onError?: (error: unknown) => void;
}

export const useCreateIngredient = ({
    onSuccess,
    onError,
}: UseCreateIngredientParams = {}) => {
    const {
        mutate,
        isLoading,
        isError,
        error,
        isSuccess
    } = useMutation({
        mutationFn: createIngredient,
        onError,
        onSuccess,
    });

    return {
        mutate,
        isLoading,
        isError,
        error,
        isSuccess
    };
}