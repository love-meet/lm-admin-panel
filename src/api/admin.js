import api from './axios';

// Admin API helper: wraps endpoints used by the admin panel.
// Each function returns the parsed response (axios interceptor already returns response.data)
// and throws on error so callers can handle errors consistently.

export const getAllUsers = async (queryParams = {}) => {
  try {
    // If you want filtering / pagination, pass queryParams e.g. { page: 1, limit: 20 }
    const res = await api.get('/admin/all-users', { params: queryParams });
    return res;
  } catch (err) {
    console.error('[adminApi] getAllUsers error', err);
    throw err;
  }
};

export const getUserById = async (userId) => {
  try {
    const res = await api.get(`/admin/get-usersById/${userId}`);
    return res;
  } catch (err) {
    console.error('[adminApi] getUserById error', err);
    throw err;
  }
};

export const updateUser = async (userId, body = {}) => {
  try {
    const res = await api.put(`/admin/update-user/${userId}`, body);
    console.log('[adminApi] updateUser response', res);
    return res;
  } catch (err) {
    console.error('[adminApi] updateUser error', err);
    throw err;
  }
};

export const deleteUser = async (userId) => {
  try {
    const res = await api.delete(`/admin/delete-user/${userId}`);
    return res;
  } catch (err) {
    console.error('[adminApi] deleteUser error', err);
    throw err;
  }
};

export const disableUser = async (userId) => {
  try {
    const res = await api.patch(`/admin/disable-user/${userId}`);
    return res;
  } catch (err) {
    console.error('[adminApi] disableUser error', err);
    throw err;
  }
};

export const enableUser = async (userId) => {
  try {
    const res = await api.patch(`/admin/enable-user/${userId}`);
    return res;
  } catch (err) {
    console.error('[adminApi] enableUser error', err);
    throw err;
  }
};

export const verifyUser = async (userId) => {
    console.log( userId);
  try {
    const res = await api.put(`/admin/verify-user/${userId}`);
    return res;
  } catch (err) {
    console.error('[adminApi] verifyUser error', err);
    throw err;
  }
};

export const unverifyUser = async (userId) => {
  try {
    const res = await api.put(`/admin/unverify-user/${userId}`);
    console.log('[adminApi] unverifyUser response', res);
    return res;
  } catch (err) {
    console.error('[adminApi] unverifyUser error', err);
    throw err;
  }
};

// Notifications
export const getNotificationCount = async (userId) => {
  try {
    const res = await api.get(`/admin/notifications/${userId}/count`);
    console.log('[adminApi] getNotificationCount response', res);
    return res;
  } catch (err) {
    console.error('[adminApi] getNotificationCount error', err);
    throw err;
  }
};

export const getNotificationsList = async (userId) => {
  try {
    const res = await api.get(`/admin/notifications/${userId}/list`);
    console.log('[adminApi] getNotificationsList response', res);
    return res;
  } catch (err) {
    console.error('[adminApi] getNotificationsList error', err);
    throw err;
  }
};

// Transactions
export const getTransactions = async (params = {}) => {
  try {
    const res = await api.get('/admin/transactions', { params });
    console.log('[adminApi] getTransactions response', res);
    return res;
  } catch (err) {
    console.error('[adminApi] getTransactions error', err);
    throw err;
  }
};

export const getTransactionById = async (transactionId) => {
  try {
    const res = await api.get(`/admin/transactions/${transactionId}`);
    console.log('[adminApi] getTransactionById response', res);
    return res;
  } catch (err) {
    console.error('[adminApi] getTransactionById error', err);
    throw err;
  }
};

export const refundTransaction = async (transactionId) => {
  try {
    const res = await api.post(`/admin/transactions/${transactionId}/refund`);
    console.log('[adminApi] refundTransaction response', res);
    return res;
  } catch (err) {
    console.error('[adminApi] refundTransaction error', err);
    throw err;
  }
};

export const disableWithdrawals = async () => {
  try {
    const res = await api.post('/admin/transactions/disable-withdrawals');
    console.log('[adminApi] disableWithdrawals response', res);
    return res;
  } catch (err) {
    console.error('[adminApi] disableWithdrawals error', err);
    throw err;
  }
};

export const enableWithdrawals = async () => {
  try {
    const res = await api.post('/admin/transactions/enable-withdrawals');
    console.log('[adminApi] enableWithdrawals response', res);
    return res;
  } catch (err) {
    console.error('[adminApi] enableWithdrawals error', err);
    throw err;
  }
};

export const disableTips = async () => {
  try {
    const res = await api.post('/admin/transactions/disable-tips');
    console.log('[adminApi] disableTips response', res);
    return res;
  } catch (err) {
    console.error('[adminApi] disableTips error', err);
    throw err;
  }
};

