import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Cocktail } from "../models/cocktails";
import { UpdateCocktailPayload } from "../models/payloads";
import { updateCocktail } from "../services/cocktails";
import QUERY_KEYS from "./keys";


export interface UseUpdateCocktailOptions {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
}

export const useUpdateCocktail = (
    id: string,
    options?: UseUpdateCocktailOptions
) => {
    const queryClient = useQueryClient();

    const {
        isLoading,
        isError,
        error,
        isSuccess,
        mutate
    } = useMutation({
        mutationFn: (data: UpdateCocktailPayload) => updateCocktail(id, data),
        ...options,
        onSuccess: (data: Cocktail) => {
            queryClient.setQueryData([QUERY_KEYS.COCKTAILS, id], data);

            if (options?.onSuccess) {
                options?.onSuccess();
            }
        }
    });
    return {
        isLoading,
        isError,
        error,
        isSuccess,
        mutate
    }
}