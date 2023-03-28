import Home from "./pages/Home";
import AddCocktail from "./pages/AddCocktail";

export enum ROUTE_PATH {
    HOME = "/",
    ADD_COCKTAIL = "/add"
}

export const routes = [
    {
        path: ROUTE_PATH.HOME,
        element: <Home />,
    },
    {
        path: ROUTE_PATH.ADD_COCKTAIL,
        element: <AddCocktail />,
    }
];
