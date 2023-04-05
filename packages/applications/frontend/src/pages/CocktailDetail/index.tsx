import { useTranslation } from "react-i18next";
import styles from "./CocktailDetail.module.scss";
import { useParams } from "react-router-dom";

const CocktailDetail = () => {
    const { t } = useTranslation();

    const { cocktailId } = useParams();


    return (
        <div className={styles.container}>
            <h1>{t("cocktailDetail.title")}</h1>
            <div>CONTENT {cocktailId}</div>
        </div >
    )
};

export default CocktailDetail;