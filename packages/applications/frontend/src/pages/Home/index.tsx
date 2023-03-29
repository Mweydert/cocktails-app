import { useGetCocktailsInfinite } from "../../data/useGetCocktailsInfinite";
import { Alert, Button, CircularProgress } from "@chakra-ui/react"
import styles from "./Home.module.scss";
import CocktailCard from "../../components/CocktailCard";
import { Link } from "react-router-dom";
import { ROUTE_PATH } from "../../router";
import { useTranslation } from "react-i18next"


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

    const { t } = useTranslation();

    const totalNbItems = data?.pages?.[0]?.meta?.total;


    return isLoading ? (
        <div className={styles["loader-container"]}>
            <CircularProgress isIndeterminate />
        </div>
    ) : (
        <div className={styles.container}>
            <div className={styles["top-actions"]}>
                <h1>{t("home.title")} {totalNbItems && <span>({totalNbItems})</span>}</h1>
                <Button>
                    <Link to={ROUTE_PATH.ADD_COCKTAIL}>{t("home.add")}</Link>
                </Button>
            </div>
            <div className={styles.content}>
                {isError ? (
                    <Alert status='error'>
                        {t("home.error")}
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
                        <button onClick={() => handleSeeMore()}>{t("home.seeMore")}</button>
                    )
                )}
            </div>
        </div>
    );
}

export default Home;