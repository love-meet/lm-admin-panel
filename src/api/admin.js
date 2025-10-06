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

export const getDashboardUserGrowth = async (params = {}) => {
  try {
    const res = await api.get('/admin/dashboard/user-growth', { params });
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
  getReports,
  getAllPosts,
  getPostById,
  moderatePost,
  deletePost,
  getStats,
  getStatsList,
  getDashboardTotalUsers,
  getDashboardPostsToday,
  getDashboardNewSignups,
  getDashboardUserGrowth,
  getDashboardSummary,
  getDashboardSubscriptionRevenue,
};

export default adminApi;
