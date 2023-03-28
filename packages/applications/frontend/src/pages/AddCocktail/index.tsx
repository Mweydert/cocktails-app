import {
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    useToast
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import RatingInput from "../../components/common/Form/RatingInput";
import { useCreateCocktail } from "../../data/useCreateCocktail";
import { CreateCocktailPayload } from "../../models/payloads";
import { ROUTE_PATH } from "../../router";
import styles from "./AddCocktail.module.scss";

const AddCocktail = () => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors }
    } = useForm<CreateCocktailPayload>();

    const navigate = useNavigate();

    const {
        mutate: handleCreateCocktail,
        isLoading,
        isError,
        error,
        isSuccess
    } = useCreateCocktail({
        onError: () => {
            toast({
                title: "Ajout d'un cocktail",
                description: "Une erreur est survenue lors de l'ajout du cocktail",
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        },
        onSuccess: () => {
            toast({
                title: "Ajout d'un cocktail",
                description: "Cocktail ajouté avec succès",
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            navigate(ROUTE_PATH.HOME);
        }
    });

    const onSubmit = (data: CreateCocktailPayload) => {
        handleCreateCocktail(data,);
    }

    const toast = useToast()

    return (
        <div className={styles.container}>
            <h1>Add cocktail page</h1>

            <form onSubmit={handleSubmit(onSubmit)} className={styles.content}>

                <div className={styles["form-group"]}>
                    <FormControl isInvalid={!!errors.name}>
                        <FormLabel htmlFor='name'>Nom</FormLabel>
                        <Input
                            id="name"
                            {...register("name", {
                                required: "Merci de renseigner une valeur"
                            })}
                        />
                        <FormErrorMessage>
                            {errors?.name?.message}
                        </FormErrorMessage>
                    </FormControl>

                </div>

                <div className={styles["form-group"]}>
                    <FormControl isInvalid={!!errors.note}>
                        <FormLabel htmlFor='note'>Note</FormLabel>
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

                <div className={styles.cta}>
                    <Button
                        type="submit"
                        colorScheme="yellow"
                        isLoading={isLoading}
                    >Créer</Button>
                </div>
            </form>
        </div >
    )
};

export default AddCocktail;