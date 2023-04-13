import { useTranslation } from "react-i18next";
import styles from "./CocktailDetail.module.scss";
import { useParams } from "react-router-dom";
import { useGetCocktail } from "../../data/useGetCocktail";
import { Alert, Button, CircularProgress, Tag, TagLabel, useToast } from "@chakra-ui/react";
import RatingInput from "../../components/common/Form/RatingInput";
import { useUpdateCocktail } from "../../data/useUpdateCocktail";
import { EditIcon } from "@chakra-ui/icons";
import { ChangeEvent, useEffect, useState } from "react";
import { Ingredient } from "../../models/ingredients";
import SelectCocktailIngredients from "../../components/SelectCocktailIngredients";

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
                position: "top",
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
                position: "top",
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

    const [isEditingIngredients, setIsEditingIngredients] = useState<boolean>(false);
    const handleToggleEditIngredients = () => {
        setIsEditingIngredients(!isEditingIngredients);
    }
    const [ingredients, setIngredients] = useState<Ingredient[]>(data?.ingredients || []);
    useEffect(() => {
        if (data?.ingredients) {
            setIngredients(data.ingredients);
        }
    }, [data])
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
                    <h1 className={styles["cocktail-title"]}>{data.name}</h1>
                    <div className={styles.content}>
                        <div className={styles.rate}>
                            <RatingInput
                                defaultRate={data.note}
                                onRate={handleUpdateNote}
                            />
                        </div>
                        <div className={styles["picture-container"]}>
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
                            
                                {/* TODO: limite picture height */}
                                {data.pictureUrl ? (
                                    <img src={data.pictureUrl} alt="" />
                                ): (
                                    <div className={styles["no-picture"]}>
                                        {t("cocktailDetail.noPicture")}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={styles.ingredients}>
                            <div className={styles["title-container"]}>
                                <h2 className={styles.title}>{t("cocktailDetail.ingredients.title")}</h2>
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
                                        <SelectCocktailIngredients
                                            value={ingredients}
                                            onChange={setIngredients}
                                        />
                                    ) : (
                                        data.ingredients.map(ingredient => (
                                            <Tag borderRadius="2xl" key={ingredient.id}>
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
                                <div className={styles["save-ingredients-cta"]}>
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