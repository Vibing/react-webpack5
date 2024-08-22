import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from './pages/Layout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [{ path: 'about', lazy: () => import('./pages/About') }],
  },
]);
