import { lazy } from 'react';
import ProtectedRoute from './ProtectedRoute';

const Dashboard = lazy(() => import('../pages/Dashboard'));
const Users = lazy(() => import('../pages/Users'));
const Admins = lazy(() => import('../pages/Admins'));
const Agents = lazy(() => import('../pages/Agents'));
const PostSection = lazy(() => import('../pages/PostSection'));
const Reports = lazy(() => import('../pages/Reports'));
const Transactions = lazy(() => import('../pages/Transactions'));
const SupportTickets = lazy(() => import('../pages/SupportTickets'));
const NotFound = lazy(() => import('../pages/Notfound'));
const Login = lazy(() => import('../pages/Login'));

export const routes = [
  // Public routes
  {
    path: '/login',
    element: <Login />,
    protected: false,
    layout: false,
    showInNav: false,
    layouts: false,
  },

  // redirect root to login
  {
    path: '/',
    element: <Login />,
    protected: false,
    layout: false,
    showInNav: false,
    layouts: false,
  },

  // Protected routes
  {
    path: '/dashboard',
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
    name: 'Dashboard',
    showInNav: true,
    protected: true,
    layout: true,
    index: true,
  },
  {
    path: '/users',
    element: <ProtectedRoute><Users /></ProtectedRoute>,
    name: 'Users',
    showInNav: true,
    protected: true,
    layout: true,
  },
  {
    path: '/admins',
    element: <ProtectedRoute><Admins /></ProtectedRoute>,
    name: 'Admins',
    showInNav: true,
    protected: true,
    layout: true,
  },
  {
    path: '/agents',
    element: <ProtectedRoute><Agents /></ProtectedRoute>,
    name: 'Agents',
    showInNav: true,
    protected: true,
    layout: true,
  },
  {
    path: '/posts',
    element: <ProtectedRoute><PostSection /></ProtectedRoute>,
    name: 'Posts',
    showInNav: true,
    protected: true,
    layout: true,
  },
  {
    path: '/reports',
    element: <ProtectedRoute><Reports /></ProtectedRoute>,
    name: 'Reports',
    showInNav: true,
    protected: true,
    layout: true,
  },
  {
    path: '/transactions',
    element: <ProtectedRoute><Transactions /></ProtectedRoute>,
    name: 'Transactions',
    showInNav: true,
    protected: true,
    layout: true,
  },
  {
    path: '/tickets',
    element: <ProtectedRoute><SupportTickets /></ProtectedRoute>,
    name: 'Tickets',
    showInNav: true,
    protected: true,
    layout: true,
  },

  // 404
  {
    path: '*',
    element: <NotFound />,
    protected: false,
    layout: false,
  },
];
