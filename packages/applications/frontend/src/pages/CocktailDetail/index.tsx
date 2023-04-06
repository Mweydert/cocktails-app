import { useTranslation } from "react-i18next";
import styles from "./CocktailDetail.module.scss";
import { useParams } from "react-router-dom";
import { useGetCocktail } from "../../data/useGetCocktail";
import { Alert, CircularProgress, useToast } from "@chakra-ui/react";
import RatingInput from "../../components/common/Form/RatingInput";
import { useUpdateCocktail } from "../../data/useUpdateCocktail";
import { EditIcon } from "@chakra-ui/icons";
import { ChangeEvent } from "react";

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