export const enableTips = async () => {
  try {
    const res = await api.post('/admin/transactions/enable-tips');
    console.log('[adminApi] enableTips response', res);
    return res;
  } catch (err) {
    console.error('[adminApi] enableTips error', err);
    throw err;
  }
};

// Reports
export const getReports = async (params = {}) => {
  try {
    const res = await api.get('/admin/reports', { params });
    console.log('[adminApi] getReports response', res);
    return res;
  } catch (err) {
    console.error('[adminApi] getReports error', err);
    throw err;
  }
};

// Posts
export const getAllPosts = async (params = {}) => {
  try {
    const res = await api.get('/admin/all-posts', { params });
    console.log('[adminApi] getAllPosts response', res);
    return res;
  } catch (err) {
    console.error('[adminApi] getAllPosts error', err);
    throw err;
  }
};

export const getPostsWithDetails = async (params = {}) => {
  try {
    const res = await api.get('/admin/posts-with-details', { params });
    console.log('[adminApi] getPostsWithDetails response', res);
    return res;
  } catch (err) {
    console.error('[adminApi] getPostsWithDetails error', err);
    throw err;
  }
};

export const getPostById = async (postId) => {
  try {
    const res = await api.get(`/admin/get-posts/${postId}`);
    console.log('[adminApi] getPostById response', res);
    return res;
  } catch (err) {
    console.error('[adminApi] getPostById error', err);
    throw err;
  }
};

export const moderatePost = async (postId, body = {}) => {
  try {
    const res = await api.patch(`/admin/posts/${postId}/moderate`, body);
    console.log('[adminApi] moderatePost response', res);
    return res;
  } catch (err) {
    console.error('[adminApi] moderatePost error', err);
    throw err;
  }
};

export const deletePost = async (postId) => {
  try {
    const res = await api.delete(`/admin/posts/${postId}/delete`);
    console.log('[adminApi] deletePost response', res);
    return res;
  } catch (err) {
    console.error('[adminApi] deletePost error', err);
    throw err;
  }
};

// Stats (dashboard)
export const getStats = async (params = {}) => {
  try {
    // Example endpoint: GET /admin/stats?period=daily
    const res = await api.get('/admin/stats', { params });
    console.log('[adminApi] getStats response', res);
    return res;
  } catch (err) {
    console.error('[adminApi] getStats error', err);
    throw err;
  }
};

export const getStatsList = async (metric, params = {}) => {
  try {
    // Example endpoint: GET /admin/stats/{metric}/list?period=daily
    const res = await api.get(`/admin/stats/${metric}/list`, { params });
    console.log('[adminApi] getStatsList response', res);
    return res;
  } catch (err) {
    console.error('[adminApi] getStatsList error', err);
    throw err;
  }
};

// Dashboard specific metrics
export const getDashboardTotalUsers = async () => {
  try {
    const res = await api.get('/admin/dashboard/total-users');
    console.log('[adminApi] getDashboardTotalUsers', res);
    return res;
  } catch (err) {
    console.error('[adminApi] getDashboardTotalUsers error', err);
    throw err;
  }
};

export const getDashboardPostsToday = async () => {
  try {
    const res = await api.get('/admin/dashboard/posts-today');
    console.log('[adminApi] getDashboardPostsToday', res);
    return res;
  } catch (err) {
    console.error('[adminApi] getDashboardPostsToday error', err);
    throw err;
  }
};

export const getDashboardMaleUsers = async () => {
  try {
    let allMaleUsers = [];
    let currentPage = 1;
    let totalPages = 1;

    // Fetch all pages
    do {
      const response = await getAllUsers({ page: currentPage, limit: 100 });

      // CORRECTION: The users array is in response.data directly, not response.data.data
      const users = response.data || [];

      console.log(`Page ${currentPage} users:`, users); // Debug log
      console.log('First user gender:', users[0]?.gender); // Check actual gender value

      // Filter male users from current page
      const maleUsersFromPage = users.filter(user => {
        console.log(`User ${user.username} gender:`, user.gender);
        return user.gender === "Man";
      });

      allMaleUsers = [...allMaleUsers, ...maleUsersFromPage];

      // Update pagination info - check if it exists in response.data.pagination or elsewhere
      totalPages = response.pagination?.totalPages || response.data?.pagination?.totalPages || 1;
      console.log(`Total pages: ${totalPages}, Current page: ${currentPage}`);

      currentPage++;

    } while (currentPage <= totalPages);

    console.log('Final male users count:', allMaleUsers.length);
    console.log('Final male users:', allMaleUsers);

    return {
      data: allMaleUsers,
      count: allMaleUsers.length
    };
  } catch (err) {
    console.error('[adminApi] getDashboardMaleUsers error', err);
    throw err;
  }
};

