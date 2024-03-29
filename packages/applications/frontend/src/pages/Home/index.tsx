import { useGetCocktailsInfinite } from "../../data/cocktails";
import { useNavigate } from "react-router-dom";
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


    const navigate = useNavigate();

    const handleCocktailCardClick = (id: string) => {
        navigate(`/${id}`);
    }

    return isLoading ? (
        <div className={styles["loader-container"]}>
            <CircularProgress isIndeterminate />
        </div>
    ) : (
        <div className={styles.container}>
            <div className={styles["top-actions"]}>
                <h1>{t("home.title")} {totalNbItems && <span>({totalNbItems})</span>}</h1>
                <Link to={ROUTE_PATH.ADD_COCKTAIL}>
                    <Button>
                        {t("home.add")}
                    </Button>
                </Link>
            </div>
            <div className={styles.content}>
                {isError ? (
                    <Alert status='error'>
                        { t("home.error") }
                    </Alert>
                ) : (
                    data?.pages.map(page => (
                        page.data.map(item => (
                            <div key={item.id}>
                                <CocktailCard
                                    name={item.name}
                                    note={item.note}
                                    pictureUrl={item.pictureUrl}
                                    onClick={() => handleCocktailCardClick(item.id)}
                                />
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