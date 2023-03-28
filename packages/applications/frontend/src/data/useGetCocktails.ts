import { useQuery } from "@tanstack/react-query";
import { getCocktails } from "../services/cocktails";

export const GET_COCKTAILS_QUERY_KEY = "cocktails";

export const useGetCocktails = () => {
    const {
        isLoading,
        isError,
        isSuccess,
        error,
        data,
    } = useQuery({
        queryKey: [GET_COCKTAILS_QUERY_KEY],
        queryFn: getCocktails
    });

    return {
        isLoading,
        isError,
        isSuccess,
        error,
        data,
    }
};