import Home from "./pages/Home";
import AddCocktail from "./pages/AddCocktail";
import CocktailDetail from "./pages/CocktailDetail";

export enum ROUTE_PATH {
    HOME = "/",
    ADD_COCKTAIL = "/add",
    COCKTAIL_DETAIL = "/:cocktailId"
}

export const routes = [
    {
        path: ROUTE_PATH.HOME,
        element: <Home />,
    },
    {
        path: ROUTE_PATH.ADD_COCKTAIL,
        element: <AddCocktail />,
    },
    {
        path: ROUTE_PATH.COCKTAIL_DETAIL,
        element: <CocktailDetail />,
    },
];
