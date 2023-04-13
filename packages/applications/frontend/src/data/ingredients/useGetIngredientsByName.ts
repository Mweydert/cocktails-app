import { useQuery } from "@tanstack/react-query"
import { getIngredientsByName } from "../../services/ingredients";
import QUERY_KEYS from "../keys"

export interface UseGetIngredientsByNameOptions {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
}

export const useGetIngredientsByName = (
    search?: string,
    options?: UseGetIngredientsByNameOptions
) => {
    const {
        isLoading,
        isError,
        error,
        isSuccess,
        data
    } = useQuery({
        queryKey: [QUERY_KEYS.INGREDIENTS, search],
        queryFn: () => getIngredientsByName(search),
        ...options
    });
    return {
        isLoading,
        isError,
        error,
        isSuccess,
        data
    }
}