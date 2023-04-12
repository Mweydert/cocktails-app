import { useTranslation } from "react-i18next";
import styles from "./CocktailDetail.module.scss";
import { useParams } from "react-router-dom";
import { useGetCocktail } from "../../data/useGetCocktail";
import { Alert, Button, CircularProgress, Divider, IconButton, Tag, TagCloseButton, TagLabel, useToast } from "@chakra-ui/react";
import RatingInput from "../../components/common/Form/RatingInput";
import { useUpdateCocktail } from "../../data/useUpdateCocktail";
import { EditIcon } from "@chakra-ui/icons";
import { ChangeEvent, useEffect, useState } from "react";
import { Ingredient } from "../../models/ingredients";
import Autocomplete from "../../components/common/Form/Autocomplete";
import { useCocktailIngredients } from "../../businessHooks/useCocktailIngredients";

const CocktailDetail = () => {
    const { t } = useTranslation();
    // TODO: implement goBack

    const { cocktailId } = useParams();
    if (!cocktailId) {
        throw new Error("No cocktail ID to fetch")
    }
    
    const {
        isLoading,
        isError,
        data
    } = useGetCocktail(cocktailId);
    
    const toast = useToast();

    const {
        isLoading: mutateLoading,
        mutate
    } = useUpdateCocktail(cocktailId, {
        onSuccess: () => {
            toast({
                title: t("cocktailDetail.toasters.success.title"),
                description: t("cocktailDetail.toasters.success.description"),
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        },
        onError: (err: unknown) => {
            console.error(err);
            toast({
                title: t("cocktailDetail.toasters.error.title"),
                description: t("cocktailDetail.toasterss.error.descripition"),
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    });

    const handleUpdateNote = (newNote: number) => {
        mutate({
            note: newNote
        });
    }

    const handleFileSelected = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length) {
            mutate({
                picture: event.target.files[0]
            });
        } else {
            console.info("No picture selected");
        }
    }

    // TODO: custom hook ?

    const [isEditingIngredients, setIsEditingIngredients] = useState<boolean>(false);
    const handleToggleEditIngredients = () => {
        setIsEditingIngredients(!isEditingIngredients);
    }

    const [ingredients, setIngredients] = useState<Ingredient[]>(data?.ingredients || []);
    useEffect(() => {
        if (data?.ingredients) {
            setIngredients(data.ingredients);
        }
    }, [data]);
    const handleAddIngredient = (ingredient: Ingredient) => {
        const newValue = ingredients ? [...ingredients, ingredient] : [ingredient];
        setIngredients(newValue);
    };
    const handleRemoveIngredient = (ingredient: Ingredient) => {
        const newVal = ingredients?.filter(item => item.id !== ingredient.id);
        setIngredients(newVal);
    }
    const {
        handleIngredientNameSearch,
        selectableIngredients,
        isLoading: isLoadingSelectaleIngredients,
    } = useCocktailIngredients(
        ingredients,
        {
            onError: (err: unknown) => {
                console.error(err);
                toast({
                    title: t("cocktailDetail.toasters.errorGetIngredients.title"),
                    description: t("cocktailDetail.toasters.errorGetIngredients.description"),
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
    );

    const handleUpdateIngredients = () => {
        mutate({
            ingredients
        }, {
            onSuccess: () => {
                setIsEditingIngredients(false);
            }
        });
    }


    return isLoading ? (
        <div className={styles["loader-container"]}>
            <CircularProgress isIndeterminate />
        </div>
    ) : (
        <div className={styles.container}>
            {isError || !data ? (
                <Alert status='error'>
                    { t("cocktailDetail.error") }
                </Alert>
            ) : (
                <>
                    <h1>{data.name}</h1>
                    <div className={styles.content}>
                        <div className={styles.rate}>
                            <RatingInput
                                defaultRate={data.note}
                                onRate={handleUpdateNote}
                            />
                        </div>
                        <div className={styles.picture}>
                            <div className={styles["edit-picture-cta"]}>
                                <label htmlFor="file-input">
                                    <div className={styles["cta-icon"]}>
                                        <EditIcon />
                                    </div>
                                </label>
                                
                                <input
                                    id="file-input"
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg"
                                    onChange={handleFileSelected}
                                />
                            </div>
                            
                            {data.pictureUrl ? (
                                <img src={data.pictureUrl} alt="" />
                            ): (
                                <div className={styles["no-picture"]}>
                                    {t("cocktailDetail.noPicture")}
                                </div>
                            )}
                        </div>
                        <div className={styles.ingredients}>
                            <div className={styles.title}>
                                <span>{t("cocktailDetail.ingredients.title")}</span>
                                <div
                                    className={styles["cta-icon"]}
                                    onClick={handleToggleEditIngredients}
                                >
                                    {isEditingIngredients ? (
                                        <span>{t("cocktailDetail.ingredients.cancel")}</span>
                                    ) : (
                                        <EditIcon />
                                    )}
                                </div>
                            </div>
                            {data.ingredients ? (
                                <div className={styles["ingredients-list"]}>
                                    {isEditingIngredients ? (
                                        <>
                                            <div className={styles["selected-ingredients"]}>
                                                {ingredients?.map(ingredient => (
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
                                                placeholder={t("cocktailDetail.ingredients.edit.placeholder") || ""}
                                                noContentLabel={t("cocktailDetail.ingredients.edit.noMatch") || ""}
                                                onSearch={handleIngredientNameSearch}
                                                options={selectableIngredients}
                                                isLoading={isLoadingSelectaleIngredients}
                                            />
                                        </>
                                    ) : (
                                        data.ingredients.map(ingredient => (
                                            // Color ?
                                            <Tag key={ingredient.id}>
                                                <TagLabel>{ingredient.name}</TagLabel>
                                            </Tag>
                                        ))
                                    )}
                                </div>
                            ) : (
                                <>
                                    {!isEditingIngredients && (
                                        <p>{t("cocktailDetail.ingredients.noData")}</p>
                                    )}
                                </>
                            )}
                            {isEditingIngredients && (
                                <div>
                                    <Button
                                        colorScheme="yellow"
                                        isLoading={mutateLoading}
                                        onClick={handleUpdateIngredients}
                                    >{t("cocktailDetail.ingredients.save")}</Button>
                                </div>
                            )}
                        </div>
                    </div>
                    {mutateLoading && (
                        <div className={styles["update-loader"]}>
                            <CircularProgress isIndeterminate />
                        </div>
                    )}
                </>
            )}
        </div>
    )
};

export default CocktailDetail;