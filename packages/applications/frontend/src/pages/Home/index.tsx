import { useGetCocktails } from "../../data/useGetCocktails";
import { Alert, CircularProgress } from '@chakra-ui/react'
import styles from './Home.module.scss';
import CocktailCard from "../../components/CocktailCard";


const Home = () => {
    const {
        isLoading,
        isError,
        data,
    } = useGetCocktails();

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
                    data?.data.map(item => (
                        <div key={item.id}>
                            <CocktailCard name={item.name} note={item.note} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Home;