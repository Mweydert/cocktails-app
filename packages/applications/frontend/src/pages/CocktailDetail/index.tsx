import { useTranslation } from "react-i18next";
import styles from "./CocktailDetail.module.scss";
import { useParams } from "react-router-dom";
import { useGetCocktail } from "../../data/useGetCocktail";
import { Alert, CircularProgress, useToast } from "@chakra-ui/react";
import RatingInput from "../../components/common/Form/RatingInput";
import { useUpdateCocktail } from "../../data/useUpdateCocktail";

const CocktailDetail = () => {
    const { t } = useTranslation();
    // TODO: implement goBack
    // TODO: add picture to URL return

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

    const { mutate } = useUpdateCocktail(cocktailId, {
        onSuccess: () => {
            toast({
                title: t("cocktailDetail.toasters.success.title"),
                description: t("cocktailDetail.toasters.success.description"),
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        },
        onError: (err) => {
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
                            {data.pictureUrl ? (
                                <img src={data.pictureUrl} alt="" />
                            ): (
                                <div className={styles["no-picture"]}>
                                    {t("cocktailDetail.noPicture")}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
};

export default CocktailDetail;