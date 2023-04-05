import { useTranslation } from "react-i18next";
import styles from "./CocktailDetail.module.scss";
import { useParams } from "react-router-dom";
import { useGetCocktail } from "../../data/useGetCocktail";
import { Alert, CircularProgress } from "@chakra-ui/react";
import RatingInput from "../../components/common/Form/RatingInput";

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
                            <RatingInput disabled defaultRate={data.note} onRate={() => null} />
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