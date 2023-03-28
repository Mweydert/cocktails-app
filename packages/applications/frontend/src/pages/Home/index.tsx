import { useGetCocktailsInfinite } from "../../data/useGetCocktailsInfinite";
import { Alert, CircularProgress } from '@chakra-ui/react'
import styles from './Home.module.scss';
import CocktailCard from "../../components/CocktailCard";


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

    return (
        <div className={styles.container}>
            <h1>Ma collection</h1>
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
            <div className={styles.actions}>
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