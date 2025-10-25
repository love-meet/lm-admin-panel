import { lazy } from 'react';
import ProtectedRoute from './ProtectedRoute';

const Dashboard = lazy(() => import('../pages/Dashboard/index'));
const Users = lazy(() => import('../pages/Users/index'));
const Admins = lazy(() => import('../pages/Admins'));
const PostSection = lazy(() => import('../pages/PostSection/index'));
const Reports = lazy(() => import('../pages/Reports'));
const DashboardReports = lazy(() => import('../pages/DashboardReports'));
const ApiTester = lazy(() => import('../pages/ApiTester'));
const Transactions = lazy(() => import('../pages/Transactions/index'));
const SupportTickets = lazy(() => import('../pages/SupportTickets'));
const LiveChat = lazy(() => import('../pages/LiveChat'));
const Chat = lazy(() => import('../pages/Chat'));
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
    element: <ProtectedRoute requiredPermission="view_dashboard"><Dashboard /></ProtectedRoute>,
    name: 'Dashboard',
    showInNav: true,
    protected: true,
    layout: true,
    index: true,
  },
  {
    path: '/users',
    element: <ProtectedRoute requiredPermission="users_view"><Users /></ProtectedRoute>,
    name: 'Users',
    showInNav: true,
    protected: true,
    layout: true,
  },
  {
    path: '/admins',
    element: <ProtectedRoute requiredPermission="admin_create"><Admins /></ProtectedRoute>,
    name: 'Admins',
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
    element: <ProtectedRoute requiredPermission="reports_view"><Reports /></ProtectedRoute>,
    name: 'Reports',
    showInNav: true,
    protected: true,
    layout: true,
  },
  {
    path: '/dashboard-reports',
    element: <ProtectedRoute><DashboardReports /></ProtectedRoute>,
    name: 'Dashboard Reports',
    showInNav: true,
    protected: true,
    layout: true,
  },
  {
    path: '/api-tester',
    element: <ProtectedRoute><ApiTester /></ProtectedRoute>,
    name: 'API Tester',
    showInNav: true,
    protected: true,
    layout: true,
  },
  {
    path: '/transactions',
    element: <ProtectedRoute requiredPermission="transactions_view"><Transactions /></ProtectedRoute>,
    name: 'Transactions',
    showInNav: true,
    protected: true,
    layout: true,
  },
  {
    path: '/tickets',
    element: <ProtectedRoute requiredPermission="read_support_tickets"><SupportTickets /></ProtectedRoute>,
    name: 'Tickets',
    showInNav: true,
    protected: true,
    layout: true,
  },
  {
    path: '/livechat',
    element: <ProtectedRoute><LiveChat /></ProtectedRoute>,
    name: 'Live Chat',
    showInNav: true,
    protected: true,
    layout: true,
  },
  {
    path: '/chat',
    element: <ProtectedRoute><Chat /></ProtectedRoute>,
    name: 'Chat',
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
