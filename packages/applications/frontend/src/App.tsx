import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from "./pages/Home"
import styles from './App.module.scss';
import Header from './components/common/Header';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <div className={styles.container}>
          <Header />
          <div className={styles.content}>
            <Home />
          </div>
        </div>
      </ChakraProvider>
    </QueryClientProvider>
  )
}

export default App
