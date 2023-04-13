import { useInfiniteQuery } from "@tanstack/react-query";
import { getCocktails } from "../../services/cocktails";
import { QUERY_KEYS } from "../keys";

export const useGetCocktailsInfinite = () => {
    const {
        data,
        isError,
        error,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: [QUERY_KEYS.COCKTAILS],
        queryFn: getCocktails,
        getNextPageParam: (lastPage) => {
            if (lastPage.meta.page === lastPage.meta.pageCount) {
                return undefined;
            }

            return lastPage.meta.page + 1;
        }
    });

    return {
        data,
        isError,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status,
    }
};