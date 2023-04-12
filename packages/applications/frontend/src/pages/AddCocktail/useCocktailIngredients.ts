import { useState } from "react";
import { useGetIngredientsByName } from "../../data/useGetIngredientsByName";
import { Ingredient } from "../../models/ingredients";

export const useCocktailIngredients = (
    selectedIngredients?: Ingredient[]
) => {
    // TODO: display error ?
    const [search, setSearch] = useState<string>();

    const handleIngredientNameSearch = (value: string) => {
        setSearch(value);
    }

    const {
        isLoading,
        isError,
        data
    } = useGetIngredientsByName(search);
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