import {
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Tag,
    TagCloseButton,
    TagLabel,
    useToast
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Autocomplete from "../../components/common/Form/Autocomplete";
import RatingInput from "../../components/common/Form/RatingInput";
import { useCreateCocktail } from "../../data/useCreateCocktail";
import { Ingredient } from "../../models/ingredients";
import { CreateCocktailPayload } from "../../models/payloads";
import { ROUTE_PATH } from "../../router";
import styles from "./AddCocktail.module.scss";
import { useCocktailIngredients } from "../../businessHooks/useCocktailIngredients";

const AddCocktail = () => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        watch
    } = useForm<CreateCocktailPayload>();

    const navigate = useNavigate();

    const toast = useToast();

    const {
        mutate: handleCreateCocktail,
        isLoading,
    } = useCreateCocktail({
        onError: (err: unknown) => {
            console.error(err);
            toast({
                title: t("addCocktail.toasters.error.title"),
                description: t("addCocktail.toasters.error.description"),
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        },
        onSuccess: () => {
            toast({
                title: t("addCocktail.toasters.success.title"),
                description: t("addCocktail.toasters.success.description"),
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            navigate(ROUTE_PATH.HOME);
        }
    });

    const onSubmit = (data: CreateCocktailPayload) => {
        handleCreateCocktail(data);
    }

    const { t } = useTranslation();
    
    const selectedIngredients = watch("ingredients");
    const {
        handleIngredientNameSearch,
        selectableIngredients,
        isLoading: isLoadingSelectaleIngredients,
    } = useCocktailIngredients(
        selectedIngredients,
        {
            onError: (err: unknown) => {
                console.error(err);
                toast({
                    title: t("addCocktail.toasters.errorGetIngredients.title"),
                    description: t("addCocktail.toasters.errorGetIngredients.description"),
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
    );

    // TODO: enable to create new ingredients here

    return (
        <div className={styles.container}>
            <h1>{t("addCocktail.title")}</h1>

            <form onSubmit={handleSubmit(onSubmit)} className={styles.content}>

                <div className={styles["form-group"]}>
                    <FormControl isInvalid={!!errors.name}>
                        <FormLabel htmlFor='name'>{t("addCocktail.form.name")}</FormLabel>
                        <Input
                            id="name"
                            {...register("name", {
                                required: t("addCocktail.form.errors.required") || true
                            })}
                        />
                        <FormErrorMessage>
                            {errors?.name?.message}
                        </FormErrorMessage>
                    </FormControl>

                </div>

                <div className={styles["form-group"]}>
                    <FormControl isInvalid={!!errors.note}>
                        <FormLabel htmlFor='note'>{t("addCocktail.form.rate")}</FormLabel>
                        <Controller
                            control={control}
                            name="note"
                            render={({
                                field: { onChange, value },
                            }) => (
                                <RatingInput
                                    onRate={(rate) => {
                                        onChange(rate);
                                    }}
                                    defaultRate={value}
                                />
                            )}
                        />

                        <FormErrorMessage>
                            {errors?.note?.message}
                        </FormErrorMessage>
                    </FormControl>
                </div>

                <div className={styles["form-group"]}>
                    <FormControl isInvalid={!!errors.pictures}>
                        <FormLabel htmlFor="pictures">{t("addCocktail.form.pictures")}</FormLabel>
                        <input
                            type="file"
                            accept="image/png,image/jpeg,image/jpg"
                            {...register("pictures")}
                        />
                        <FormErrorMessage>
                            {errors?.pictures?.message}
                        </FormErrorMessage>
                    </FormControl>
                </div>

                <div className={styles["form-group"]}>
                    <FormControl isInvalid={!!errors.pictures}>
                        <FormLabel htmlFor="ingredients">{t("addCocktail.form.ingredients.title")}</FormLabel>
                        <Controller
                            control={control}
                            name="ingredients"
                            render={({
                                field: { onChange, value },
                            }) => {
                                const handleAddIngredient = (ingredient: Ingredient) => {
                                    const newValue = value ? [...value, ingredient] : [ingredient];
                                    onChange(newValue);
                                };
                                const handleRemoveIngredient = (ingredient: Ingredient) => {
                                    const newVal = value?.filter(item => item.id !== ingredient.id);
                                    onChange(newVal);
                                }

                                return (
                                    <>
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
                                            placeholder={t("addCocktail.form.ingredients.placeholder") || ""}
                                            noContentLabel={t("addCocktail.form.ingredients.noMatch") || ""}
                                            onSearch={handleIngredientNameSearch}
                                            options={selectableIngredients}
                                            isLoading={isLoadingSelectaleIngredients}
                                        />
                                    </>
                                );
                            }}
                        />
                        <FormErrorMessage>
                            {errors?.ingredients?.message}
                        </FormErrorMessage>
                    </FormControl>
                </div>

                <div className={styles.cta}>
                    <Button
                        type="submit"
                        colorScheme="yellow"
                        isLoading={isLoading}
                    >{t("addCocktail.form.cta")}</Button>
                </div>
            </form>
        </div >
    )
};

export default AddCocktail;