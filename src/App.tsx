import data from '@emoji-mart/data';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { init } from 'emoji-mart';
import { Toaster } from 'sonner';

import { Router } from '@/router/Router';

import './App.css';
import './index.css';

init({ data });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 8000),
      retry: 3,
    },
  },
});

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Router />
        <Toaster
          position="bottom-center"
          toastOptions={{
            className: 'flex flex-col items-center justify-end w-full',
          }}
        />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}

export default App;
