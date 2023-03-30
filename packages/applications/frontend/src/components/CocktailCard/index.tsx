import styles from "./CocktailCard.module.scss";

interface CocktailCardParams {
    name: string;
    note?: number;
    pictureUrl?: number;
}

const CocktailCard = ({
    name,
    note,
    pictureUrl
}: CocktailCardParams) => {
    return (
        <div className={styles.container}>
            <h2>{name}</h2>
            <div>
                {note && <p>{note}</p>}
                <img src={pictureUrl} alt="" />
            </div>
        </div>
    )
}

export default CocktailCard;