import Home from "./pages/Home";

export enum ROUTE_PATH {
    HOME = "/"
}

export const routes = [
    {
        path: ROUTE_PATH.HOME,
        element: <Home />,
    }
];
