import { ChakraProvider } from "@chakra-ui/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import styles from "./App.module.scss";
import Header from "./components/common/Header";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import { routes } from "./router";

const router = createBrowserRouter(routes);

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ChakraProvider>
                <div className={styles.container}>
                    <Header />
                    <div className={styles.content}>
                        <RouterProvider router={router} />
                    </div>
                </div>
            </ChakraProvider>
        </QueryClientProvider>
    )
}

export default App
