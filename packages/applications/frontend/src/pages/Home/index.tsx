import { useGetCocktailsInfinite } from "../../data/useGetCocktailsInfinite";
import { Alert, Button, CircularProgress } from '@chakra-ui/react'
import styles from './Home.module.scss';
import CocktailCard from "../../components/CocktailCard";
import { Link } from "react-router-dom";
import { ROUTE_PATH } from "../../router";


const Home = () => {
    const {
        isLoading,
        isError,
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useGetCocktailsInfinite();

    const handleSeeMore = fetchNextPage;

    if (isLoading) {
        return (
            <div className={styles["loader-container"]}>
                <CircularProgress isIndeterminate />
            </div>
        );
    }

    const totalNbItems = data?.pages?.[0]?.meta?.total;

    return (
        <div className={styles.container}>
            <div className={styles["top-actions"]}>
                <h1>Ma collection {totalNbItems && <span>({totalNbItems})</span>}</h1>
                <Button>
                    <Link to={ROUTE_PATH.ADD_COCKTAIL}>Ajouter</Link>
                </Button>
            </div>
            <div className={styles.content}>
                {isError ? (
                    <Alert status='error'>
                        Une erreur est survenue lors de la récupération des éléments
                    </Alert>
                ) : (
                    data?.pages.map(page => (
                        page.data.map(item => (
                            <div key={item.id}>
                                <CocktailCard name={item.name} note={item.note} />
                            </div>
                        ))
                    ))
                )}
            </div>
            <div className={styles["bottom-actions"]}>
                {isFetchingNextPage ? (
                    <CircularProgress isIndeterminate />
                ) : (
                    hasNextPage && (
                        <button onClick={() => handleSeeMore()}>Voir plus</button>
                    )
                )}
            </div>
        </div>
    );
}

export default Home;