export const getDashboardFemaleUsers = async () => {
  try {
    let allFemaleUsers = [];
    let currentPage = 1;
    let totalPages = 1;

    // Fetch all pages
    do {
      const response = await getAllUsers({ page: currentPage, limit: 100 });

      // CORRECTION: The users array is in response.data directly
      const users = response.data || [];

      console.log(`Page ${currentPage} users:`, users);
      console.log('First user gender:', users[0]?.gender);

      // Filter female users from current page
      const femaleUsersFromPage = users.filter(user => {
        console.log(`User ${user.username} gender:`, user.gender);
        return user.gender === "Woman";
      });

      allFemaleUsers = [...allFemaleUsers, ...femaleUsersFromPage];

      // Update pagination info
      totalPages = response.pagination?.totalPages || response.data?.pagination?.totalPages || 1;
      console.log(`Total pages: ${totalPages}, Current page: ${currentPage}`);

      currentPage++;

    } while (currentPage <= totalPages);

    console.log('Final female users count:', allFemaleUsers.length);
    console.log('Final female users:', allFemaleUsers);

    return {
      data: allFemaleUsers,
      count: allFemaleUsers.length
    };
  } catch (err) {
    console.error('[adminApi] getDashboardFemaleUsers error', err);
    throw err;
  }
};

export const getDashboardNewSignups = async () => {
  try {
    const res = await api.get('/admin/dashboard/new-signups');
    console.log('[adminApi] getDashboardNewSignups', res);
    return res;
  } catch (err) {
    console.error('[adminApi] getDashboardNewSignups error', err);
    throw err;
  }
};

export const getDashboardTotalRevenue = async () => {
  try {
    const res = await api.get('/admin/dashboard/total-revenue');
    console.log('[adminApi] getDashboardTotalRevenue', res);
    return res;
  } catch (err) {
    console.error('[adminApi] getDashboardTotalRevenue error', err);
    throw err;
  }
};

export const getDashboardUserGrowth = async (params = {}) => {
  try {
    const res = await api.get('/admin/user-growth', { params });
    console.log('[adminApi] getDashboardUserGrowth', res);
    return res;
  } catch (err) {
    console.error('[adminApi] getDashboardUserGrowth error', err);
    throw err;
  }
};

export const getDashboardSummary = async () => {
  try {
    const res = await api.get('/admin/summary');
    console.log('[adminApi] getDashboardSummary', res);
    return res;
  } catch (err) {
    console.error('[adminApi] getDashboardSummary error', err);
    throw err;
  }
};

export const getDashboardSubscriptionRevenue = async (params = {}) => {
  try {
    const res = await api.get('/admin/dashboard/subscription-revenue', { params });
    console.log('[adminApi] getDashboardSubscriptionRevenue', res);
    return res;
  } catch (err) {
    console.error('[adminApi] getDashboardSubscriptionRevenue error', err);
    throw err;
  }
};

// Additional endpoints from task
export const getUserGrowth = async (params = {}) => {
  try {
    const res = await api.get('/admin/user-growth', { params });
    console.log('[adminApi] getUserGrowth', res);
    return res;
  } catch (err) {
    console.error('[adminApi] getUserGrowth error', err);
    throw err;
  }
};

export const getSubscriptionRevenue = async (params = {}) => {
  try {
    const res = await api.get('/admin/subscription-revenue', { params });
    console.log('[adminApi] getSubscriptionRevenue', res);
    return res;
  } catch (err) {
    console.error('[adminApi] getSubscriptionRevenue error', err);
    throw err;
  }
};

export const getDashboardStatistics = async (params = {}) => {
  try {
    const res = await api.get('/admin/dashboard/statistics', { params });
    console.log('[adminApi] getDashboardStatistics', res);
    return res;
  } catch (err) {
    console.error('[adminApi] getDashboardStatistics error', err);
    throw err;
  }
};

export const getDashboardReportsDaily = async (params = {}) => {
  try {
    const res = await api.get('/admin/dashboard/reports/daily', { params });
    console.log('[adminApi] getDashboardReportsDaily', res);
    return res;
  } catch (err) {
    console.error('[adminApi] getDashboardReportsDaily error', err);
    throw err;
  }
};

export const getDashboardReportsMonthly = async (params = {}) => {
  try {
    const res = await api.get('/admin/dashboard/reports/monthly', { params });
    console.log('[adminApi] getDashboardReportsMonthly', res);
    return res;
  } catch (err) {
    console.error('[adminApi] getDashboardReportsMonthly error', err);
    throw err;
  }
};

// Detailed reports endpoints
export const getUsersReportsDaily = async (params = {}) => {
  try {
    const res = await api.get('/admin/users/reports/daily', { params });
    console.log('[adminApi] getUsersReportsDaily', res);
    return res;
  } catch (err) {
    console.error('[adminApi] getUsersReportsDaily error', err);
    throw err;
  }
};

