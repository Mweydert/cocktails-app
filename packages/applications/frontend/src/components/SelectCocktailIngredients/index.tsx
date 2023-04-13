import {
    Tag,
    TagCloseButton,
    TagLabel,
    useToast
} from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Ingredient } from "../../models/ingredients";
import Autocomplete from "../common/Form/Autocomplete";
import AddIngredientModal from "./AddIngredientModal";
import styles from "./SelectCocktailIngredients.module.scss";
import { useCocktailIngredients } from "./useCocktailIngredients";
interface SelectCocktailIngredientsProps {
    value: Ingredient[];
    onChange: (ingredients: Ingredient[]) => void;
}

const SelectCocktailIngredients = ({
    value,
    onChange,
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
                    position: "top",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
    );

    const [createIngredientModalIsOpen, setCreateIngredientModalIsOpen] = useState<boolean>(false);
    const handleCancelCreateIngredient = () => {
        setCreateIngredientModalIsOpen(false);
        setIngredientToCreate("");
    }
    // TODO: use this as isOpen boolean ? 
    const [ingredientToCreate, setIngredientToCreate] = useState<string>("");
    const handleAddNewIngredient = (value: string) => {
        setIngredientToCreate(value);
        setCreateIngredientModalIsOpen(true);
    }
    
    const handleNewIngredientCreated = (ingredient: Ingredient) => {
        handleAddIngredient(ingredient);
        setIngredientToCreate("");
        setCreateIngredientModalIsOpen(false);
    }

    const { t } = useTranslation();

    return (
        <div className={styles.container}>
            <div className={styles["selected-ingredients"]}>
                {value?.map(ingredient => (
                    <div className={styles["selected-ingredient"]}>
                        <Tag
                            borderRadius="2xl"
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
                onEnterSearch={handleAddNewIngredient}
            />
            <AddIngredientModal
                isOpen={createIngredientModalIsOpen}
                onClose={handleCancelCreateIngredient}
                onCreated={handleNewIngredientCreated}
                ingredientName={ingredientToCreate}
            />
        </div>
    )
};

export default SelectCocktailIngredients;
