import { useQuery } from "@tanstack/react-query"
import { getCocktail } from "../../services/cocktails"
import QUERY_KEYS from "../keys"

export const useGetCocktail = (id: string) => {
    const {
        isLoading,
        isError,
        error,
        isSuccess,
        data
    } = useQuery({
        queryKey: [QUERY_KEYS.COCKTAILS, id],
        queryFn: () => getCocktail(id)
    });
    return {
        isLoading,
        isError,
        error,
        isSuccess,
        data
    }
}