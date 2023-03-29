import styles from "./CocktailCard.module.scss";

interface CocktailCardParams {
    name: string;
    note?: number;
}

const CocktailCard = ({
    name,
    note
}: CocktailCardParams) => {
    return (
        <div className={styles.container}>
            <h2>{name}</h2>
            <div>
                {note && <p>{note}</p>}
                Placeholder for img
            </div>
        </div>
    )
}

export default CocktailCard;