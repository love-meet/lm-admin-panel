import { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes/Route';
import { Toaster } from 'sonner';
import SimpleLoader from './components/SimpleLoader';

// Lazy load Layout component
const Layout = lazy(() => import('./layouts/Layout'));

function createRouteConfig(routes) {
  return routes.map((route) => {
    const routeConfig = {
      path: route.path,
      element: (
        <Suspense fallback={<SimpleLoader />}>
          {route.element}
        </Suspense>
      ),
    };

    if (route.index) {
      routeConfig.index = route.index;
    }

    if (route.children && route.children.length > 0) {
      routeConfig.children = createRouteConfig(route.children);
    }

    return routeConfig;
  });
}

// Create the router with nested route support
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<SimpleLoader />}>
        <Layout />
      </Suspense>
    ),
    children: createRouteConfig(routes)
  }
]);

function App() {

  return (
    <Suspense fallback={<SimpleLoader />}>
      <Toaster richColors position='bottom-left'/>
      <RouterProvider router={router} />
    </Suspense>
  ) 
}

export default App