import { Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes/Route';
import { Toaster } from 'sonner';
import SimpleLoader from './components/SimpleLoader';
import Layout from './layouts/Layout';

// Split routes by layout property
const layoutRoutes = routes.filter(route => route.layout !== false);
const noLayoutRoutes = routes.filter(route => route.layout === false);

// Create router config
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<SimpleLoader />}>
        <Layout />
      </Suspense>
    ),
    children: layoutRoutes.map(route => ({
      path: route.path,
      element: (
        <Suspense fallback={<SimpleLoader />}>
          {route.element}
        </Suspense>
      ),
      index: route.index,
    })),
  },
  ...noLayoutRoutes.map(route => ({
    path: route.path,
    element: (
      <Suspense fallback={<SimpleLoader />}>
        {route.element}
      </Suspense>
    ),
    index: route.index,
  })),
]);

function App() {
  return (
    <Suspense fallback={<SimpleLoader />}>
      <Toaster richColors position='bottom-left'/>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;