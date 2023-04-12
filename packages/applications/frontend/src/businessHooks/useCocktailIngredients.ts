import { useState } from "react";
import { useGetIngredientsByName } from "../data/useGetIngredientsByName";
import { Ingredient } from "../models/ingredients";

interface CocktailIngredientsQueryOptions {
    onError: (err: unknown) => void;
}

// TODO: custom components for that

export const useCocktailIngredients = (
    selectedIngredients?: Ingredient[],
    queryOptions?: CocktailIngredientsQueryOptions
) => {
    const [search, setSearch] = useState<string>();
    const handleIngredientNameSearch = (value: string) => {
        setSearch(value);
    }

    const {
        isLoading,
        isError,
        data
    } = useGetIngredientsByName(search, queryOptions);
    const selectedIngredientIds = new Set(selectedIngredients?.map(items => items.id));
    const selectableIngredients = data
        ?.filter(ingredient => !selectedIngredientIds.has(ingredient.id))
        ?.map(ingredient => ({
            key: ingredient.id,
            label: ingredient.name
        })) || [];

    return {
        handleIngredientNameSearch,
        selectableIngredients,
        isLoading,
        isError
    }
}