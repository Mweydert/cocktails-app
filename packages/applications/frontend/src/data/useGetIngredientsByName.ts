import { useQuery } from "@tanstack/react-query"
import { getIngredientsByName } from "../services/ingredients";
import QUERY_KEYS from "./keys"

export const useGetIngredientsByName = (search?: string) => {
    const {
        isLoading,
        isError,
        error,
        isSuccess,
        data
    } = useQuery({
        queryKey: [QUERY_KEYS.INGREDIENTS, search],
        queryFn: () => getIngredientsByName(search)
    });
    return {
        isLoading,
        isError,
        error,
        isSuccess,
        data
    }
}