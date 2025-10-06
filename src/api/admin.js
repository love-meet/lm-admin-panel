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
  try {
    const res = await api.patch(`/admin/verify-user/${userId}`);
    return res;
  } catch (err) {
    console.error('[adminApi] verifyUser error', err);
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

const adminApi = {
  getAllUsers,
  getUserById,
  deleteUser,
  disableUser,
  enableUser,
  verifyUser,
  getNotificationCount,
  getNotificationsList,
  getTransactions,
  getTransactionById,
  refundTransaction,
  getReports,
  getStats,
  getStatsList,
};

export default adminApi;
