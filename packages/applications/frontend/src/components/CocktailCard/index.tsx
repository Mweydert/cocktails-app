import { useTranslation } from "react-i18next";
import RatingInput, { RatingInputSize } from "../common/Form/RatingInput";
import styles from "./CocktailCard.module.scss";
import clsx from "clsx";

interface CocktailCardParams {
    name: string;
    note?: number;
    pictureUrl?: string;
    onClick?: () => void;
}

const CocktailCard = ({
    name,
    note,
    pictureUrl,
    onClick
}: CocktailCardParams) => {
    const { t } = useTranslation();

    return (
        <div
            className={clsx(styles.container, {[styles.clickable]: !!onClick})}
            onClick={onClick}
        >
            <div className={styles.title}>
                <h2>{name}</h2>
                <div className={styles.rate}>
                    {note ? (
                        <RatingInput
                            defaultRate={note}
                            // eslint-disable-next-line @typescript-eslint/no-empty-function
                            onRate={() => {}}
                            disabled
                            size={RatingInputSize.SMALL}
                        />
                    ) : (
                        <p>{t("cocktailCard.noRate")}</p>
                    )}
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles["picture-container"]}>
                    {pictureUrl ? (
                        <img src={pictureUrl} alt="" />
                    ): (
                        <div className={styles["no-picture"]}>
                            {t("cocktailCard.noPicture")}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CocktailCard;