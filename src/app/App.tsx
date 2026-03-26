import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AlertCircle } from 'lucide-react';
import { ErrorBoundary } from 'react-error-boundary';
import { RouterProvider } from 'react-router';
import { Toaster } from './components/ui/sonner';
import { router } from './routes';

const queryClient = new QueryClient();

const GlobalErrorFallback = ({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-md max-w-md w-full text-center space-y-4 border-t-4 border-red-500">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
        <h1 className="text-2xl font-bold text-gray-900">¡Ups! Algo salió mal</h1>
        <p className="text-gray-600">
          La aplicación encontró un error inesperado y no pudo continuar.
        </p>
        <div className="bg-red-50 p-4 rounded text-left overflow-auto mt-4">
          <p className="text-sm text-red-800 font-mono break-words">{error.message}</p>
        </div>
        <button
          onClick={resetErrorBoundary}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Intentar recargar
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary FallbackComponent={GlobalErrorFallback}>
        <RouterProvider router={router} />
        <Toaster />
      </ErrorBoundary>
    </QueryClientProvider>
  );
}
