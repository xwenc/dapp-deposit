import { RouteObject } from 'react-router-dom';
import MainLayout from '@layouts/MainLayout';

import Home from '@pages/Home';
import DappTest from '@pages/DappTest';

const Routes: RouteObject[] = [];

const mainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    { path: '/dapp', element: <DappTest /> },
    { path: '/', element: <Home /> },
  ],
};
Routes.push(mainRoutes);

export default Routes;
