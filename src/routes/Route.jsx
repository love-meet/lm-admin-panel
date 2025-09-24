// src/routes/Route.jsx
import { lazy } from 'react';

// Lazy loaded pages
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Users = lazy(() => import('../pages/Users'));
const Admins = lazy(() => import('../pages/Admins'));
const Agents = lazy(() => import('../pages/Agents'));
const Posts = lazy(() => import('../pages/Posts'));
const Reports = lazy(() => import('../pages/Reports'));
const Transactions = lazy(() => import('../pages/Transactions'));
const Tickets = lazy(() => import('../pages/Tickets'));
const NotFound = lazy(() => import('../pages/NotFound'));
const Login = lazy(() => import('../pages/Login'));

export const routes = [
  // Public routes that don't need a layout or protection
  {
    path: '/',
    element: Login,
    protected: false,
    layout: false, // Explicitly state no layout
  },
  
  // Protected routes that require the main layout
  {
    path: '/dashbaord',
    element: <Dashboard />,
    name: 'Dashboard',
    showInNav: true,
    protected: true,
    layout: true, // Requires the main Layout component
    index: true, // This is the default child route for '/'
  },
  {
    path: '/users',
    element: < Users/>,
    name: 'Users',
    showInNav: true,
    protected: true,
    layout: true,
  },
  {
    path: '/admins',
    element: < Admins/>,
    name: 'Admins',
    showInNav: true,
    protected: true,
    layout: true,
  },
  {
    path: '/agents',
    element: < Agents/>,
    name: 'Agents',
    showInNav: true,
    protected: true,
    layout: true,
  },
  {
    path: '/posts',
    element: Posts,
    name: 'Posts',
    showInNav: true,
    protected: true,
    layout: true,
  },
  {
    path: '/reports',
    element: Reports,
    name: 'Reports',
    showInNav: true,
    protected: true,
    layout: true,
  },
  {
    path: '/transactions',
    element: Transactions,
    name: 'Transactions',
    showInNav: true,
    protected: true,
    layout: true,
  },
  {
    path: '/tickets',
    element: Tickets,
    name: 'Tickets',
    showInNav: true,
    protected: true,
    layout: true,
  },

  // 404 page for unmatched routes
  {
    path: '*',
    element: NotFound,
    protected: false,
    layout: false,
  },
];