import { Tag, TagCloseButton, TagLabel, useToast } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Ingredient } from "../../models/ingredients";
import Autocomplete from "../common/Form/Autocomplete";
import styles from "./SelectCocktailIngredients.module.scss";
import { useCocktailIngredients } from "./useCocktailIngredients";

interface SelectCocktailIngredientsProps {
    value: Ingredient[];
    onChange: (ingredients: Ingredient[]) => void;
}

const SelectCocktailIngredients = ({
    value,
    onChange
}: SelectCocktailIngredientsProps) => {    
    const handleAddIngredient = (ingredient: Ingredient) => {
        const newValue = value ? [...value, ingredient] : [ingredient];
        onChange(newValue);
    };
    const handleRemoveIngredient = (ingredient: Ingredient) => {
        const newVal = value?.filter(item => item.id !== ingredient.id);
        onChange(newVal);
    }
    
    const toast = useToast();
    const {
        handleIngredientNameSearch,
        selectableIngredients,
        isLoading: isLoadingSelectaleIngredients,
    } = useCocktailIngredients(
        value,
        {
            onError: (err: unknown) => {
                console.error(err);
                toast({
                    title: t("SelectCocktailIngredients.toasters.error.title"),
                    description: t("SelectCocktailIngredients.toasters.error.description"),
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
    );
    
    const { t } = useTranslation();

    return (
        <div>
            <div className={styles["selected-ingredients"]}>
                {value?.map(ingredient => (
                    <div className={styles["selected-ingredient"]}>
                        <Tag
                            key={ingredient.id}
                            onClick={() => handleRemoveIngredient(ingredient)}
                        >
                            <TagLabel>{ingredient.name}</TagLabel>
                            <TagCloseButton />
                        </Tag>
                    </div>
                ))}
            </div>
            <Autocomplete
                onSelect={(option) => handleAddIngredient({
                    id: option.key,
                    name: option.label
                })}
                placeholder={t("SelectCocktailIngredients.placeholder") || ""}
                noContentLabel={t("SelectCocktailIngredients.noMatch") || ""}
                onSearch={handleIngredientNameSearch}
                options={selectableIngredients}
                isLoading={isLoadingSelectaleIngredients}
            />
        </div>
    )
};

export default SelectCocktailIngredients;