export const getDepositsReportsDaily = async (params = {}) => {
  try {
    const res = await api.get('/admin/deposits/reports/daily', { params });
    console.log('[adminApi] getDepositsReportsDaily', res);
    return res;
  } catch (err) {
    console.error('[adminApi] getDepositsReportsDaily error', err);
    throw err;
  }
};

export const getWithdrawalsReportsDaily = async (params = {}) => {
  try {
    const res = await api.get('/admin/withdrawals/reports/daily', { params });
    console.log('[adminApi] getWithdrawalsReportsDaily', res);
    return res;
  } catch (err) {
    console.error('[adminApi] getWithdrawalsReportsDaily error', err);
    throw err;
  }
};

export const getPostReportDaily = async (params = {}) => {
  try {
    const res = await api.get('/admin/post/report/daily', { params });
    console.log('[adminApi] getPostReportDaily', res);
    return res;
  } catch (err) {
    console.error('[adminApi] getPostReportDaily error', err);
    throw err;
  }
};

export const getAffiliateReportDaily = async (params = {}) => {
  try {
    const res = await api.get('/admin/affiliate/report/daily', { params });
    console.log('[adminApi] getAffiliateReportDaily', res);
    return res;
  } catch (err) {
    console.error('[adminApi] getAffiliateReportDaily error', err);
    throw err;
  }
};

export const getTransactionReportsDaily = async (params = {}) => {
  try {
    const res = await api.get('/admin/transaction/report/daily', { params });
    console.log('[adminApi] getTransactionReportsDaily', res);
    return res;
  } catch (err) {
    console.error('[adminApi] getTransactionReportsDaily error', err);
    throw err;
  }
};

// Admin management endpoints
export const getAdmins = async (params = {}) => {
  try {
    const res = await api.get('/admin/admins', { params });
    console.log('[adminApi] getAdmins', res);
    return res;
  } catch (err) {
    console.error('[adminApi] getAdmins error', err);
    throw err;
  }
};

export const createAdmin = async (body = {}) => {
  try {
    const res = await api.post('/admin/create-admin', body);
    console.log('[adminApi] createAdmin', res);
    return res;
  } catch (err) {
    console.error('[adminApi] createAdmin error', err);
    throw err;
  }
};

export const updateAdmin = async (adminId, body = {}) => {
  try {
    const res = await api.put(`/admin/update-admins/${adminId}`, body);
    console.log('[adminApi] updateAdmin', res);
    return res;
  } catch (err) {
    console.error('[adminApi] updateAdmin error', err);
    throw err;
  }
};

export const toggleAdminStatus = async (adminId, action) => {
  try {
    const res = await api.patch(`/admin/deactivate/activate/admin/${adminId}`, { action });
    console.log('[adminApi] toggleAdminStatus', res);
    return res;
  } catch (err) {
    console.error('[adminApi] toggleAdminStatus error', err);
    throw err;
  }
};

export const deleteAdmin = async (adminId) => {
  try {
    const res = await api.delete(`/admin/delete-admin/${adminId}`);
    console.log('[adminApi] deleteAdmin', res);
    return res;
  } catch (err) {
    console.error('[adminApi] deleteAdmin error', err);
    throw err;
  }
};

// Support Tickets
export const deleteTicket = async (ticketId) => {
  try {
    const res = await api.delete(`/admin/tickets/${ticketId}`);
    console.log('[adminApi] deleteTicket', res);
    return res;
  } catch (err) {
    console.error('[adminApi] deleteTicket error', err);
    throw err;
  }
};

const adminApi = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  disableUser,
  enableUser,
  verifyUser,
  unverifyUser,
  getNotificationCount,
  getNotificationsList,
  getTransactions,
  getTransactionById,
  refundTransaction,
  disableWithdrawals,
  enableWithdrawals,
  disableTips,
  enableTips,
  getReports,
  getAllPosts,
  getPostsWithDetails,
  getPostById,
  moderatePost,
  deletePost,
  getStats,
  getStatsList,
  getDashboardTotalUsers,
  getDashboardPostsToday,
  getDashboardMaleUsers,
  getDashboardFemaleUsers,
  getDashboardNewSignups,
  getDashboardUserGrowth,
  getDashboardSummary,
  getDashboardSubscriptionRevenue,
  getUserGrowth,
  getSubscriptionRevenue,
  getDashboardStatistics,
  getDashboardReportsDaily,
  getDashboardReportsMonthly,
  getUsersReportsDaily,
  getDepositsReportsDaily,
  getWithdrawalsReportsDaily,
  getPostReportDaily,
  getAffiliateReportDaily,
  getTransactionReportsDaily,
  getAdmins,
  createAdmin,
  updateAdmin,
  toggleAdminStatus,
  deleteAdmin,
  deleteTicket,
};

export default adminApi;
