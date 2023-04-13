import { useMutation } from "@tanstack/react-query"
import { createCocktail } from "../../services/cocktails"

export interface UseCreateCocktailParams {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
}

export const useCreateCocktail = ({
    onSuccess,
    onError,
}: UseCreateCocktailParams = {}) => {
    const {
        mutate,
        isLoading,
        isError,
        error,
        isSuccess
    } = useMutation({
        mutationFn: createCocktail,
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