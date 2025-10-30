import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Trending from './pages/Trending';
import Results from './pages/Results';
import NotFound from './pages/NotFound';
import MainLayout from './layouts/MainLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'upload',
        element: <Upload />,
      },
      {
        path: 'trending',
        element: <Trending />,
      },
      {
        path: 'results/:scanId',
        element: <Results />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);